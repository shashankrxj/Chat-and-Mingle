let localStream;
var username;
let remoteUser;
let peerConnection;
let remoteStream;
let sendChannel;
let receiveChannel;
var msgInput = document.querySelector("#msg-input");
var msgSendBtn = document.querySelector(".msg-send-button");
var chatTextArea = document.querySelector(".chat-text-area");
msgInput.disabled = true;
let reportButton = document.getElementById("reportButton");
var omeID = localStorage.getItem("omeID");
if (omeID) {
    username=omeID;
    $.ajax({
        url: "/updateactiveyes/" + username + "",
        type: "PUT",
        success: function (data) {
            runUser();
            
        },
    });
}

function runUser() {
    let init = async () => {
        $.post("/get-remote-users", { omeID: username })
            .done(function (data) {
                if (data[0]) {
                    if (data[0]._id == remoteUser || data[0]._id == username) {
                    } else {
                        remoteUser = data[0]._id;
                        createOffer(data[0]._id);
                    }
                }
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
            });
    };
    init();
    let socket = io.connect();
    socket.on("connect", () => {
        if (socket.connected) {
            socket.emit("userconnect", {
                displayName: username,
            });
        }
    });
    let servers = {
        iceServers: [
            {
                urls: [
                    "stun:stun1.1.google.com:19302",
                    "stun:stun2.1.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                    "stun:stun.ekiga.net",
                    "stun:stun.ideasip.com",
                    "stun:stun.rixtelecom.se",
                    "stun:stun.schlund.de"
                ],
            },
        ],
    };
    let createPeerConnection = async () => {
        if (peerConnection) {
           await peerConnection.close();
           peerConnection = null;
       }
        peerConnection = new RTCPeerConnection(servers);
        
        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) {
                socket.emit("candidateSentToUser", {
                    username: username,
                    remoteUser: remoteUser,
                    iceCandidateData: event.candidate,
                });
            }
        };
        sendChannel = peerConnection.createDataChannel("sendDataChannel");
        sendChannel.onopen = () => {
            onSendChannelStateChange();
            document.querySelector(".z").innerHTML = "<p style='font-weight: bold;'> user connected enjoy ur company</p>"
            msgInput.disabled = false; // Enable the textarea
        };
        peerConnection.ondatachannel = receiveChannelCallback;
    };

    function sendData() {
        const msgData = msgInput.value.trim(); // Trim whitespace from the input
        if (msgData.length > 0) {
            chatTextArea.innerHTML +=
            "<div style='margin-left:15px; margin-top:8px; color:rgb(219, 210, 210);'>" +
            "<b style='color:black; font-family: Georgia, \"Times New Roman\", Times, serif; font-size: medium;'>You: </b>" +
            "<span style='font-family: Georgia, \"Times New Roman\", Times, serif; font-size: medium;text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);'>" +
            msgData +
            "</span></div>";
            if (sendChannel) {
                onSendChannelStateChange();
                sendChannel.send(msgData);
                msgInput.value = "";
            } else {
                receiveChannel.send(msgData);
                msgInput.value = "";
            }
            scrollToBottom(); // Scroll to the bottom after sending a message

        }
    }

    function receiveChannelCallback(event) {
        receiveChannel = event.channel;
        receiveChannel.onmessage = onReceiveChannelMessageCallback;
        receiveChannel.onopen = onReceiveChannelStateChange;
        receiveChannel.onclose = onReceiveChannelStateChange;
    }

    function onReceiveChannelMessageCallback(event) {
        chatTextArea.innerHTML +=
        "<div style='margin-left:15px; margin-top:8px; color:rgb(219, 210, 210);'>" +
        "<b style='color: #7d00cb; font-family: Georgia, \"Times New Roman\", Times, serif; font-size: medium;'>Stranger: </b>" +
        "<span style='font-family: Georgia, \"Times New Roman\", Times, serif; font-size: medium; text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);'>" +
        event.data +
        "</span></div>";
        scrollToBottom(); // Scroll to the bottom after receiving a message

    }

    function onReceiveChannelStateChange() {
        const readyState = receiveChannel.readyState;
        if (readyState === "open") {
            
        } else {
            
            document.querySelector(".msg-send-button").style.pointerEvents = "none";
            document.querySelector("#msg-input").value = ""; 
            msgInput.disabled = true;

        }
    }

    function onSendChannelStateChange() {
        const readyState = sendChannel.readyState;
        if (readyState === "open") {
            
        } else {
            
        }
    }

    function fetchNextUser(prevRemoteUser) {
        document.querySelector(".z").innerHTML = "<p style='font-weight: bold;'> disconnected searching new user </p>";
        document.querySelector("#msg-input").value = "";
        document.querySelector(".next-chat").style.pointerEvents = "none";
        document.querySelector(".msg-send-button").style.pointerEvents = "none";
      
        $.post(
          "/get-next-user",
          { omeID: username, remoteUser: prevRemoteUser },
          function (data) {
            if (data.blocked === 'yes') {
              // Redirect to block page if user is blocked
              window.location.replace('/block_page');
            } else if (data.data && data.data[0]) {
              if (data.data[0]._id == prevRemoteUser || data.data[0]._id == username) {
                // If the fetched user is the same as the current user or remoteUser, do nothing
              } else {
                // Otherwise, proceed with creating offer for the next user
                document.getElementById("reportButton").disabled = false;
                remoteUser = data.data[0]._id;
                createOffer(data.data[0]._id);
              }
            } else {

            }
          }
        );
      }

    let createOffer = async (remoteU) => {
        await createPeerConnection();
        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offerSentToRemote", {
            username: username,
            remoteUser: remoteU,
            offer: peerConnection.localDescription,
        });
    };

    let createAnswer = async (data) => {
        remoteUser = data.username;
        await createPeerConnection();
        await peerConnection.setRemoteDescription(data.offer);
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answerSentToUser1", {
            answer: answer,
            sender: data.remoteUser,
            receiver: data.username,
        });
        document.querySelector(".next-chat").style.pointerEvents = "auto";
        document.querySelector(".msg-send-button").style.pointerEvents = "auto";
        $.ajax({
            url: "/update-on-engagement/" + username + "",
            type: "PUT",
            success: function (response) {},
        });
    };

    socket.on("ReceiveOffer", function (data) {
        createAnswer(data);
    });

    let addAnswer = async (data) => {
        await peerConnection.setRemoteDescription(data.answer);
        document.querySelector(".next-chat").style.pointerEvents = "auto";
        document.querySelector(".msg-send-button").style.pointerEvents = "auto";
        $.ajax({
          url: "/update-on-engagement/" + username + "",
          type: "PUT",
          success: function (response) {},
      });
  };

  socket.on("ReceiveAnswer", function (data) {
      addAnswer(data);
  });

  socket.on("closedRemoteUser", function (data) {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
      document.querySelector(".chat-text-area").innerHTML = "";
      $.ajax({
          url: "/update-on-next/" + username + "",
          type: "PUT",
          success: function (response) {
            setTimeout(function () {
                fetchNextUser(remoteUser);
            }, 500); // 5000 milliseconds = 5 seconds delay
          },
      });
  });

  socket.on("candidateReceiver", function (data) {
      peerConnection.addIceCandidate(data.iceCandidateData);
  });

  msgSendBtn.addEventListener("click", function (event) {
      if (sendChannel.readyState === "open") {
          sendData();
      }
  });

  msgInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          event.preventDefault(); // Prevent the default behavior of creating a new line
          if (sendChannel.readyState === "open") {
              sendData();
          }
      }
  });

  window.addEventListener("beforeunload", async function (event) {
    socket.emit("remoteUserClosed", {
      username: username,
      remoteUser: remoteUser,
    });
    // Close the peer connection
    if (peerConnection) {
        await peerConnection.close();
        peerConnection = null;
    }
    
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      $.ajax({
        url: "/leaving-user-update/" + username + "",
        type: "PUT",
        success: function (response) {
        },
      });
      $.ajax({
          url: "/update-on-otheruser-closing/" + remoteUser + "",
          type: "PUT",
        success: function (response) {
        },
    });
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        $.ajax({
        url: "/leaving-user-update/" + username + "",
        type: "PUT",
        async: false,
        success: function (response) {
        },
    });
    
    $.ajax({
        url: "/update-on-otheruser-closing/" + remoteUser + "",
        type: "PUT",
        async: false,
        success: function (response) {
        },
    });
    } else {
    }
  });

  async function closeConnection(prevRemoteUser) {
      // Clear the chat area
      document.querySelector(".chat-text-area").innerHTML = "";
      msgInput.disabled = true; // Enable the textarea


      
      // Notify the server about the closure
      socket.emit("remoteUserClosed", {
          username: username,
          remoteUser: prevRemoteUser,
        });

        
        // Close the peer connection
        if (peerConnection) {
            await peerConnection.close();
            peerConnection = null;
        }
      // Update the server about moving to the next user
      $.ajax({
          url: "/update-on-next/" + username,
          type: "PUT",
          success: function (response) {
              fetchNextUser(prevRemoteUser);
          },
      });
  }

  $(document).on("click", ".next-chat", function () {
      document.querySelector(".chat-text-area").innerHTML = "";
      closeConnection(remoteUser); // Pass remoteUser here
    });
}

document.getElementById("reportButton").addEventListener("click", function() {
  // Make an AJAX request to report the user
  if (sendChannel.readyState === "open") {
      $.ajax({
          type: "POST",
          url: "/report",
          data: { reportedUserId: remoteUser },
          error: function(error) {
              // Handle error response
              console.error("Error reporting user:", error);
          }
      });
      document.getElementById("reportButton").disabled = true;
  }
});

// Define a function to scroll the chat area to the bottom
function scrollToBottom() {
    var chatTextArea = document.querySelector(".chat-text-area");
    chatTextArea.scrollTop = chatTextArea.scrollHeight;
}
