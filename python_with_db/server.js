const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3001;

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route and dashboard route
app.get(['/', '/dashboard'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// API Routes
app.get('/api/news', async (req, res) => {
    try {
        const db = client.db('disaster_news');
        const collection = db.collection('newsarticles');
        const news = await collection.find({}).toArray();
        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Twitter news endpoint
app.get('/api/news/twitter', async (req, res) => {
    try {
        const db = client.db('disaster_news');
        const collection = db.collection('newsarticles');
        const news = await collection.find({ source: "Twitter" }).toArray();
        res.json(news);
    } catch (error) {
        console.error('Error fetching Twitter news:', error);
        res.status(500).json({ error: 'Failed to fetch Twitter news' });
    }
});

// Start server with port conflict handling
async function startServer() {
    try {
        await connectToMongoDB();
        
        // Try to start the server
        const server = app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Please try these solutions:`);
                console.error('1. Kill the process using this port:');
                console.error('   - On Mac/Linux: lsof -i :3001');
                console.error('   - On Windows: netstat -ano | findstr :3001');
                console.error('2. Or use a different port by changing the port variable');
                process.exit(1);
            } else {
                console.error('Server error:', error);
            }
        });

        // Handle process termination
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                client.close();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 