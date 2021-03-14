const lane = require("../models/lane");
const parking = require("../models/parking");
const booking = require("../models/booking");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");

exports.addLane = (req, res) => {
  const { laneName, parkingArea } = req.body;
  const laneId = uuidv4();
  lane.findOne({ laneName }).exec((err, name) => {
    if (name) {
      return res.status(400).json({ message: "Lane name already exists" });
    }
    let newLane = new lane({
      name: laneName,
      id: laneId,
      totalPakringSpace: parkingArea,
    });
    newLane.save((err, success) => {
      if (err) {
        console.log("Error Saving The Record ", err);
        return res.status(400).json({ error: err });
      }
      console.log(Number(parkingArea));
      for (i = 0; i < Number(parkingArea); i++) {
        let newPArking = new parking({
          id: uuidv4(),
          name: laneName + (i + 1),
          laneId,
          startTime: "",
          endTime: "",
          lastUser: "",
          isBooked: false,
        });
        newPArking.save();
        console.log(i);
      }
      return res.json({ message: "Record Added Successfully", newLane });
    });
  });
};

exports.removeLane = (req, res) => {
  const { laneId } = req.body;
  lane
    .deleteOne({ id: laneId })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
  parking
    .deleteMany({ laneId: laneId })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
  return res.json({ message: "Lane Removed" });
};

exports.getLane = async (req, res) => {
  let data = await lane.find();
  console.log(data);
  res.json({ data });
};
exports.getParkingSpace = async (req, res) => {
  const { laneId } = req.body;
  let data = await parking.find({ laneId });
  console.log(data);
  res.json({ data });
};

exports.bookedParking = async (req, res) => {
  const { id, startTime, endTime } = req.body;
  console.log(req.user.email);
  parking.updateOne(
    { id },
    { startTime, endTime, lastUser: req.user.email, isBooked: true },
    (err, success) => {
      if (err) {
        res.json({ message: "Error in Updating " + err });
      }
    }
  );
  let BookingID = uuidv4();
  let newOrder = new booking({
    id: BookingID,
    parkingId: id,
    email: req.user.email,
    startTime,
    endTime,
    isBooking: true,
  });
  newOrder.save((err, success) => {
    if (err) {
      res.json({ message: "Error in Creteing " + err });
    }
  });
  const msg = {
    to: req.user.email, // Change to your recipient
    from: "jamil.ahmed@wah-brands.com", // Change to your verified sender
    subject: "Booking Is Confirmed",
    text: "and easy to do anywhere, even with Node.js",
    html: `
                    <h2>Your Booking have Been Confirmed</h2>
                    <p>Your Booking ID is ${BookingID} </p>
                `,
  };
  sgMail
    .send(msg)
    .then(() => {
      res.json({
        message: "Your Reservation is confirm Check Your Email",
      });
    })
    .catch((error) => {
      res.json({ message: "Error is Email " + error.message });
    });
};

exports.cencelParking = async (req, res) => {
  const { id } = req.body;
  console.log(req.user.email);
  let data = await booking.findOne({ id });
  booking.updateOne({ id }, { isBooking: false }, (err, success) => {
    if (err) {
      return res.json({ message: "Error in Updating " + err });
    }
  });
  parking.updateOne(
    { id: data.parkingId },
    { isBooked: false },
    (err, success) => {
      if (err) {
        return res.json({ message: "Error in Updating " + err });
      }
    }
  );
  const msg = {
    to: data.email, // Change to your recipient
    from: "jamil.ahmed@wah-brands.com", // Change to your verified sender
    subject: "Booking Canceled",
    text: "and easy to do anywhere, even with Node.js",
    html: `
                    <h2>Booking is Canceled</h2>
                   ${
                     req.user.email === data.email
                       ? ` <p> Your Booking is Canceled Successfully </p>`
                       : `<p> Your Booking Number ${id} is Canceled by admin</p>`
                   }
                `,
  };
  sgMail
    .send(msg)
    .then(() => {
      res.json({
        message: "Reservation is Cencled",
      });
    })
    .catch((error) => {
      res.json({ message: "Error is Email" + error.message });
    });
};

exports.getBookingsForUsers = async (req, res) => {
  let allbookings = await booking.find({ email: req.user.email });
  let data = [];
  for (book in allbookings) {
    let parkingData = await parking.findOne({
      id: allbookings[book].parkingId,
    });
    console.log(parkingData);
    let booked = {
      ...allbookings[book]._doc,
      parkingSpace: parkingData.name,
    };
    data.push(booked);
  }
  console.log("data", data);
  return res.json({ data });
};

exports.getAllBookings = async (req, res) => {
  let allbookings = await booking.find();
  let data = [];
  for (book in allbookings) {
    let parkingData = await parking.findOne({
      id: allbookings[book].parkingId,
    });
    console.log(parkingData);
    let booked = {
      ...allbookings[book]._doc,
      parkingSpace: parkingData.name,
    };
    data.push(booked);
  }
  console.log("data", data);
  return res.json({ data });
};
