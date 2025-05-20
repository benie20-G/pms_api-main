const express = require('express');
const cors = require('cors');
const setupSwagger = require('./swagger/setup');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/parking-requests', require('./routes/parkingRequest.route'));

// Setup Swagger
setupSwagger(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 