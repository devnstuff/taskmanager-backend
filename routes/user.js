const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route POST api/v1/user
// @desc register a user
// Public

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: 'User already exists'
      });
    }
    user = new User({
      name,
      email,
      password
    });

    // encrypt password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    // save user
    await user.save();
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          access_token: token,
          expires_in: 360000
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: `Internal server error: ${error.message}`
    });
  }
});

module.exports = router;
