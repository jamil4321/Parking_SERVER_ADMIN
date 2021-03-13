const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 64,
    },
    laneId: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    lastUser: {
      type: String,
    },
    isBooked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("parking", parkingSchema);
