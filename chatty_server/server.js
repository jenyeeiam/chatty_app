// server.js

const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

const uuid = require('node-uuid');
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


var colors = ['tomato', 'cornflowerblue', 'bisque', 'chocolate', 'salmon'];
wss.on('connection', (socket) => {
  console.log('Client connected');
  //broadcast how many users are online
  let numUsers = wss.clients.length;
  wss.broadcast(numUsers.toString());
  //assign a random color to user
  let randomColor = colors[getRandomInt(0, colors.length -1)];
  socket.send(JSON.stringify({type: "colorAssigned", color: randomColor}));

  socket.on('message', function(message) {
    let serverMsg = JSON.parse(message);
    let name = serverMsg.username;
    let type = serverMsg.type;
    let color = serverMsg.color;
    //serverMsg.numUsers = numUsers;
    serverMsg.key = uuid.v1();
    if (type === "postMessage" ) {
      serverMsg.type = "incomingMessage";
    } else if(type === "postNotification") {
      serverMsg.type = "incomingNotification";
    }
    console.log(serverMsg);
    wss.broadcast(JSON.stringify(serverMsg));
  });



  // Set up a callback for when a client closes the socket. This usually means they closed their brosocketer.
  socket.on('close', () => {console.log('Client disconnected')
  wss.broadcast(wss.clients.length.toString());
  });
});

