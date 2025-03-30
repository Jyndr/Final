const express = require('express');
const router = express.Router();

// Basic route for testing
router.get('/test', (req, res) => {
    res.json({ message: 'Emergency transport service is working' });
});

// Get all transports
router.get('/', (req, res) => {
    res.json({ message: 'Get all transports endpoint' });
});

// Get nearest transports
router.get('/nearest', (req, res) => {
    res.json({ message: 'Get nearest transports endpoint' });
});

// Add new transport
router.post('/', (req, res) => {
    res.json({ message: 'Add new transport endpoint' });
});

// Update transport status
router.put('/:id', (req, res) => {
    res.json({ message: 'Update transport status endpoint' });
});

// Delete transport
router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete transport endpoint' });
});

module.exports = router; 