const express = require("express");
const user_controler = require("../controller/user_ontroller");
const { check } = require("express-validator");
const router = express.Router();

router.get("/", user_controler.getusers);
router.post(
  "/singup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  user_controler.singup
);
router.post(
  "/login",
  check(" email").isEmail().not().isEmpty(),
  check("password").isLength({ min: 8 }).notEmpty(),
  user_controler.login
);

module.exports = router;
