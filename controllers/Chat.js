const User = require("../models/user");
const Chat = require("../models/Chat");

exports.newMsg = async (req, res) => {
  const { email } = req.user;
  const { ChatId, msg } = req.body;
  const createdAt = new Date();
  let newMsg = new Chat({
    email,
    ChatId,
    msg,
  });
  newMsg.save();
  console.log("msg", newMsg);
  newMsg._doc = {
    ...newMsg._doc,
    createdAt,
  };
  res.json({ newMsg });
};
exports.getMsg = async (req, res) => {
  console.log(req.params.id);
  const MSG = await Chat.find({ ChatId: req.params.id });
  console.log(MSG);
  res.json({ MSG });
};
exports.getUsers = async (req, res) => {
  const user = await User.find({});
  console.log(user);
  res.json({ user });
};
