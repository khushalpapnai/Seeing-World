const { validationResult } = require("express-validator");
const Httperror = require("../models/http-error");
const UUID = require("uuid/v4.js");
const getcoordsforaddress = require("../routes/utils/location");
const Place = require("../models/place");
const User = require("../models/user.js");
const mongoose = require("mongoose");

const getbyplaceid = async (req, res, next) => {
  const placId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placId);

    if (!place) {
      return next(new Httperror("This place not found!!", 404));
    }

    return res.json({ place: place.toObject({ getters: true }) });
  } catch (err) {
    return next(
      new Httperror("This place could not be found with the given ID", 500)
    );
  }
};

const getbyuserid = async (req, res, next) => {
  const userId = req.params.uid;
  let userplaces;
  try {
    userplaces = await User.findById(userId).populate("place");
  } catch (err) {
    const error = new Httperror(
      "thhis place not be found in given user id",
      500
    );
    return next(error);
  }
  if (!userplaces || userplaces.place.length === 0) {
    const error = new Httperror("this user not found!!", 404);
    return next(error);
  }
  res.json({
    userplaces: userplaces.place.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};
const creatplace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Httperror("invalid inputs passed,please check your data", 422)
    );
  }
  const { title, description, address, creator } = req.body;
  let cordinate;
  try {
    cordinate = await getcoordsforaddress(address);
  } catch (error) {
    return next(error);
  }
  const createdplace = new Place({
    title,
    description,
    address,
    location: cordinate,
    image:
      "https://tse1.mm.bing.net/th/id/OIP.iKB7lVjB_QisYVooMdCo1QHaJ4?rs=1&pid=ImgDetMain",

    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new Httperror("faild to found user", 500);
    return next(error);
  }

  if (!user) {
    const error = new Httperror("no such user found", 500);
    return next(error);
  }
  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdplace.save({ session: sess });
    user.place.push(createdplace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch {
    const error = new Httperror("faild to create place ,try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdplace });
};

const updateplace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new Httperror("Please enter valid data.", 422));
  }

  const { title, description } = req.body;

  const placeId = req.params.pid;


  let place; // Declare variable before usage
  try {
    place = await Place.findById(placeId);
    if (!place) {
      return next(new Httperror("Couldn't find place! Try again.", 404));
    }
   
  } catch (err) {
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return new Httperror("Failed to update place.", 500);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deleteplace = async (req, res, next) => {
  const placeId = req.params.pid;
  let places;

  try {
    places = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new Httperror("Fetching place failed, please try again later.", 500)
    );
  }

  if (!places) {
    return next(new Httperror("Couldn't find place! Try again.", 404));
  }
  console.log(places);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await places.deleteOne({ session: sess }); // Properly delete place

    places.creator.place.pull(places._id); // Correctly remove reference

    await places.creator.save({ session: sess }); // Save changes to creator

    await sess.commitTransaction();
  } catch (err) {
    return next(new Httperror("Failed to delete place.", 500));
  }

  res.status(200).json({ message: "Place deleted successfully." });
};

exports.getbyplaceid = getbyplaceid;
exports.getbyuserid = getbyuserid;
exports.creatplace = creatplace;
exports.updateplace = updateplace;
exports.deleteplace = deleteplace;
