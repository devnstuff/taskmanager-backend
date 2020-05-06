const express = require('express');
const router = express.Router();
const auth = require('../config/middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');

// @route GET api/v1/profile/projects
// @desc get all projects
// Private

router.get('/', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    res.status(200).json({ success: true, data: profile.projects })

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
})

router.put('/', auth, async (req, res, next) => {
  const { name, color, status, archived } = req.body;

  const newProject = {
    name,
    color,
    status,
    archived
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.projects.unshift(newProject);

    await profile.save();

    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
});

// @route GET api/v1/profile/projects/:id
// @desc get a project by id
// Private

router.get('/:project_id', auth, async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    let project = profile.projects.find(i => i.id === req.params.project_id);

    console.log(project)

    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({
      error: `${err.message}`
    });
  }
});

// @route DELETE api/v1/profile/projects/:id
// @desc Archive a project
// Private

router.put('/:project_id', auth, async (req, res, next) => {
  const { archived } = req.body

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    let project = profile.projects.find(i => i.id === req.params.project_id);

    project.archived = archived;

    await profile.save();

    res.status(200).json({ success: true, data: project })

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
})

// @route DELETE api/v1/profile/projects/:id
// @desc delete a project
// Private

router.delete('/:project_id', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.projects
      .map(i => i.id)
      .indexOf(req.params.project_id);

    profile.projects.splice(removeIndex, 1);

    await profile.save();

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
});


// @route GET api/v1/profile/tasks
// @desc get all tasks
// Private


router.get('/:project_id/tasks', auth, async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    let project = await profile.projects.find(i => i.id === req.params.project_id);

    res.status(200).json({ success: true, data: project.tasks })

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
})

// @route PUT api/v1/profile/tasks
// @desc add a task
// Private

router.post('/:project_id/task', auth, async (req, res) => {
  const { project_id, project_name, project_color, body, due, priority, priority_color, isActive } = req.body;

  const newTask = {
    project_id,
    project_name,
    project_color,
    body,
    due,
    priority,
    priority_color,
    isActive
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    let project = profile.projects.find(i => i.id === req.params.project_id);

    project.tasks.unshift(newTask);

    await profile.save();

    res.status(200).json({ success: true, data: newTask });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
});

// @route GET api/v1/profile/tasks
// @desc delete a tasks
// Private

router.put('/:project_id/tasks/:task_id', auth, async (req, res, next) => {
  const { isActive } = req.body

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    let project = profile.projects.find(i => i.id === req.params.project_id);

    let task = project.tasks.find(a => a.id === req.params.task_id);

    task.isActive = isActive;

    await profile.save();

    res.status(200).json({ success: true, data: task })

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
})

// @route POST api/v1/profile/comment
// @desc add a comment
// Private

router.post('/:project_id/comment', auth, async (req, res, next) => {
  const { body } = req.body;

  newComment = {
    body
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    let project = profile.projects.find(i => i.id === req.params.project_id);

    project.comments.unshift(newComment);

    await profile.save();

    res.status(200).json({ success: true, data: newComment });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
});

// @route GET api/v1/profile/comments
// @desc get all comments
// Private

router.get('/:project_id/comments', auth, async (req, res, next) => {

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    let project = await profile.projects.find(i => i.id === req.params.project_id);

    res.status(200).json({ success: true, data: project.comments })

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
})

// @route DELETE api/v1/profile
// @desc delete a comment 
// Private

router.delete('/:project_id/comments/:comment_id', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    let project = profile.projects.find(i => i.id === req.params.project_id);

    const removeIndex = project.comments
      .map(i => i._id)
      .indexOf(req.params.comment_id);

    project.comments.splice(removeIndex, 1);

    await profile.save();

    res.status(200).json({ success: true, data: project })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Internal sertver error: ${error.message}`
    });
  }
})

module.exports = router;
