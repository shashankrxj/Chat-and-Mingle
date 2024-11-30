const mongoose = require("mongoose");
const User = require("../model/model");
const fetch = require('node-fetch');

exports.newUserUpdate = (req, res) => {
  const userid = req.params.id;
  req.session.userId = userid; // Correct position for storing userId in session

  // Step 2: Check if the omeID exists in the MongoDB Atlas database
  User.findOne({ _id: userid })
    .then((user) => {
      if (user) {
        // omeID exists in the database, you can proceed with your logic here
        User.updateOne({ _id: userid }, { $set: { active: "no" } })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update user with ${userid} Maybe user not found!`,
              });
            } else {
              req.session.userId = userid;
              res.send("1 document updated");
            }
          })
          .catch((err) => {
            res.status(500).send({ message: "Error update user information" });
          });
        // Do any further actions here...
      } else {
        // omeID does not exist in the database

        // Step 4: Create a new user in MongoDB and obtain the new user's ID
        const newUser = new User({
          active: "no",
          status: "0",
        });
        newUser
          .save()
          .then((data) => {
            // Obtain the new user's ID from the saved data
            const newUserID = data._id;
            req.session.userId = newUserID; // Correct position for storing userId in session

            // Step 5: Use the obtained user ID (newUserID) as the new omeID
            var newOmeID = newUserID;

            // Step 6: Store the new omeID in both MongoDB and the browser's localStorage
            res.send({ omeID: newOmeID });
          })
          .catch((err) => {
            console.error("Error saving new user to the database:", err);
            // Handle any errors that occur during saving the new user
          });
      }
    })
    .catch((err) => {
      console.error("Error querying the database:", err);
      // Handle any errors that occur during database query
    });
};
exports.updateactiveyes = (req, res) => {
  const userid = req.params.id;

  // Step 2: Check if the omeID exists in the MongoDB Atlas database
  User.findOne({ _id: userid })
    .then((user) => {
      if (user) {
        // omeID exists in the database, you can proceed with your logic here
        User.updateOne({ _id: userid }, { $set: { active: "yes" } })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update user with ${userid} Maybe user not found!`,
              });
            } else {
              res.send("active updated successfully");
            }
          })
          .catch((err) => {
            res.status(500).send({ message: "Error update user information" });
          });
        // Do any further actions here...
      } 
    })
    .catch((err) => {
      console.error("Error querying the database:", err);
      // Handle any errors that occur during database query
    });
};

exports.updateOnNext = (req, res) => {
  const userid = req.params.id;

  User.updateOne({ _id: userid }, { $set: { status: "0" } })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with ${userid} Maybe user not found!`,
        });
      } else {
        res.send("1 document updated");
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error update user information" });
    });
};

function isValidObjectId(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const objectId = new mongoose.Types.ObjectId(id);
    const idString = objectId.toString();

    if (id === idString) {
      return true;
    }
  }

  return false;
}

exports.remoteUserFind = (req, res) => {
  const omeID = req.body.omeID;

  if (isValidObjectId(omeID)) {
    User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(omeID) },
          active: "yes",
          status: "0",
        },
      },
      { $sample: { size: 1 } },
    ])
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error occurred while retrieving user information.",
        });
      });
  } else {
  }
};

exports.deleteAllRecords = (req, res) => {
  User.deleteMany({})
    .then(() => {
      res.send("All records deleted successfully");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting all records",
      });
    });
};

// Function to verify CAPTCHA and handle form submission
exports.verifyCaptchaAndSubmit = async (req, res) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const captchaResponse = req.body.captchaResponse;

  // Verify CAPTCHA response with Google
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

  try {
    const response = await fetch(verifyUrl, { method: 'POST' });
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ success: false, message: 'CAPTCHA verification failed' });
    }
    req.session.captchaVerifiedAt = Date.now(); // Store the timestamp
    // CAPTCHA was successfully verified
    res.json({ success: true, message: 'Form submitted successfully' });

  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.reportUser = async (req, res) => {
  try {
    const { reportedUserId } = req.body;
    // Find the reported user by ID
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).send("User not found");
    }
    // Increment report count
    reportedUser.reportCount += 1;
    await reportedUser.save();
    res.send({ message: "User reported successfully", reportCount: reportedUser.reportCount });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
