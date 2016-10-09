import React, {Component} from 'react';

const ChatBar = React.createClass({
  getInitialState: function() {
    return {
      currentText: "",
      currentUser: ""
    }
  },
  //locally track the changes in the chat bar
  onChatBarChange: function(event) {
    this.setState({currentText: event.target.value});
  },

  //locally track the user input
  onUserChange: function(event) {
    this.setState({currentUser: event.target.value});
  },

  //sends the message contact back to the parent
  sendMessage: function(event) {
    if (event.keyCode === 13) {
      this.props.onSendMessage(this.state.currentUser, this.state.currentText, this.props.color);
      this.state.currentText = "";
    }
  },

  //check user function before sending to App and/or validate text field (ie alert if empty)

  render: function() {
    //console.log("rendering <ChatBar/>");
    let currentName = this.props.currentUser.name;

    return (
      <footer>
        <input
          id="username"
          type="text"
          placeholder="Your Name (Optional)"
          value={this.state.currentUser}
          onChange={this.onUserChange}
        />
        <input
          id="new-message"
          type="text"
          placeholder="Type a message and hit ENTER"
          //takes the default text
          value={this.state.currentText}
          //changes value bc of local function
          onChange={this.onChatBarChange}
          //waits for the enter key be hit
          onKeyDown={this.sendMessage}
        />
      </footer>
    );
  }
});

export default ChatBar;