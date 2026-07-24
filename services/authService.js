const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.signup = async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return next(new ApiError('E-mail already in use', 400));
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);
  res.cookie('token', token, cookieOptions);

  delete user._doc.password;
  res.status(201).json({ data: user, token });
};

exports.login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  const token = createToken(user._id);
  res.cookie('token', token, cookieOptions);

  delete user._doc.password;
  res.status(200).json({ data: user, token });
};

exports.logout = async (req, res, next) => {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ status: 'Success' });
};

exports.protect = async (req, res, next) => {
  let token;
 
   if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError('You are not logged in, please login to get access', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError('The user belonging to this token no longer exists', 401));
  }


  req.user = currentUser;
  next();
};
