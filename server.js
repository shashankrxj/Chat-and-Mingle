const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require('express-session'); // used for user._id from indexafterlogin to create
const cookieParser = require('cookie-parser');



const app = express();

// used for user._id from indexafterlogin to create
app.use(session({
  secret: 'ccfd76eb0731ee1e0b0a34bdc77840ec3667e83c79ea6278ab7844c00c06e946',
  resave: false,
  saveUninitialized: false
}));

const dotenv = require("dotenv");
const connectDB = require("./Server/database/connection");

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;

connectDB();
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/css", express.static(path.resolve(__dirname, "Assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "Assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "Assets/js")));
app.use("/fonts", express.static(path.resolve(__dirname, "Assets/fonts")));

app.use("/", require("./Server/routes/router"));

// Serve sitemap.xml statically
app.use("/sitemap.xml", express.static(path.resolve(__dirname, "sitemap.xml")));

var server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  allowEIO3: true, //False by default
});

var userConnection = [];
var randomUserCount = Math.floor(Math.random() * 31) + 127; // Initial random count between 127 and 157

io.on("connection", (socket) => {

  socket.on("userconnect", (data) => {
    userConnection.push({
      connectionId: socket.id,
      user_id: data.displayName,
    });
    // Emit the updated user count to all connected clients
    let adjustedUserCount = userConnection.length + randomUserCount;
    io.emit("updateUserCount", adjustedUserCount);

    var userCount = userConnection.length;
    userConnection.map(function (user) {
    });
  
  });
  socket.on("offerSentToRemote", (data) => {
    var offerReceiver = userConnection.find(
      (o) => o.user_id === data.remoteUser
    );
    if (offerReceiver) {
      socket.to(offerReceiver.connectionId).emit("ReceiveOffer", data);
    }
  });
  socket.on("answerSentToUser1", (data) => {
    var answerReceiver = userConnection.find(
      (o) => o.user_id === data.receiver
    );
    if (answerReceiver) {
      socket.to(answerReceiver.connectionId).emit("ReceiveAnswer", data);
    }
  });
  socket.on("candidateSentToUser", (data) => {
    var candidateReceiver = userConnection.find(
      (o) => o.user_id === data.remoteUser
    );
    if (candidateReceiver) {
      socket.to(candidateReceiver.connectionId).emit("candidateReceiver", data);
    }
  });

  socket.on("disconnect", () => {
    // var disUser = userConnection.find((p) => (p.connectionId = socket.id));
    // if (disUser) {
    userConnection = userConnection.filter((user) => user.connectionId !== socket.id);
    // Emit the updated user count to all connected clients
    let adjustedUserCount = userConnection.length + randomUserCount;
    io.emit("updateUserCount", adjustedUserCount);
    
  });
  socket.on("remoteUserClosed", (data) => {
    var closedUser = userConnection.find((o) => o.user_id === data.remoteUser);
    if (closedUser) {
      socket.to(closedUser.connectionId).emit("closedRemoteUser", data);
    }
  });
});

// Function to update random user count every 20 seconds
setInterval(() => {
  randomUserCount = Math.floor(Math.random() * 31) + 127;
  let adjustedUserCount = userConnection.length + randomUserCount;
  io.emit("updateUserCount", adjustedUserCount);
}, 60000);
