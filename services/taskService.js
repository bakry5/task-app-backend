const ApiError = require('../utils/apiError');
const Task = require('../models/taskModel');

exports.getTasks = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  if (req.query.keyword) {
    filter.title = { $regex: req.query.keyword, $options: 'i' };
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const totalResults = await Task.countDocuments(filter);
  const tasks = await Task.find(filter).sort('-createdAt').skip(skip).limit(limit);

  res.status(200).json({
    results: tasks.length,
    page,
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
    data: tasks,
  });
};

exports.getTask = async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return next(new ApiError(`No task found for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: task });
};

exports.createTask = async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    user: req.user._id,
  });

  res.status(201).json({ data: task });
};

exports.updateTask = async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
    },
    { new: true, runValidators: true }
  );

  if (!task) {
    return next(new ApiError(`No task found for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: task });
};

exports.deleteTask = async (req, res, next) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return next(new ApiError(`No task found for this id ${req.params.id}`, 404));
  }

  res.status(204).send();
};
