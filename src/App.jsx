import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NumberUsers from './NumberUsers.jsx';


const App = React.createClass({
  getInitialState: function() {
    let data = {
      currentUser: {name: "Anonymous"},
      messages: [],
      type: "",
      numUsers: 1,
      color: {
        color: "black",
        type: ""
      }
    };

    return {data: data};
  },

  //send the message to the websocket server
  onSendMessage: function(user, text) {
    let currentUser = this.state.data.currentUser.name;
    console.log(text);
    if (!user) {
      user = "Anonymous";
    }
    //if the user changed their name, send a notification message
    if (currentUser !== user) {
      let newMsg = {
        username: user,
        content: currentUser + " changed their name to " + user,
        type: "postNotification"
      }
      this.socket.send(JSON.stringify(newMsg));
    }
    //always send the message content to the server
    let newMsg = {
      username: user,
      content: text,
      type: "postMessage"
    }
    this.socket.send(JSON.stringify(newMsg));
  },

  pushMessage: function (message) {
    let pushedMsgs = this.state.data.messages.push(message);
    // let newUser =  message.username;
    // this.state.data.currentUser.name = newUser;
    // return this.state.data;
    return pushedMsgs;
  },

  //after mounting
  componentDidMount: function() {
    //creates the pipeline to the other server
    this.socket = new WebSocket("ws://localhost:4000/socketserver");
    this.socket.onopen = function(event) {
      console.log("Connected to websocket server");
    }
    //message received from the server
    this.socket.onmessage = (event) => {
      let parsedMsg = JSON.parse(event.data);
      console.log(parsedMsg);
      switch(parsedMsg.type) {
        //same user
        case "incomingMessage":
          //let newStateSameUser = this.pushMessage(parsedMsg);
          let msgArr1 = this.pushMessage(parsedMsg);
          let newStateSameUser = Object.assign({}, this.state.data, {name: parsedMsg.username}, msgArr1);
          this.setState({data: newStateSameUser});
          break;
        //different user
        case "incomingNotification":
          let msgArr2 = this.pushMessage(parsedMsg);
          //let newStateDiffUser = this.pushMessage(parsedMsg);
          let newStateDiffUser = Object.assign({}, this.state.data, {name: parsedMsg.username}, msgArr2);
          this.setState({data: newStateDiffUser});
          break;
        case "colorAssigned":
          let textColor = Object.assign({}, this.state.data, {color: parsedMsg});
          //socket.send the color back to the server;
          this.setState({data: textColor});
          break;
        default:
          let userCount = Object.assign({}, this.state.data, {numUsers: parsedMsg});
          this.setState({data: userCount});
      }
    }
  },

  render: function() {
    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
          <NumberUsers
            users={this.state.data.numUsers}
          />
        </nav>
        <MessageList
          messages={this.state.data.messages}
          color={this.state.data.color.color}
        />
        <ChatBar
          currentUser={this.state.data.currentUser}
          //this callback receives the message after hitting the enter key in the chatbar
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }
});



export default App;
