const User = require("../model/model");

// middleware to check if user is blocked
const checkBlocked = async (req, res, next) => {
  try {
    // Retrieve userId from session
    const userId = req.session.userId;

    if (!userId) {
      // User ID not found in session
      return res.status(404).send("User not found in session");
    }

    // Assuming you have access to the User model
    const user = await User.findById(userId);

    if (!user) {
      // User not found
      return res.status(404).send("User not found");
    }

    if (user.blocked === 'yes' || user.reportCount >= 3) {
      // User is blocked or report count is greater than or equal to 3, redirect to block page
      return res.redirect("/block_page");
    }

    // User is not blocked and report count is less than 3, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking user block status:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = checkBlocked;
