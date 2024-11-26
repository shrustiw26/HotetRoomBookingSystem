const { rooms, bookings } = require('../data/data');

// Helper function to find an available room
const findAvailableRoom = () => {
  return rooms.find(room => room.isAvailable === true);
};

// Helper function to update a room's availability
const updateRoomAvailability = (roomNumber, isAvailable) => {
  const room = rooms.find(r => r.roomNumber === roomNumber);
  if (room) room.isAvailable = isAvailable;
};

// Book Room API
const bookRoom = async (req, res) => {
  try {
    const { name, email, contact, checkInDate, checkOutDate } = req.body;

    // Log the incoming request data
    console.log('Booking Request:', req.body);

    // Find an available room
    const room = findAvailableRoom();

    if (!room) {
      console.error('No available rooms');
      return res.status(400).json({ message: 'No available rooms.' });
    }

    // Mark the room as unavailable
    updateRoomAvailability(room.roomNumber, false);

    // Insert the booking into the bookings array
    const booking = {
      name,
      email,
      contact,
      checkInDate,
      checkOutDate,
      roomNumber: room.roomNumber,
    };

    bookings.push(booking);
    console.log('Booking Result:', booking);

    res.status(201).json({ message: 'Room booked successfully', booking });
  } catch (error) {
    console.error('Error booking room:', error);
    res.status(500).json({ message: 'Error booking room', error: error.message });
  }
};

// View Booking API
const viewBooking = async (req, res) => {
  try {
    const { email } = req.query;

    const booking = bookings.find(b => b.email === email);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving booking', error });
  }
};

// View All Guests API
const viewGuests = async (req, res) => {
  try {
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving guests', error });
  }
};

// Cancel Booking API
const cancelBooking = async (req, res) => {
  try {
    const { email, roomNumber } = req.body;

    // Find the booking and remove it
    const bookingIndex = bookings.findIndex(b => b.email === email && b.roomNumber === roomNumber);
    if (bookingIndex === -1) return res.status(404).json({ message: 'Booking not found.' });

    bookings.splice(bookingIndex, 1);

    // Mark the room as available
    updateRoomAvailability(roomNumber, true);

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
  }
};

// Modify Booking API
const modifyBooking = async (req, res) => {
  try {
    const { email, checkInDate, checkOutDate } = req.body;

    const booking = bookings.find(b => b.email === email);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    booking.checkInDate = checkInDate;
    booking.checkOutDate = checkOutDate;

    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error modifying booking', error });
  }
};

module.exports = { bookRoom, viewBooking, viewGuests, cancelBooking, modifyBooking };
