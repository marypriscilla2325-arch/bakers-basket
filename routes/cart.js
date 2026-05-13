const express = require('express');
const jwt = require('jsonwebtoken');
const { query, run } = require('../database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartItems = await query(
      'SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    
    const existing = await query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    
    if (existing.length > 0) {
      await run(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      await run(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }
    
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/remove/:item_id', verifyToken, async (req, res) => {
  try {
    await run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.item_id, req.user.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quantity
router.put('/update/:item_id', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    await run('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.item_id, req.user.id]);
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
