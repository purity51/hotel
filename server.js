const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isSandbox = (process.env.MPESA_ENVIRONMENT || 'sandbox').toLowerCase() === 'sandbox';
const MPESA_BASE_URL = isSandbox
  ? 'https://sandbox.safaricom.co.ke'
  : 'https://api.safaricom.co.ke';
const BOOKINGS_FILE = path.join(__dirname, 'data', 'bookings.json');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function ensureStore() {
  fs.mkdirSync(path.dirname(BOOKINGS_FILE), { recursive: true });
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, '[]', 'utf8');
  }
}

function readBookings() {
  ensureStore();
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    return [];
  }
}

function writeBookings(data) {
  ensureStore();
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function findBooking(reference) {
  return readBookings().find((booking) => booking.reference === reference);
}

function upsertBooking(booking) {
  const bookings = readBookings();
  const index = bookings.findIndex((item) => item.reference === booking.reference);

  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.push(booking);
  }

  writeBookings(bookings);
  return booking;
}

function normalizePhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

function validateConfig() {
  const required = [
    'MPESA_CONSUMER_KEY',
    'MPESA_CONSUMER_SECRET',
    'MPESA_SHORTCODE',
    'MPESA_PASSKEY',
    'MPESA_CALLBACK_URL',
    'MPESA_TIMEOUT_URL'
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    return {
      ok: false,
      missing,
      message: 'Missing M-Pesa config variables in .env. See .env.example.'
    };
  }

  return { ok: true };
}

async function getMpesaToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  return response.data.access_token;
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'pix-hotel-mpesa',
    environment: isSandbox ? 'sandbox' : 'live',
    configured: validateConfig().ok
  });
});

app.get('/api/bookings', (req, res) => {
  res.json({ ok: true, bookings: readBookings() });
});

app.get('/api/bookings/:reference', (req, res) => {
  const booking = findBooking(req.params.reference);
  if (!booking) {
    return res.status(404).json({ ok: false, error: 'Booking not found.' });
  }

  res.json({ ok: true, booking });
});

app.post('/api/mpesa/initiate', async (req, res) => {
  try {
    const { amount, phone, reference, room, guest } = req.body || {};

    if (!amount || !phone || !reference) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: amount, phone, reference.'
      });
    }

    const configCheck = validateConfig();
    if (!configCheck.ok) {
      return res.status(500).json({
        ok: false,
        error: configCheck.message,
        missing: configCheck.missing
      });
    }

    const phoneNumber = normalizePhone(phone);
    if (!/^2547\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({
        ok: false,
        error: 'Phone number must be a valid Kenyan M-Pesa number such as 0712345678.'
      });
    }

    const amountValue = Number(amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return res.status(400).json({
        ok: false,
        error: 'Amount must be a positive number.'
      });
    }

    const referenceCode = String(reference).toUpperCase();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, '');

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const token = await getMpesaToken();

    const payload = {
      BusinessShortCode: Number(process.env.MPESA_SHORTCODE),
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amountValue,
      PartyA: phoneNumber,
      PartyB: Number(process.env.MPESA_SHORTCODE),
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: referenceCode,
      TransactionDesc: `Pix Hotel booking for ${guest || room || 'guest'}`
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const booking = {
      reference: referenceCode,
      room: room || 'standard',
      guest: guest || 'Guest',
      phone: phoneNumber,
      amount: amountValue,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payment: {
        method: 'mpesa',
        requestId: response.data?.CheckoutRequestID || null,
        responseCode: response.data?.ResponseCode || null,
        responseDescription: response.data?.ResponseDescription || null,
        status: 'pending'
      }
    };

    upsertBooking(booking);

    res.json({
      ok: true,
      message: 'M-Pesa STK push request initiated.',
      data: response.data,
      phone: phoneNumber,
      reference: referenceCode,
      booking
    });
  } catch (error) {
    console.error('M-Pesa request failed:', error.response?.data || error.message);

    res.status(500).json({
      ok: false,
      error: 'M-Pesa request failed.',
      details: error.response?.data || error.message
    });
  }
});

app.post('/api/mpesa/callback', (req, res) => {
  const body = req.body || {};
  const callback = body.Body && body.Body.stkCallback ? body.Body.stkCallback : body.stkCallback || body;
  const resultCode = callback.ResultCode;
  const resultDescription = callback.ResultDesc || 'MPesa request processed';
  const metadata = callback.CallbackMetadata && callback.CallbackMetadata.Item ? callback.CallbackMetadata.Item : [];
  const itemByName = (name) => metadata.find((item) => item.Name === name);
  const amountItem = itemByName('Amount');
  const phoneItem = itemByName('PhoneNumber');
  const referenceItem = itemByName('AccountReference');
  const reference = referenceItem ? String(referenceItem.Value) : (req.body.AccountReference || '');

  if (!reference) {
    return res.status(400).json({ ResultCode: 1, ResultDesc: 'Missing account reference.' });
  }

  const booking = findBooking(reference);
  if (!booking) {
    return res.status(404).json({ ResultCode: 1, ResultDesc: 'Booking not found for callback.' });
  }

  const nextBooking = {
    ...booking,
    status: resultCode === 0 ? 'paid' : 'failed',
    updatedAt: new Date().toISOString(),
    payment: {
      ...booking.payment,
      status: resultCode === 0 ? 'paid' : 'failed',
      resultCode,
      resultDescription,
      amount: amountItem ? Number(amountItem.Value) : booking.amount,
      phone: phoneItem ? String(phoneItem.Value) : booking.phone,
      callbackAt: new Date().toISOString()
    }
  };

  upsertBooking(nextBooking);

  res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully.' });
});

app.post('/api/mpesa/timeout', (req, res) => {
  const body = req.body || {};
  const reference = body.AccountReference || body.ReferenceCode || 'unknown';
  const booking = findBooking(reference);

  if (booking) {
    upsertBooking({
      ...booking,
      status: 'timeout',
      updatedAt: new Date().toISOString(),
      payment: {
        ...booking.payment,
        status: 'timeout',
        resultDescription: 'M-Pesa request timed out.'
      }
    });
  }

  res.json({ ResultCode: 0, ResultDesc: 'Timeout acknowledged.' });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Pix Hotel backend running on http://localhost:${PORT}`);
});
