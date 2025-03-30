const express = require('express');
const router = express.Router();

// Basic route for testing
router.get('/test', (req, res) => {
    res.json({ message: 'Auth service is working' });
});

module.exports = router; 