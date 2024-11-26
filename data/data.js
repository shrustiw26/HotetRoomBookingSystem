// Simulated Rooms Collection
const rooms = [
    { roomNumber: 101, isAvailable: true },
    { roomNumber: 102, isAvailable: true },
    { roomNumber: 103, isAvailable: true },
    { roomNumber: 104, isAvailable: true },
    { roomNumber: 105, isAvailable: true }
];

// Simulated Bookings Collection
const bookings = [
    {
        name: "Anu Doe",
        email: "Anu.doe@example.com",
        contact: "7876667",
        checkInDate: "2024-12-01",
        checkOutDate: "2024-12-05",
        roomNumber: 101
    }
];

module.exports = { rooms, bookings };
