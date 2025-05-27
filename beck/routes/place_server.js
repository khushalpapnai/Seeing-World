const express = require("express");
const placeController = require("../controller/place_ontroller");
const { check } = require("express-validator");

const router = express.Router();

router.get("/:pid", placeController.getbyplaceid);
router.get("/user/:uid", placeController.getbyuserid);
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.creatplace
);
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeController.updateplace
);
router.delete("/:pid", placeController.deleteplace);

module.exports = router;
