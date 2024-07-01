const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    active: {
      type: String,
    },
    status: {
      type: String,
    },
    reportCount: {
      type: Number,
      default: 0 // Initially set to 0
    },
    browser: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("ome", userSchema);
module.exports = User;