const User = require("../models/user");
const Admin = require("../models/admin");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ message: "user with this email already exists" });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: "20m" }
    );
    const msg = {
      to: email, // Change to your recipient
      from: "jamil.ahmed@wah-brands.com", // Change to your verified sender
      subject: "Account Activation Link",
      text: "and easy to do anywhere, even with Node.js",
      html: `
                    <h2>Please Click on given Link to activate your account</h2>
                    <a href="app-d83895ee-04a8-4417-b70b-0873e8873a83.cleverapps.io/authentication/activate/${token}">Link</a>
                `,
    };
    sgMail
      .send(msg)
      .then(() => {
        return res.json({
          message: "Eamil has been sent,kindly Activate Your Account",
        });
      })
      .catch((error) => {
        return res.json({ message: error.message });
      });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_ACC_ACTIVATE, (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ message: "Incorrect or Expired link" });
      }
      const { name, email, password } = decodedToken;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res
            .status(400)
            .json({ error: "user with this email already exists" });
        }
        let newUser = new User({ name, email, password });
        newUser.save((err, success) => {
          if (err) {
            console.log("Error in Singup while account activation: ", err);
            return res.status(400).json({ error: err });
          }
          res.json({
            message: "Signup Success",
          });
        });
      });
    });
  } else {
    return res.json({ message: "Something went wrong!!!" });
  }
};
exports.signin = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      console.log(user.password === password);
      if (user.password === password) {
        const accsessToken = jwt.sign(
          { email: email },
          process.env.JWT_ACC_ACTIVATE
        );
        return res.json({
          asscessToken: accsessToken,
          user,
          message: "Matched",
        });
      } else {
        return res.json({ message: "Email and Password Not Matched" });
      }
    } else {
      return res.json({ message: "Email and Password Not Matched" });
    }
  });
};

exports.adminsignup = (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  Admin.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ message: "user with this email already exists" });
    }
    let newUser = new Admin({ name, email, password });
    newUser.save((err, success) => {
      if (err) {
        console.log("Error in Singup while account activation: ", err);
        return res.status(400).json({ error: err });
      }
      res.json({
        message: "Signup Success",
      });
    });
  });
};

exports.adminsignin = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email);
  Admin.findOne({ email }).exec((err, user) => {
    if (user) {
      console.log(user.password === password);
      if (user.password === password) {
        const accsessToken = jwt.sign(
          { email: email },
          process.env.JWT_ACC_ACTIVATE
        );
        return res.json({
          asscessToken: accsessToken,
          user,
          message: "Matched",
        });
      } else {
        return res.json({ message: "Email and Password Not Matched" });
      }
    } else {
      return res.json({ message: "Email and Password Not Matched" });
    }
  });
};

exports.listOfAllUsers = async (req, res) => {
  let users = await User.find({});
  res.json({ users });
};
