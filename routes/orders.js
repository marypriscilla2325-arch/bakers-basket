const express = require('express');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_123');
const { query, run } = require('../database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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

// Get user orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order with payment
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { stripeToken, amount } = req.body;
    
    // Create Stripe charge
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: stripeToken,
      description: 'Bakers Basket Order'
    });

    // Get cart items
    const cartItems = await query('SELECT * FROM cart_items WHERE user_id = ?', [req.user.id]);
    
    // Create order
    const result = await run(
      'INSERT INTO orders (user_id, total_price, payment_id, status) VALUES (?, ?, ?, ?)',
      [req.user.id, amount, charge.id, 'completed']
    );
    
    // Add order items
    for (let item of cartItems) {
      const product = await query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await run(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [result.id, item.product_id, item.quantity, product[0].price]
      );
    }
    
    // Clear cart
    await run('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    
    res.json({ message: 'Order created successfully', orderId: result.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
