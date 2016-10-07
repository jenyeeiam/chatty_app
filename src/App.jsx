import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NumberUsers from './NumberUsers.jsx';


const App = React.createClass({
  //set the state of the parent
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
    if (!user) {
      user = "Anonymous";
    }
    if (currentUser !== user) {
      let newMsg = {
        username: user,
        content: currentUser + " changed their name to " + user,
        type: "postNotification"
      }
      this.socket.send(JSON.stringify(newMsg));
    }

    let newMsg = {
      username: user,
      content: text,
      type: "postMessage"
    }
    this.socket.send(JSON.stringify(newMsg));


  },

  pushMessage: function (message) {
    this.state.data.messages.push(message);
    let newUser =  message.username;
    this.state.data.currentUser.name = newUser;
    return this.state.data;
  },

  //after mounting
  componentDidMount: function() {
    console.log("componentDidMount <App />");

    //creates the pipeline to the other server
    this.socket = new WebSocket("ws://localhost:4000/socketserver");
    this.socket.onopen = function(event) {
      console.log("Connected to websocket server");
    }

    //message received from the server
    this.socket.onmessage = (event) => {
      let parsedMsg = JSON.parse(event.data);
      switch(parsedMsg.type) {
        case "incomingMessage":
          let newStateSameUser = this.pushMessage(parsedMsg);
          this.setState({data: newStateSameUser});
          break;
        case "incomingNotification":
          let newStateDiffUser = this.pushMessage(parsedMsg);
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
          //send the message array to MessageList
          messages={this.state.data.messages}
          color={this.state.data.color.color}
        />
        <ChatBar
          //send the current user to the footer
          currentUser={this.state.data.currentUser}
          //this callback receives the message after hitting the enter key in the chatbar
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }
});



export default App;
