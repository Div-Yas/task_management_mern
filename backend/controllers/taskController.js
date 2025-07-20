const { validationResult } = require('express-validator');
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, data: null, message: errors.array()[0].msg });
  }
  try {
    const { taskName, description, dueDate } = req.body;
    const task = new Task({
      user: req.user.id,
      taskName,
      description,
      dueDate,
    });
    await task.save();
    res.status(201).json({ status: true, data: task, message: 'Task created successfully' });
  } catch (err) {
    res.status(500).json({ status: false, data: null, message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      Task.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments({ user: req.user.id })
    ]);
    res.json({
      status: true,
      data: tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: tasks.length ? 'Tasks fetched successfully' : 'No tasks found'
    });
  } catch (err) {
    res.status(500).json({ status: false, data: null, message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, data: null, message: errors.array()[0].msg });
  }
  try {
    const { taskName, description, dueDate } = req.body;
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ status: false, data: null, message: 'Task not found' });
    }
    task.taskName = taskName;
    task.description = description;
    task.dueDate = dueDate;
    await task.save();
    res.json({ status: true, data: task, message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ status: false, data: null, message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ status: false, data: null, message: 'Task not found' });
    }
    res.json({ status: true, data: null, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, data: null, message: 'Server error' });
  }
}; 