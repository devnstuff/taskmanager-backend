const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../config/middleware/auth');
const User = require('../models/User');

// @route POST api/v1/auth
// @desc authenticate user and get token
// Public

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid user credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid user credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .json({ success: true, access_token: token, expires_in: 3600 });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal server error: ${error.message}`
    });
  }
});

// @route GET api/v1/auth
// @desc get auth user
// Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal server error: ${error.message}`
    });
  }
});

module.exports = router;
