const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'biolearn_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, level = 'UG' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    
    const user = await User.create({ name, email, password, level });
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'Registration successful! Welcome to BioLearn AI.',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    await user.update({ lastLogin: new Date() });
    const token = generateToken(user);
    
    res.json({
      message: 'Login successful!',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, level, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (level) updates.level = level;
    if (avatar) updates.avatar = avatar;
    
    await req.user.update(updates);
    const updatedUser = await User.findByPk(req.user.id);
    
    res.json({ message: 'Profile updated successfully.', user: updatedUser.toJSON() });
  } catch (error) {
    next(error);
  }
};