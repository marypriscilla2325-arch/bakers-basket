const express = require('express');
const { query } = require('../database');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const products = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search products
router.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = `%${req.params.keyword}%`;
    const products = await query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
      [keyword, keyword]
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await query(
      'SELECT * FROM products WHERE category = ?',
      [req.params.category]
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
