require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const pathComp = require("express-static");
const path = require("path");
require("./db/connectDB");
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
const server = http.Server(app);
const io = socket(server, {
  cors: {
    method: ["GET", "POST"],
  },
});

const authRoutes = require("./routes/auth.js");
const laneAndParkingRoutes = require("./routes/laneAndParking.js");
const Chat = require("./routes/Chat.js");

app.use("/api", authRoutes);
app.use("/api", laneAndParkingRoutes);
app.use("/api", Chat);

const root = require("path").join(__dirname, "client", "build");
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});
io.on("connection", (socket) => {
  console.log("User Connestec", socket.id);
  socket.on("newlane", (data) => {
    console.log("hi! From server");
    io.emit("UpdateLane", data);
  });
  socket.on("delete lane", (data) => {
    console.log("hi! From server");
    io.emit("UpdateLane", data);
  });
  socket.on("parking Booked", (data) => {
    console.log("Booked");
    io.emit("parking Update", data);
  });
  socket.on("msg send", (data) => {
    console.log(data);
    io.emit("msg receive", data);
  });
  socket.on("Cancel Booking", () => {
    io.emit("Canceled");
  });
});

server.listen(port, () => {
  console.log("Server is Running on port :", port);
});
