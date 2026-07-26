const { body, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3 })
    .withMessage('Too short task title'),

  body('description').optional().isString().withMessage('Description must be a string'),

  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be one of: To Do, In Progress, Done'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),

  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),

  validatorMiddleware,
];

exports.getTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id format'),
  validatorMiddleware,
];

exports.updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id format'),

  body('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short task title'),

  body('description').optional().isString().withMessage('Description must be a string'),

  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be one of: To Do, In Progress, Done'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),

  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),

  validatorMiddleware,
];

exports.deleteTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id format'),
  validatorMiddleware,
];
