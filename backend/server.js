require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');
const folderRoutes = require('./routes/folders');
const submissionRoutes = require('./routes/submissions');
require('./models/Response');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://frolicking-klepon-53ebb7.netlify.app', // Vite's default port
  credentials: true
}));
app.use(express.json());

// Simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to Form Builder Backend'); // Response message
});


// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/submissions', submissionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 