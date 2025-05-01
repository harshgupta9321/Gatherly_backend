import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import venueRoutes from './routes/venueRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import ticketBookingRoutes from './routes/ticketBookingRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import recommendationRoutes from './routes/recommendationRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import eventCategoryRoutes from './routes/eventCategoryRoutes.js';
import eventTagRoutes from './routes/eventTagRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import interactionRoutes from './routes/interactionRoutes.js';
import eventViewRoutes from './routes/eventViewRoutes.js'
import aiRoutes from "./routes/aiRoutes.js"

// dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();


// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true               
  }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser()); 


//api route
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ticket-booking', ticketBookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/categories', eventCategoryRoutes);
app.use('/api/tags', eventTagRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/event-views', eventViewRoutes);
app.use('/api/ai', aiRoutes);

app.use(express.json());





app.get('/', (req, res) => {
    res.send('API is running...');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
