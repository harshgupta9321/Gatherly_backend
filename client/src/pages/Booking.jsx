import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const venueData = {
  1: { name: "Grand Palace", location: "Delhi", price: "₹50,000" },
  2: { name: "Royal Banquet", location: "Mumbai", price: "₹75,000" },
  3: { name: "Luxury Hall", location: "Bangalore", price: "₹90,000" }
};

const Booking = () => {
  const { id } = useParams();
  const venue = venueData[id];
  const [formData, setFormData] = useState({ name: '', email: '', date: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = () => {
    alert(`Booking Confirmed for ${venue.name} on ${formData.date}`);
  };

  if (!venue) return <h2 className="text-center mt-5">Venue Not Found</h2>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="p-3">
            <h3>Booking Details</h3>
            <p><strong>Venue:</strong> {venue.name}</p>
            <p><strong>Location:</strong> {venue.location}</p>
            <p><strong>Price:</strong> {venue.price}</p>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h3>Enter Your Details</h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" onChange={handleChange} required />
              </Form.Group>
              <Button variant="primary" onClick={handleBooking}>Confirm Booking</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Booking;
