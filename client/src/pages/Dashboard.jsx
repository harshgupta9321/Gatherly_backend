import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BookingList from "../components/Dashboard/BookingList";
import ProfileUpdate from "../components/Dashboard/ProfileUpdate";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });

  return (
    <Container className="mt-4">
      <h2>Welcome, {user.name}</h2>
      <Row>
        <Col md={6}>
          <Card className="p-3">
            <h4>Your Bookings</h4>
            <BookingList />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h4>Update Profile</h4>
            <ProfileUpdate user={user} setUser={setUser} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
