const express = require('express');
const Order = require('../models/order');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const router = express.Router();

// Customer places order (Add to Cart)
router.post('/', auth(['customer']), async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.count < quantity) return res.status(400).send('Product not available in requested quantity');

  const order = new Order({
    customer: req.user._id,
    product: productId,
    quantity
  });

  product.count -= quantity; // Decrease product count
  await product.save();
  await order.save();

  res.send('Order placed successfully');
});

// View orders (Admin & Customers)
router.get('/', auth(['customer', 'admin']), async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).populate('product');
  res.json(orders);
});

module.exports = router;
