const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like your HTML) from the 'public' folder
// Load environment variables (like DATABASE_URL) from a .env file
require('dotenv').config(); 

const express = require('express');
const { Pool } = require('pg'); // Import the pg (PostgreSQL) tool


const PORT = process.env.PORT || 3000;

// --- Database Connection ---
// The 'pg' library automatically looks for the DATABASE_URL
// environment variable. On Render, this is set by the Environment Group.
// For local testing, we'll set it in a .env file (see next step).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If deploying to Render, you NEED this SSL configuration
  ssl: {
    rejectUnauthorized: false
  }
});

// --- Middleware ---
// Allows our server to understand JSON data from the frontend
app.use(express.json());
// Serves the public/index.html file
app.use(express.static('public'));

// --- API Endpoints (Full CRUD) ---

// 1. CREATE (C)
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const newExpense = await pool.query(
      'INSERT INTO expenses (description, amount) VALUES ($1, $2) RETURNING *',
      [description, amount]
    );

    res.status(201).json(newExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. READ (R)
app.get('/api/expenses', async (req, res) => {
  try {
    const allExpenses = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    res.json(allExpenses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. UPDATE (U)
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get ID from the URL (e.g., /api/expenses/1)
    const { description, amount } = req.body;

    const updatedExpense = await pool.query(
      'UPDATE expenses SET description = $1, amount = $2 WHERE id = $3 RETURNING *',
      [description, amount, id]
    );

    if (updatedExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(updatedExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. DELETE (D)
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteOp = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
// We only export the app for testing
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
