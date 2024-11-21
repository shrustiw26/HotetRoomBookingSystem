const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Book an appointment
router.post('/book', async (req, res) => {
  const { firstName, lastName, email, timeSlot, doctorName } = req.body;
  const db = getDB();

  try {
    // Check if time slot is already booked
    const existingAppointment = await db.collection('appointments').findOne({ doctorName, timeSlot });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked.' });
    }

    // Save appointment
    const newAppointment = { firstName, lastName, email, timeSlot, doctorName };
    await db.collection('appointments').insertOne(newAppointment);
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// View appointment details by email
router.get('/view', async (req, res) => {
  const { email } = req.body;
  const db = getDB();

  try {
    const appointment = await db.collection('appointments').findOne({ email });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// View all appointments for a doctor
router.get('/doctor', async (req, res) => {
  const { name } = req.body;
  const db = getDB();

  try {
    const appointments = await db.collection('appointments').find({ doctorName: name }).toArray();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel an appointment
router.delete('/cancel', async (req, res) => {
  const { email, timeSlot } = req.body;
  const db = getDB();

  try {
    const result = await db.collection('appointments').deleteOne({ email, timeSlot });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Modify an appointment
router.put('/modify', async (req, res) => {
  const { email, originalTimeSlot, newTimeSlot } = req.body;
  const db = getDB();

  try {
    // Check if new time slot is available
    const slotConflict = await db.collection('appointments').findOne({ timeSlot: newTimeSlot });
    if (slotConflict) {
      return res.status(400).json({ message: 'New time slot is already booked.' });
    }

    // Update appointment
    const updatedAppointment = await db.collection('appointments').findOneAndUpdate(
      { email, timeSlot: originalTimeSlot },
      { $set: { timeSlot: newTimeSlot } },
      { returnDocument: 'after' }
    );

    if (!updatedAppointment.value) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment.value });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
