import { useState } from "react";
import { Table, Button } from "react-bootstrap";

const BookingList = () => {
  const [bookings, setBookings] = useState([
    { id: 1, venue: "Grand Palace", date: "2025-04-10" },
    { id: 2, venue: "Royal Banquet", date: "2025-04-15" }
  ]);

  const handleCancel = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Venue</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td>{booking.venue}</td>
            <td>{booking.date}</td>
            <td>
              <Button variant="danger" onClick={() => handleCancel(booking.id)}>Cancel</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BookingList;
