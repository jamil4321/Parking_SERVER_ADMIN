const express = require("express");
const router = express.Router();
const { authFunc } = require("../Middleware/auth");

const { newMsg, getMsg, getUsers } = require("../controllers/Chat");
router.post("/newMsg", authFunc, newMsg);
router.post("/getMsg/:id", authFunc, getMsg);
router.post("/allusers", authFunc, getUsers);

module.exports = router;
