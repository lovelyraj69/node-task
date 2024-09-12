const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const userExists = await User.findOne({ username });
  
  if (userExists) return res.status(400).send('User already exists');

  const user = new User({ username, password, role });
  await user.save();

  res.send('User created successfully');
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).send('User not found');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ _id: user._id, role: user.role }, 'secret');
  res.header('Authorization', `Bearer ${token}`).send('Logged in');
});

// Admin can manage users (create, delete)
router.delete('/delete/:id', auth(['admin']), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  await user.remove();
  res.send('User deleted');
});

module.exports = router;
