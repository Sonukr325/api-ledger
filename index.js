require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: 'GET,POST',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api', customerRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
