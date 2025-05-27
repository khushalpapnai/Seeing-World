const { validationResult } = require("express-validator");
const Httperror = require("../models/http-error");
const UUID = require("uuid/v4.js");
const User = require("../models/user");

const getusers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //"email,name" also can be use
  } catch (err) {
    const error = new Httperror("can't fetch user please try again", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
const singup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(new Httperror("invalid input please check your data", 422));
  }
  const { name, email, password } = req.body;

  let existing;
  try {
    existing = await User.findOne({ email: email });
    if (existing) {
      const error = new Httperror("user already exist!! use login ", 422);
      return next(error);
    }
  } catch (err) {
    const error = new Httperror("singup faild !! please try again", 500);
    return next(error);
  }
  if (existing) {
    const error = new Httperror(
      "user exists already,please longin instead.",
      422
    );
    return next(error);
  }
  const createduser = new User({
    name,
    image:
      "https://tse1.mm.bing.net/th/id/OIP.iKB7lVjB_QisYVooMdCo1QHaJ4?rs=1&pid=ImgDetMain",

    email,
    password,
    place: [],
  });
  try {
    await createduser.save();
  } catch (err) {
    const error = new Httperror("faild to singup!!, try again", 500);
    return next(error);
  }
  res.status(201).json({ users: createduser.toObject({ getters: true }) });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existing;
  try {
    existing = await User.findOne({ email: email });
  } catch (err) {
    const error = new Httperror("login faild !! please try again", 500);
    return next(error);
  }

  if (!existing || existing.password !== password) {
    const error = new Httperror("incorect email and password", 401);
    return next(error);
  }
  res.json({
    massage: "logged in",
    users: existing.toObject({ getters: true }),
  });
};

exports.getusers = getusers;
exports.singup = singup;
exports.login = login;
