const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS to allow credentials and specific origin
const corsOptions = {
  origin: 'http://localhost:3000',  // React app origin
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Use user routes
app.use('/api/user', require('./routes/user'));

// Use admin routes
app.use('/api/admin', require('./routes/admin')); // Mount admin routes here

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
