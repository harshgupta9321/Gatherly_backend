import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Image, ListGroup } from 'react-bootstrap';

const venueData = {
  1: { name: "Grand Palace", location: "Delhi", price: "₹50,000", images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"], description: "A beautiful venue for weddings and events." },
  2: { name: "Royal Banquet", location: "Mumbai", price: "₹75,000", images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"], description: "A luxurious banquet hall in Mumbai." },
  3: { name: "Luxury Hall", location: "Bangalore", price: "₹90,000", images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"], description: "Premium event space in Bangalore." }
};

const VenueDetails = () => {
  const { id } = useParams();
  const venue = venueData[id];

  if (!venue) return <h2 className="text-center mt-5">Venue Not Found</h2>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Image src={venue.images[0]} fluid className="rounded mb-3" />
          <Image src={venue.images[1]} fluid className="rounded" />
        </Col>
        <Col md={6}>
          <h2>{venue.name}</h2>
          <p><strong>Location:</strong> {venue.location}</p>
          <h4 className="text-success">{venue.price}</h4>
          <p>{venue.description}</p>
          <ListGroup className="mb-3">
            <ListGroup.Item>✅ Spacious Hall</ListGroup.Item>
            <ListGroup.Item>✅ Catering Available</ListGroup.Item>
            <ListGroup.Item>✅ Parking Space</ListGroup.Item>
          </ListGroup>
          <Button variant="primary" size="lg">Book Now</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VenueDetails;
