import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/venues'); // Redirect to venues page after search
  };

  return (
    <Container className="text-center mt-5">
      {/* Hero Section */}
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4 fw-bold">Find Your Perfect Event Venue</h1>
          <p className="lead">Discover and book the best venues for weddings, birthdays, and corporate events.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/venues')}>Explore Venues</Button>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mt-4 justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Group>
              <Form.Control type="text" placeholder="Search for venues, locations..." />
            </Form.Group>
            <Button type="submit" variant="success" className="mt-2">Search</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
