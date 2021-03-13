const express = require("express");
const router = express.Router();
const { authFunc } = require("../Middleware/auth");

const {
  addLane,
  getLane,
  removeLane,
  getParkingSpace,
  bookedParking,
  cencelParking,
  getAllBookings,
  getBookingsForUsers,
} = require("../controllers/laneAndParking");
router.post("/addLane", authFunc, addLane);
router.post("/getLane", authFunc, getLane);
router.post("/removeLane", authFunc, removeLane);
router.post("/getParking", authFunc, getParkingSpace);
router.post("/bookedParking", authFunc, bookedParking);
router.post("/cencelBooking", authFunc, cencelParking);
router.post("/allBookings", authFunc, getAllBookings);
router.post("/allBookingByUser", authFunc, getBookingsForUsers);
module.exports = router;
