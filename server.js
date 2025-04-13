import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import venueRoutes from './routes/venueRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import ticketBookingRoutes from './models/TicketBooking.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser()); 


//api route
app.use('/api/auth', authRoutes);
app.use('/api', venueRoutes);
app.use('/api', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ticket-bookings', ticketBookingRoutes);



app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
