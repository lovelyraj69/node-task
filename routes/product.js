const express = require('express');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Admin creates product
router.post('/', auth(['admin']), upload.single('image'), async (req, res) => {
  const { name, price, count } = req.body;
  const image = req.file.path;
  
  const product = new Product({ name, price, count, image });
  await product.save();

  res.send('Product created successfully');
});

// Admin updates product
router.put('/:id', auth(['admin']), async (req, res) => {
  const { name, price, count } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { name, price, count }, { new: true });
  
  if (!product) return res.status(404).send('Product not found');
  
  res.send('Product updated successfully');
});

// Admin deletes product
router.delete('/:id', auth(['admin']), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) return res.status(404).send('Product not found');
  
  res.send('Product deleted');
});

// Customer view product list
router.get('/', auth(['customer', 'admin']), async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
