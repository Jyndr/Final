const express = require('express');
const router = express.Router();

// Basic route for testing
router.get('/test', (req, res) => {
    res.json({ message: 'Safety map service is working' });
});

module.exports = router; 