const express = require('express');
const jwt = require('jsonwebtoken');
const { query, run } = require('../database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await query('SELECT COUNT(*) as count FROM users');
    const totalProducts = await query('SELECT COUNT(*) as count FROM products');
    const totalOrders = await query('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await query('SELECT SUM(total_price) as revenue FROM orders');

    res.json({
      totalUsers: totalUsers[0].count,
      totalProducts: totalProducts[0].count,
      totalOrders: totalOrders[0].count,
      totalRevenue: totalRevenue[0].revenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product
router.post('/products/add', verifyAdmin, async (req, res) => {
  try {
    const { name, description, category, price, image, stock } = req.body;
    const result = await run(
      'INSERT INTO products (name, description, category, price, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, category, price, image, stock]
    );
    res.json({ message: 'Product added', id: result.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, category, price, image, stock } = req.body;
    await run(
      'UPDATE products SET name = ?, description = ?, category = ?, price = ?, image = ?, stock = ? WHERE id = ?',
      [name, description, category, price, image, stock, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
