import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VenuesList from './pages/VenuesList';
import VenueDetails from './pages/VenueDetails';
import Booking from './pages/Booking';
import Navbar from './components/Navbar';

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/venues" element={<VenuesList />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
