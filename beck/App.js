const express = require("express");
const App = express();
const place_server = require("./routes/place_server");
const user_server = require("./routes/user_server");
const bodyparser = require("body-parser");
const Httperror = require("./models/http-error");
const mongoose = require("mongoose");

App.use(bodyparser.json());
const cors = require("cors");
App.options("*", cors());

App.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

App.use("/api/places", place_server);
App.use("/api/user", user_server);
App.use((req, res, next) => {
  const error = new Httperror("this place couldnot be found", 404);
  throw error;
});
App.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "no respose from server" });
});

{
  mongoose
    .connect(
      "mongodb+srv://howoneknows:LQz5H4tJeYdvkvfD@cluster0.rhqikqb.mongodb.net/Mern?retryWrites=true&w=majority&tls=true"
    )
    .then(() => {
      App.listen(5000);
      console.log("connected to beckend");
    })
    .catch((err) => {
      console.log("faild to connect", err);
    });
}
