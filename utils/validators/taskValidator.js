const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createTaskValidator = [
  check('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3 })
    .withMessage('Too short task title'),

  check('description').optional().isString().withMessage('Description must be a string'),

  check('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be one of: To Do, In Progress, Done'),

  check('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),

  check('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),

  validatorMiddleware,
];

exports.getTaskValidator = [
  check('id').isMongoId().withMessage('Invalid task id format'),
  validatorMiddleware,
];

exports.updateTaskValidator = [
  check('id').isMongoId().withMessage('Invalid task id format'),

  check('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short task title'),

  check('description').optional().isString().withMessage('Description must be a string'),

  check('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be one of: To Do, In Progress, Done'),

  check('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),

  check('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),

  validatorMiddleware,
];

exports.deleteTaskValidator = [
  check('id').isMongoId().withMessage('Invalid task id format'),
  validatorMiddleware,
];
