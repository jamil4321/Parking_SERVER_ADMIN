const feedback = require("../models/feedback");
const feedbackReply = require("../models/feedbackReply");
const { v4: uuidv4 } = require("uuid");

exports.newFeedback = (req, res) => {
  const { title, msg } = req.body;
  const newFeedBack = new feedback({
    id: uuidv4(),
    user: req.user.email,
    title,
    msg,
  });
  newFeedBack.save();
  console.log(newFeedBack);
  return res.json({ messege: "Done" });
};
exports.getFeedBackByUser = async (req, res) => {
  const feedbacks = await feedback.find({ user: req.user.email });
  return res.json({ feedbacks });
};

exports.getFeedBack = async (req, res) => {
  const feedbacks = await feedback.find();
  return res.json({ feedbacks });
};
exports.replyFeedBack = async (req, res) => {
  const id = uuidv4();
  const { feedbackId, msg } = req.body;
  const newReply = new feedbackReply({
    id,
    feedbackId,
    msg,
    user: req.user.email,
  });
  newReply.save();
  return res.json({ newReply });
};

exports.getReplyFeedBack = async (req, res) => {
  const findReplys = await feedbackReply.find({
    feedbackId: req.body.feedbackId,
  });
  res.json({ findReplys });
};
