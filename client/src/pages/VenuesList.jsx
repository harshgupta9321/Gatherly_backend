import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const venues = [
  { id: 1, name: "Grand Palace", location: "Delhi", price: "₹50,000", image: "https://via.placeholder.com/300" },
  { id: 2, name: "Royal Banquet", location: "Mumbai", price: "₹75,000", image: "https://via.placeholder.com/300" },
  { id: 3, name: "Luxury Hall", location: "Bangalore", price: "₹90,000", image: "https://via.placeholder.com/300" }
];

const VenuesList = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <h2 className="text-center">Explore Venues</h2>

      {/* Filters */}
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Control type="text" placeholder="Search venue..." />
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>All Locations</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>Sort by Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="primary">Apply</Button>
          </Col>
        </Row>
      </Form>

      {/* Venue Cards */}
      <Row>
        {venues.map((venue) => (
          <Col md={4} key={venue.id}>
            <Card className="mb-3">
              <Card.Img variant="top" src={venue.image} />
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>{venue.location} - {venue.price}</Card.Text>
                <Button variant="success" onClick={() => navigate(`/venue/${venue.id}`)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VenuesList;
