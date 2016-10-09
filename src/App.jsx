import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NumberUsers from './NumberUsers.jsx';


const App = React.createClass({
  getInitialState: function() {
    let data = {
      // currentUser: {
      //   name: "Anonymous",
      //   color: "black"
      // },
      messages: [],
      type: "",
      numUsers: 1,
      color: "black",
      myName: "Anonymous"//persists//assigned once upon connection
    };

    return {data: data};
  },

  //send the message to the websocket server
  onSendMessage: function(user, text, color) {
    let myName = this.state.data.myName;
    let myColor = this.state.data.color;
    //let currentUser = this.state.data.currentUser.name;
    console.log("Check users", myName, user);
    if (!user) {
      user = "Anonymous";
    }
    //if the user changed their name, send a notification message
    if (myName !== user) {
      let newMsg = {
        username: user,
        content: myName + " changed their name to " + user,
        type: "postNotification",
      }
      let changeMyName = Object.assign({}, this.state.data, {myName: user});
      this.setState({data: changeMyName});
      this.socket.send(JSON.stringify(newMsg));
    }
    //always send the message content to the server
    let newMsg = {
      username: user,
      content: text,
      type: "postMessage",
    }
    this.socket.send(JSON.stringify(newMsg));
  },

  pushMessage: function (message) {
    let pushedMsgs = this.state.data.messages.push(message);
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
    //check state for user:color
    this.socket.onmessage = (event) => {
      let parsedMsg = JSON.parse(event.data);
      console.log(parsedMsg);
      switch(parsedMsg.type) {
        //same user
        case "incomingMessage":
          let msgArr1 = this.pushMessage(parsedMsg);
          let newStateSameUser = Object.assign({}, this.state.data, msgArr1);
          this.setState({data: newStateSameUser});
          break;
        //different user
        case "incomingNotification":
          let msgArr2 = this.pushMessage(parsedMsg);
          let newStateDiffUser = Object.assign({}, this.state.data, msgArr2);
          this.setState({data: newStateDiffUser});
          break;
        case "colorAssigned":
          let textColor = Object.assign({}, this.state.data, {color: parsedMsg.color}, {myName: parsedMsg.name});
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
          color={this.state.data.color}
        />
        <ChatBar
          //this callback receives the message after hitting the enter key in the chatbar
          color={this.state.data.color}
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }
});



export default App;
