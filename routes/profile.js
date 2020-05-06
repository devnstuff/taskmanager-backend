const express = require('express');
const router = express.Router();
const auth = require('../config/middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');

// @route GET api/v1/profile/current
// @desc get profile
// Private

router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res.status(400).json({ success: false, msg: 'Invalid request' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
});

// @route POST api/v1/profile
// @desc create a profile
// Private

router.post('/', auth, async (req, res, next) => {
  const { avatar } = req.body;

  const profileFields = {};

  profileFields.user = req.user.id;

  if (avatar) profileFields.avatar = avatar;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      res.status(201).json({ success: true, data: profile });
    }

    // create
    profile = new Profile(profileFields);

    await profile.save();

    return res.status(201).json({ success: true, data: profile });
  } catch (error) { }
});

// @route PUT api/v1/profile/projects
// @desc add projects
// Private


router.delete('/', auth, async (req, res, next) => {
  await Profile.findOneAndRemove({ user: req.user.id });

  await User.findByIdAndRemove({ _id: req.user.id });

  return res.status(200).json({ success: true, msg: 'User deleted' });
});

module.exports = router;
