const express = require("express");
const route = express.Router();
const services = require("../services/render");
const controller = require("../controller/controller");
const checkBlocked = require("../middleware/ifblock");
const checkSessionValidity = require("../middleware/expire");


route.get("/", services.homeRoutes);

route.get("/block_page", services.block_page);

route.get("/text_chat",checkSessionValidity,checkBlocked, services.text_chat);
route.post("/api/users", controller.create);
route.post("/api/toassignomeID", controller.create);
route.put("/leaving-user-update/:id", controller.leavingUserUpdate);
route.put("/update-on-otheruser-closing/:id",controller.updateOnOtherUserClosing);
route.post("/verify", controller.verifyCaptchaAndSubmit);

route.post("/report", controller.reportUser);

route.put("/updateactiveyes/:id", controller.updateactiveyes);
route.put("/new-user-update/:id", controller.newUserUpdate);
route.post("/get-remote-users", controller.remoteUserFind);
route.put("/update-on-engagement/:id", controller.updateOnEngagement);
route.put("/update-on-next/:id", controller.updateOnNext);
route.post("/get-next-user", controller.getNextUser);
route.delete("/deleteAllRecords", controller.deleteAllRecords);

module.exports = route;
