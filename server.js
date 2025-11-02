const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like your HTML) from the 'public' folder
app.use(express.static('public'));

// API Endpoint: Provides expense data
app.get('/api/expenses', (req, res) => {
  const expenses = [
    { id: 1, description: 'Coffee', amount: 3 },
    { id: 2, description: 'Lunch', amount: 10 },
    { id: 3, description: 'Bus Fare', amount: 2 }
  ];
  res.json(expenses);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing
module.exports = server;
