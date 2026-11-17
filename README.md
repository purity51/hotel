# Pix Hotel frontend

This static frontend is ready to integrate with a Django backend.

## M-Pesa API configuration

Set the backend API base URL before loading the page, for example:

```html
<script>
  window.MPESA_API_BASE = 'http://127.0.0.1:8000';
</script>
<script src="js/app.js"></script>
```

Or directly set the full endpoint:

```html
<script>
  window.MPESA_ENDPOINT = 'http://127.0.0.1:8000/api/mpesa/initiate';
</script>
<script src="js/app.js"></script>
```

## Expected Django API contract

### POST /api/mpesa/initiate
Request body:

```json
{
  "amount": 15000,
  "phone": "0712345678",
  "reference": "PIX-ABC123",
  "room": "std",
  "guest": "Jane Doe"
}
```

Expected response:

```json
{
  "ok": true,
  "message": "M-Pesa STK push request initiated.",
  "reference": "PIX-ABC123"
}
```

### GET /api/bookings/:reference
Expected response:

```json
{
  "ok": true,
  "booking": {
    "reference": "PIX-ABC123",
    "payment": {
      "status": "paid"
    }
  }
}
```
