const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const { connectDB, getSafetyInfo } = require('./services/safetyService');

// Import routes from services
const newsRoutes = require('./services/news-service/routes/newsRoutes');
const authRoutes = require('./services/auth-service/routes/authRoutes');
const disasterAlertRoutes = require('./services/disaster-alerts/routes/alertRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Serve static files
app.use(express.static('public'));

// MongoDB Connection Options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

// Connect to MongoDB with retry logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        setTimeout(connectDB, 5000);
    }
};

// Initial connection
connectDB();

// API Routes
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alerts', disasterAlertRoutes);

// API Endpoints
app.post('/api/safety/info', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const safetyInfo = await getSafetyInfo(query);
        
        if (!safetyInfo) {
            return res.status(404).json({ message: 'No safety information found for this query' });
        }

        res.json(safetyInfo);
    } catch (error) {
        console.error('Error in safety info endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        services: {
            news: 'up',
            auth: 'up',
            alerts: 'up'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Start server
mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Main server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log('Available endpoints:');
        console.log('- /api/news');
        console.log('- /api/auth');
        console.log('- /api/alerts');
        console.log('- /health');
    });
}); 