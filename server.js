const express = require('express');
const { bookRoom, viewBooking, viewGuests, cancelBooking, modifyBooking } = require('./controllers/bookingController');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/book', bookRoom);
app.get('/api/view-booking', viewBooking);
app.get('/api/view-guests', viewGuests);
app.post('/api/cancel-booking', cancelBooking);
app.post('/api/modify-booking', modifyBooking);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
