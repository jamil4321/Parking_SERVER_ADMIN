require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
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
const feedback = require("./routes/feedback.js");

app.use("/api", authRoutes);
app.use("/api", laneAndParkingRoutes);
app.use("/api", feedback);

io.on("connection", (socket) => {
  console.log("User Connestec", socket.id);
});

server.listen(port, () => {
  console.log("Server is Running on port :", port);
});
