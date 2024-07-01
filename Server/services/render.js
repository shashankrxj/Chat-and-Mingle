const User = require('../model/model');  // Adjust the path as necessary

exports.homeRoutes = (req, res) => {
  res.render("index");
};

exports.text_chat = (req, res) => {
  res.render("text_chat");
};
exports.block_page= (req, res) => {
  res.render("block_page");
};
