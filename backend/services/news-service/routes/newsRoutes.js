const express = require('express');
const router = express.Router();

// Basic route for testing
router.get('/test', (req, res) => {
    res.json({ message: 'News service is working' });
});

// Get all news
router.get('/', (req, res) => {
    res.json({ message: 'Get all news endpoint' });
});

// Get news by location
router.get('/location', (req, res) => {
    res.json({ message: 'Get news by location endpoint' });
});

// Get news by category
router.get('/category/:category', (req, res) => {
    res.json({ message: 'Get news by category endpoint' });
});

module.exports = router; 