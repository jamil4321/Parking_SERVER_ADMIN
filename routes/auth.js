const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  activateAccount,
  adminsignin,
  adminsignup,
} = require("../controllers/auth");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/email-activate", activateAccount);
router.post("/adminsignin", adminsignin);
router.post("/adminsignup", adminsignup);

module.exports = router;
