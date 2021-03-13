const express = require("express");
const router = express.Router();
const { authFunc } = require("../Middleware/auth");
const {
  getFeedBack,
  getFeedBackByUser,
  getReplyFeedBack,
  newFeedback,
  replyFeedBack,
} = require("../controllers/feedback");
router.post("/newfeedback", authFunc, newFeedback);
router.post("/getfeedback", authFunc, getFeedBack);
router.post("/getfeedbackbyuser", authFunc, getFeedBackByUser);
router.post("/getreplyfeedback", authFunc, getReplyFeedBack);
router.post("/replyfeedback", authFunc, replyFeedBack);
module.exports = router;
