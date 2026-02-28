const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expenses');
const savingsRoutes = require('./routes/savings');
const passwordRecoveryRoutes = require('./routes/passwordRecovery');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'http://10.235.8.100:5173'  //  for phone access
  ],
  credentials: true,
}));

// Parse JSON BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use('/api/auth', authRoutes);
app.use('/api/auth/recovery', passwordRecoveryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/savings', savingsRoutes);

// ----------------------
// HEALTHCHECK
// ----------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'UniTracker API is running', environment: NODE_ENV });
});

// ----------------------
// STATIC FRONTEND
// ----------------------
if (NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ----------------------
// ERROR HANDLER
// ----------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});
app.listen(PORT, '0.0.0.0', () => {  // Already there, good!
    console.log(`Server running on http://10.235.8.100:${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
});
// ----------------------
// GRACEFUL SHUTDOWN
// ----------------------
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = app;
