(function () {
  var ROOMS = [
    { id: 'std', tier: 'standard', name: 'Standard Room', price: 6500, max: 2, size: 22, bed: '1 queen bed', tag: 'A calm, comfortable room for one or two.', am: ['Free Wi-Fi', 'Rain shower', 'Work desk', 'Tea and coffee'] },
    { id: 'dlx', tier: 'standard', name: 'Deluxe Room', price: 9800, max: 3, size: 30, bed: '1 king bed + sofa bed', tag: 'More space, a balcony and a bathtub.', am: ['Private balcony', 'Bathtub', 'Mini fridge', 'Free Wi-Fi'] },
    { id: 'fam', tier: 'standard', name: 'Family Room', price: 12500, max: 5, size: 42, bed: '2 bedrooms', tag: 'Two bedrooms so everyone sleeps well.', am: ['Two bathrooms', 'Small lounge', 'Kitchenette', 'Extra beds'] },
    { id: 'vip', tier: 'vip', name: 'VIP Suite', price: 24000, max: 3, size: 45, bed: '1 king bed', tag: 'A private suite with a lounge and city view.', am: ['Breakfast included', 'Airport pickup', 'Separate lounge', 'Late check-out 2 pm'] },
    { id: 'pre', tier: 'vip', name: 'Presidential Suite', price: 48000, max: 4, size: 85, bed: '1 king bed + twin room', tag: 'Our best rooms, a whole top-floor corner.', am: ['All meals included', 'Private butler', 'Private terrace', 'Airport transfers'] }
  ];
  var MENU = [
    { id: 'breakfast', name: 'Breakfast', hours: '6:30 – 10:00 am', items: [
      { id: 'b1', name: 'Mandazi and masala chai', desc: 'Four fresh mandazi and a pot of spiced tea.', price: 450, sig: true },
      { id: 'b2', name: 'Full breakfast plate', desc: 'Eggs your way, sausage, tomato, beans, toast.', price: 1100 },
      { id: 'b3', name: 'Fruit and yoghurt bowl', desc: 'Pawpaw, mango, pineapple, honey, granola.', price: 650 } ] },
    { id: 'lunch', name: 'Lunch', hours: '12:00 – 3:00 pm', items: [
      { id: 'l1', name: 'Nyama choma platter', desc: 'Grilled goat ribs, kachumbari, ugali.', price: 1800, sig: true },
      { id: 'l2', name: 'Pilau with kachumbari', desc: 'Spiced rice with beef and a fresh tomato salad.', price: 950 },
      { id: 'l3', name: 'Grilled tilapia', desc: 'Whole fish, ugali, sukuma wiki.', price: 1400 },
      { id: 'l4', name: 'Vegetable githeri', desc: 'Maize and beans slow-cooked with vegetables.', price: 700 } ] },
    { id: 'dinner', name: 'Dinner', hours: '6:30 – 10:00 pm', items: [
      { id: 'd1', name: 'Beef stew with chapati', desc: 'Slow-cooked beef, two soft chapati.', price: 1200 },
      { id: 'd2', name: 'Coconut fish curry', desc: 'Coastal-style curry with steamed rice.', price: 1600, sig: true },
      { id: 'd3', name: 'Roast chicken', desc: 'Half chicken, roast potatoes, sukuma wiki.', price: 1300 },
      { id: 'd4', name: 'Passion fruit cheesecake', desc: 'Baked fresh every day.', price: 600 } ] },
    { id: 'drinks', name: 'Drinks', hours: 'All day', items: [
      { id: 'k1', name: 'Kenyan filter coffee', desc: 'Single-origin beans from Nyeri.', price: 350 },
      { id: 'k2', name: 'Fresh passion juice', desc: 'Pressed to order.', price: 400 },
      { id: 'k3', name: 'Dawa ginger tonic', desc: 'Honey, lime and fresh ginger.', price: 450 } ] }
  ];
  var VIEWS = ['home', 'rooms', 'menu', 'about', 'contact', 'book'];
  var ICON = {
    bed: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 50V16M8 38h48v12M56 38v-6a6 6 0 0 0-6-6H26v12"/><circle cx="17" cy="30" r="5"/></svg>',
    plate: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="34" r="20"/><circle cx="32" cy="34" r="12"/><path d="M10 8v14M6 8v10a4 4 0 0 0 8 0V8M58 8c-4 3-6 8-6 14h6z"/></svg>'
  };

  var today = new Date();
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var DEFAULT_PHOTOS = {
    'room-std': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'room-dlx': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    'room-fam': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'room-vip': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'room-pre': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    'dish-b1': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    'dish-b2': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    'dish-b3': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
    'dish-l1': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    'dish-l2': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
    'dish-l3': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    'dish-l4': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    'dish-d1': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    'dish-d2': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    'dish-d3': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    'dish-d4': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    'dish-k1': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
    'dish-k2': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=80',
    'dish-k3': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2e7?auto=format&fit=crop&w=900&q=80'
  };
  var state = {
    room: 'std', meals: {}, photos: Object.assign({}, DEFAULT_PHOTOS), done: null, focus: null,
    ci: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    co: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)),
    guests: 2, sent: false, paymentMethod: 'cash'
  };

  var main = document.getElementById('main');
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return 'KES ' + n.toLocaleString('en-KE'); };
  var utc = function (s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); };
  var nice = function (s) { return new Date(utc(s)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }); };
  function normalizeMpesaPhone(raw) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('254')) return '+' + digits;
    if (digits.startsWith('0')) return '+254' + digits.slice(1);
    if (digits.length === 9) return '+254' + digits;
    return '+' + digits;
  }
  function getApiBase() {
    if (window.MPESA_API_BASE) return String(window.MPESA_API_BASE).replace(/\/$/, '');
    if (window.MPESA_ENDPOINT) return String(window.MPESA_ENDPOINT).replace(/\/api\/mpesa\/initiate$/, '').replace(/\/$/, '');
    return '';
  }

  function requestMpesaPayment(details) {
    var payload = {
      amount: details.amount,
      phone: details.phone,
      reference: details.reference,
      room: details.room,
      guest: details.guest
    };
    var endpoint = window.MPESA_ENDPOINT || (getApiBase() + '/api/mpesa/initiate') || '/api/mpesa/initiate';
    if (window.fetch) {
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) {
            throw new Error((data && data.error) || 'Backend rejected payment request.');
          }
          return { ok: true, status: 'sent', data: data };
        });
      }).catch(function () {
        return { ok: true, status: 'sent', demo: true };
      });
    }
    return Promise.resolve({ ok: true, status: 'sent', demo: true });
  }

  function fetchBookingStatus(reference) {
    var endpoint = getApiBase() + '/api/bookings/' + encodeURIComponent(reference);
    return fetch(endpoint || '/api/bookings/' + encodeURIComponent(reference), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error((data && data.error) || 'Unable to fetch booking status.');
        }
        return data.booking;
      });
    }).catch(function () {
      return null;
    });
  }
  function room(id) { return ROOMS.filter(function (r) { return r.id === (id || state.room); })[0]; }
  function allDishes() { var o = []; MENU.forEach(function (c) { c.items.forEach(function (i) { o.push(i); }); }); return o; }
  function nights() {
    if (!state.ci || !state.co) return 0;
    var n = Math.round((utc(state.co) - utc(state.ci)) / 86400000);
    return n > 0 ? n : 0;
  }

  /* shared pieces */
  function photo(key, kind, alt, badge) {
    var src = state.photos[key];
    return '<div class="photo">' +
      (src ? '<img src="' + src + '" alt="' + esc(alt) + '">' : '<div class="ph">' + ICON[kind] + '<span>Photo of ' + esc(alt) + '</span></div>') +
      (badge ? '<span class="badge">VIP</span>' : '') +
      '</div>';
  }
  function roomCard(r) {
    var isSelected = r.id === state.room;
    return '<article class="card ' + (r.tier === 'vip' ? 'vip' : '') + (isSelected ? ' selected' : '') + '" data-room-card="true" data-room-id="' + r.id + '">' + photo('room-' + r.id, 'bed', r.name, r.tier === 'vip') +
      '<div class="cb"><h3>' + r.name + '</h3><p class="muted">' + r.tag + '</p>' +
      '<p class="meta">' + r.bed + ' · ' + r.size + ' m² · sleeps ' + r.max + '</p>' +
      '<ul class="chips">' + r.am.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>' +
      '<div class="cf"><p class="price">' + money(r.price) + ' <small>per night</small></p>' +
      '<button type="button" class="btn small" data-act="bookroom" data-id="' + r.id + '">' + (isSelected ? 'Selected' : 'Book this room') + '</button></div></div></article>';
  }
  function stepper(id, name) {
    var q = state.meals[id] || 0;
    return '<div class="step" role="group" aria-label="' + esc(name) + ' quantity">' +
      '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Remove one ' + esc(name) + '">−</button>' +
      '<output>' + q + '</output>' +
      '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Add one ' + esc(name) + '">+</button></div>';
  }
  function dishCard(d) {
    var q = state.meals[d.id] || 0;
    return '<article class="card">' + photo('dish-' + d.id, 'plate', d.name) +
      '<div class="cb"><h3>' + d.name + '</h3><p class="muted">' + d.desc + '</p>' +
      '<div class="cf"><p class="price">' + money(d.price) + '</p>' +
      (q ? stepper(d.id, d.name) : '<button type="button" class="btn small ghost" data-act="inc" data-id="' + d.id + '">Add to booking</button>') +
      '</div></div></article>';
  }

  /* views */
  var views = {
    home: function () {
      var feat = [room('std'), room('vip')];
      var sig = allDishes().filter(function (d) { return d.sig; });
      return '<section class="hero"><div><p class="label">Westlands, Nairobi</p>' +
        '<h1>Book a room. Add your meals. Arrive to a table.</h1>' +
        '<p class="lead">Standard rooms for everyday stays and VIP suites when you want more. Eat in our restaurant, three meals a day.</p>' +
        '<div class="actions"><a class="btn" href="#book">Book your stay</a><a class="btn ghost" href="#rooms">See rooms</a></div></div>' +
        '<dl class="facts"><div><dt>Check-in</dt><dd>from 2:00 pm</dd></div><div><dt>Check-out</dt><dd>by 10:00 am</dd></div>' +
        '<div><dt>Breakfast</dt><dd>6:30 – 10:00 am</dd></div><div><dt>Dinner</dt><dd>until 10:00 pm</dd></div></dl></section>' +
        '<section class="section"><div class="section-head"><h2>Rooms for every budget</h2><a href="#rooms">All rooms</a></div>' +
        '<div class="grid two">' + feat.map(roomCard).join('') + '</div></section>' +
        '<section class="section"><div class="section-head"><h2>From our kitchen</h2><a href="#menu">Full menu</a></div>' +
        '<div class="grid three">' + sig.map(dishCard).join('') + '</div></section>';
    },
    rooms: function () {
      var std = ROOMS.filter(function (r) { return r.tier === 'standard'; });
      var vip = ROOMS.filter(function (r) { return r.tier === 'vip'; });
      return '<header class="page-head"><h1>Rooms</h1><p class="lead">Prices are per room, per night, in Kenyan shillings. VIP rooms add space, service and extras.</p></header>' +
        '<section class="section"><div class="section-head"><h2>Standard rooms</h2></div><div class="grid three">' + std.map(roomCard).join('') + '</div></section>' +
        '<section class="section"><div class="section-head"><h2>VIP rooms</h2></div><div class="grid two">' + vip.map(roomCard).join('') + '</div></section>';
    },
    menu: function () {
      return '<header class="page-head"><h1>Menu</h1><p class="lead">Open to guests and visitors. Staying with us? Add dishes to your booking and the kitchen plans for you.</p></header>' +
        MENU.map(function (c) {
          return '<section class="section"><div class="section-head"><h2>' + c.name + '</h2><span class="muted">' + c.hours + '</span></div>' +
            '<div class="grid three">' + c.items.map(dishCard).join('') + '</div></section>';
        }).join('');
    },
    about: function () {
      return '<header class="page-head"><h1>About Pix Hotel</h1><p class="lead">A small hotel in Nairobi with a restaurant people come to even when they are not staying.</p></header>' +
        '<section class="prose"><p>Pix Hotel has 21 rooms across five room types, from everyday Standard rooms to the Presidential Suite on the top floor. We keep the hotel small so the front desk knows your name and the kitchen knows how you like your eggs.</p>' +
        '<p>Our restaurant serves breakfast, lunch and dinner every day. The menu leans on Kenyan cooking: nyama choma, pilau, fresh tilapia, coastal curries and mandazi still warm from the pan.</p>' +
        '<p>Booking is simple. Choose your dates and room, add the meals you want, and pay at the front desk when you arrive.</p></section>' +
        '<section class="section"><div class="grid three">' +
        '<div class="note-card"><h3>Standard and VIP</h3><p class="muted">Pick the room that fits your budget. VIP guests get breakfast, airport pickup and late check-out.</p></div>' +
        '<div class="note-card"><h3>Restaurant on site</h3><p class="muted">Add meals to your booking, or walk in. Open daily from 6:30 am to 10:00 pm.</p></div>' +
        '<div class="note-card"><h3>Easy to reach</h3><p class="muted">Westlands, Nairobi. Ask us about airport pickup when you book.</p></div></div></section>' +
        '<p class="note" style="margin-top:24px">Sample text for the prototype. Replace it with the hotel’s real story.</p>';
    },
    contact: function () {
      var form = state.sent
        ? '<div class="done" style="margin:0"><p class="label">Message sent</p><p>Thank you. We will reply within one working day.</p><button type="button" class="btn ghost" data-act="again-msg">Send another message</button></div>'
        : '<form id="contactForm" novalidate><div class="field"><label for="c-name">Your name</label><input id="c-name" autocomplete="name"><span class="err" id="e-cname"></span></div>' +
          '<div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email"><span class="err" id="e-cemail"></span></div>' +
          '<div class="field"><label for="c-msg">Message</label><textarea id="c-msg"></textarea><span class="err" id="e-cmsg"></span></div>' +
          '<button class="btn" type="submit">Send message</button></form>';
      return '<header class="page-head"><h1>Contact us</h1><p class="lead">Questions about rooms, meals, events or your booking? Send a message or call the front desk.</p></header>' +
        '<div class="layout"><section class="block"><h2>Send a message</h2>' + form + '</section>' +
        '<aside class="summary" style="position:static"><span class="label">Front desk</span><p><strong>+254 700 000 000</strong></p><p>hello@pixhotel.example</p>' +
        '<p class="muted">Westlands, Nairobi, Kenya</p><span class="label">Hours</span><p class="muted">Front desk: open 24 hours<br>Restaurant: 6:30 am – 10:00 pm</p></aside></div>';
    },
    book: function () {
      if (state.done) return doneView(state.done);
      var rooms = ROOMS.map(function (r) {
        return '<label class="pick"><input type="radio" name="room" value="' + r.id + '"' + (r.id === state.room ? ' checked' : '') + '>' +
          '<span class="pick-card"><strong>' + r.name + (r.tier === 'vip' ? ' <span class="badge inline">VIP</span>' : '') + '</strong>' +
          '<span class="muted">' + r.size + ' m² · sleeps ' + r.max + '</span><span class="price">' + money(r.price) + ' <small>per night</small></span></span></label>';
      }).join('');
      var meals = MENU.map(function (c) {
        return '<h3 style="margin-top:8px">' + c.name + ' <span class="muted" style="font-weight:400;font-size:.85rem">' + c.hours + '</span></h3><ul class="menu-list">' +
          c.items.map(function (d) {
            return '<li><div><strong>' + d.name + '</strong><span class="muted">' + d.desc + '</span><span class="price">' + money(d.price) + '</span></div>' + stepper(d.id, d.name) + '</li>';
          }).join('') + '</ul>';
      }).join('');
      return '<header class="page-head"><h1>Book your stay</h1><p class="lead">Choose dates and a room, add meals if you like, and send one booking. You pay at the hotel.</p></header>' +
        '<form id="bookForm" novalidate><div class="layout"><div class="col">' +
        '<section class="block"><h2>Your dates</h2><div class="fields">' +
        '<div class="field"><label for="checkin">Check-in</label><input type="date" id="checkin" min="' + iso(today) + '" value="' + state.ci + '"></div>' +
        '<div class="field"><label for="checkout">Check-out</label><input type="date" id="checkout" min="' + state.ci + '" value="' + state.co + '"></div>' +
        '<div class="field"><label for="guests">Guests</label><select id="guests"></select></div></div></section>' +
        '<section class="block"><h2>Choose a room</h2><div class="picks" id="picks">' + rooms + '</div></section>' +
        '<section class="block"><h2>Meals during your stay</h2><p class="muted">Optional. Pick serving times at the front desk.</p><div id="mealsBlock">' + meals + '</div></section>' +
        '<section class="block"><h2>Who is staying</h2><div class="fields">' +
        '<div class="field"><label for="name">Full name</label><input id="name" autocomplete="name"><span class="err" id="e-name"></span></div>' +
        '<div class="field"><label for="phone">Phone</label><input id="phone" type="tel" autocomplete="tel" placeholder="07XX XXX XXX"><span class="err" id="e-phone"></span></div></div>' +
        '<div class="field"><label for="email">Email (optional)</label><input id="email" type="email" autocomplete="email"></div>' +
        '<div class="field"><label for="requests">Special requests</label><textarea id="requests" placeholder="Late arrival, allergies, extra bed, airport pickup"></textarea></div></section>' +
        '</div><aside class="summary" aria-live="polite"><span class="label">Your booking</span><ul class="lines" id="lines"></ul>' +
        '<div class="total"><span>Total</span><span id="total">KES 0</span></div><p class="problem" id="problem" role="alert"></p>' +
        '<button class="btn" type="submit">Confirm booking</button><p class="note">Pay at the hotel when you check in. You get a reference to show at the desk.</p></aside></div></form>';
    }
  };

  function doneView(b) {
    var r = room(b.room);
    var paymentStatus = b.payment && b.payment.status ? b.payment.status : 'pending';
    var paymentReady = paymentStatus === 'pending' || paymentStatus === 'paid' || paymentStatus === 'failed';
    var paymentBox = paymentStatus === 'paid'
      ? '<div class="payment-status"><p class="label">M-Pesa payment</p><p><strong>Paid successfully</strong> to ' + esc(b.payment.phone) + '.</p><p class="note">Your payment has been confirmed.</p></div>'
      : paymentStatus === 'failed'
        ? '<div class="payment-status"><p class="label">M-Pesa payment</p><p><strong>Payment failed</strong> or was canceled.</p><button type="button" class="btn small" data-act="paympesa">Retry payment</button></div>'
        : paymentReady
          ? '<div class="payment-status"><p class="label">M-Pesa payment</p><p><strong>Request sent</strong> to ' + esc(b.payment.phone) + '.</p><p class="note">Complete the prompt on your handset to confirm the payment.</p><button type="button" class="btn small ghost" data-act="checkmpesastatus">Check payment status</button></div>'
          : '<div class="payment-box"><p class="label">Pay with M-Pesa</p>' +
            '<div class="field"><label for="mpesa-input">M-Pesa phone number</label><input id="mpesa-input" type="tel" value="' + esc(b.mpesaPhone || '') + '" placeholder="0712 345 678"><span class="err" id="mpesa-error"></span></div>' +
            '<button type="button" class="btn" data-act="paympesa">Send M-Pesa request</button>' +
            '<p class="note">This demo is wired for a backend-ready M-Pesa flow. Add your Daraja credentials and endpoint to process live transactions.</p></div>';
    return '<section class="done"><p class="label">Booking received</p><p class="ref">' + b.ref + '</p>' +
      '<p><strong>' + esc(b.name) + '</strong>, your ' + r.name + ' is booked from ' + nice(b.ci) + ' to ' + nice(b.co) + ' (' + b.nights + (b.nights === 1 ? ' night' : ' nights') + ', ' + b.guests + (b.guests === 1 ? ' guest' : ' guests') + ').</p>' +
      '<ul class="lines">' + b.lines + '</ul><p class="total"><span>Total to pay at check-in</span><span>' + money(b.total) + '</span></p>' +
      paymentBox +
      '<p class="note">Show this reference at the front desk. This prototype does not send the booking to a hotel yet.</p>' +
      '<button type="button" class="btn ghost" data-act="again">Make another booking</button></section>';
  }

  /* booking summary */
  function totals() {
    var n = nights(), r = room(), lines = [], mealTotal = 0;
    if (n) lines.push('<li><span>' + r.name + '<br><span class="sub">' + n + (n === 1 ? ' night' : ' nights') + ' × ' + money(r.price) + '</span></span><span>' + money(n * r.price) + '</span></li>');
    else lines.push('<li><span class="sub">Choose check-in and check-out dates.</span><span></span></li>');
    allDishes().forEach(function (d) {
      var q = state.meals[d.id];
      if (q) { mealTotal += q * d.price; lines.push('<li><span>' + d.name + '<br><span class="sub">' + q + ' × ' + money(d.price) + '</span></span><span>' + money(q * d.price) + '</span></li>'); }
    });
    return { lines: lines.join(''), total: n * r.price + mealTotal, nights: n };
  }
  function fillGuests() {
    var sel = document.getElementById('guests'); if (!sel) return;
    var max = room().max, html = '';
    state.guests = Math.min(state.guests, max);
    for (var i = 1; i <= max; i++) html += '<option value="' + i + '"' + (i === state.guests ? ' selected' : '') + '>' + i + (i === 1 ? ' guest' : ' guests') + '</option>';
    sel.innerHTML = html;
  }
  function refreshBook() {
    var t = totals();
    var l = document.getElementById('lines'); if (!l) return;
    l.innerHTML = t.lines;
    document.getElementById('total').textContent = money(t.total);
  }
  function syncSteppers() {
    document.querySelectorAll('#mealsBlock .step').forEach(function (s) {
      var id = s.querySelector('button').getAttribute('data-id');
      s.querySelector('output').textContent = state.meals[id] || 0;
    });
  }

  /* render and route */
  function render() {
    main.innerHTML = views[state.view]();
    document.querySelectorAll('#nav a[data-v]').forEach(function (a) {
      if (a.getAttribute('data-v') === state.view) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = state.view === 'home' ? 'Pix Hotel' : state.view.charAt(0).toUpperCase() + state.view.slice(1) + ' · Pix Hotel';
    if (state.view === 'book' && !state.done) { fillGuests(); refreshBook(); }
    if (state.focus) {
      var el = main.querySelector(state.focus); if (el) el.focus();
      state.focus = null;
    }
  }
  function route() {
    var h = location.hash.replace('#', '');
    state.view = VIEWS.indexOf(h) >= 0 ? h : 'home';
    render();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  var authContainer = document.getElementById('authContainer');
  if (authContainer) {
    var toSignUp = document.getElementById('toSignUp');
    var toLogin = document.getElementById('toLogin');
    if (toSignUp) {
      toSignUp.addEventListener('click', function () {
        authContainer.classList.add('right-panel-active');
      });
    }
    if (toLogin) {
      toLogin.addEventListener('click', function () {
        authContainer.classList.remove('right-panel-active');
      });
    }
  }

  /* events */
  main.addEventListener('click', function (e) {
    var card = e.target.closest('[data-room-card="true"]');
    if (card && !e.target.closest('[data-act]')) {
      state.room = card.getAttribute('data-room-id');
      state.done = null;
      location.hash = 'book';
      if (state.view === 'book') route();
      return;
    }

    var b = e.target.closest('[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (act === 'bookroom') { state.room = id; state.done = null; location.hash = 'book'; if (state.view === 'book') route(); return; }
    if (act === 'paympesa') {
      var input = document.getElementById('mpesa-input');
      var mpesaPhone = normalizeMpesaPhone(input ? input.value : state.done.mpesaPhone || '');
      var err = document.getElementById('mpesa-error'); if (err) err.textContent = '';
      if (!/^\+2547\d{8}$/.test(mpesaPhone)) {
        if (err) err.textContent = 'Enter a valid M-Pesa number starting with 07...';
        return;
      }
      state.done.mpesaPhone = mpesaPhone;
      state.done.payment = { method: 'mpesa', phone: mpesaPhone, status: 'pending', amount: state.done.total, reference: state.done.ref };
      requestMpesaPayment({
        amount: state.done.total,
        phone: mpesaPhone,
        reference: state.done.ref,
        room: state.done.room,
        guest: state.done.name
      }).then(function (result) {
        state.done.payment = { method: 'mpesa', phone: mpesaPhone, status: 'pending', amount: state.done.total, reference: state.done.ref, request: result && result.data ? result.data : null };
        render();
      });
      return;
    }
    if (act === 'checkmpesastatus') {
      fetchBookingStatus(state.done.ref).then(function (booking) {
        if (booking && booking.payment && booking.payment.status) {
          state.done.payment = {
            method: 'mpesa',
            phone: booking.phone || state.done.mpesaPhone,
            status: booking.payment.status,
            amount: booking.amount,
            reference: booking.reference,
            request: booking.payment
          };
        }
        render();
      });
      return;
    }
    if (act === 'inc' || act === 'dec') {
      var q = (state.meals[id] || 0) + (act === 'inc' ? 1 : -1);
      q = Math.max(0, Math.min(20, q));
      if (q) state.meals[id] = q; else delete state.meals[id];
      if (state.view === 'book') { syncSteppers(); refreshBook(); }
      else { state.focus = '[data-act="inc"][data-id="' + id + '"]'; render(); }
      return;
    }
    if (act === 'again') { state.done = null; state.meals = {}; state.room = 'std'; render(); window.scrollTo(0, 0); return; }
    if (act === 'again-msg') { state.sent = false; render(); }
  });
  main.addEventListener('change', function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute('data-photo')) {
      var f = t.files && t.files[0]; if (!f) return;
      var key = t.getAttribute('data-photo'), rd = new FileReader();
      rd.onload = function () { state.photos[key] = rd.result; render(); };
      rd.readAsDataURL(f);
      return;
    }
    if (t.name === 'room') { state.room = t.value; fillGuests(); refreshBook(); return; }
    if (t.id === 'checkin') {
      state.ci = t.value;
      var co = document.getElementById('checkout');
      if (t.value) {
        co.min = t.value;
        if (!co.value || utc(co.value) <= utc(t.value)) { co.value = new Date(utc(t.value) + 86400000).toISOString().slice(0, 10); }
        state.co = co.value;
      }
      refreshBook(); return;
    }
    if (t.id === 'checkout') { state.co = t.value; refreshBook(); return; }
    if (t.id === 'guests') { state.guests = +t.value; }
  });
  main.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.id === 'contactForm') {
      var ok = true;
      var nm = document.getElementById('c-name').value.trim(), em = document.getElementById('c-email').value.trim(), ms = document.getElementById('c-msg').value.trim();
      document.getElementById('e-cname').textContent = nm ? '' : 'Enter your name.'; if (!nm) ok = false;
      document.getElementById('e-cemail').textContent = /^\S+@\S+\.\S+$/.test(em) ? '' : 'Enter an email we can reply to.'; if (!/^\S+@\S+\.\S+$/.test(em)) ok = false;
      document.getElementById('e-cmsg').textContent = ms ? '' : 'Write your message.'; if (!ms) ok = false;
      if (ok) { state.sent = true; render(); }
      return;
    }
    if (e.target.id !== 'bookForm') return;
    var t = totals(), problem = '', good = true;
    document.getElementById('e-name').textContent = ''; document.getElementById('e-phone').textContent = '';
    if (!state.ci || !state.co) problem = 'Pick your check-in and check-out dates.';
    else if (!t.nights) problem = 'Check-out must be after check-in.';
    var name = document.getElementById('name').value.trim(), phone = document.getElementById('phone').value;
    if (!name) { document.getElementById('e-name').textContent = 'Enter your full name.'; good = false; }
    if (phone.replace(/\D/g, '').length < 9) { document.getElementById('e-phone').textContent = 'Enter a phone number we can call.'; good = false; }
    if (!problem && !good) problem = 'Fix the highlighted fields above.';
    document.getElementById('problem').textContent = problem;
    if (problem) return;
    state.done = { ref: 'PIX-' + Math.random().toString(36).slice(2, 8).toUpperCase(), name: name, room: state.room, ci: state.ci, co: state.co,
      nights: t.nights, guests: state.guests, lines: t.lines, total: t.total };
    render(); window.scrollTo(0, 0);
  });

  route();
})();