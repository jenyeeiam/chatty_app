import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageNotification from './MessageNotification.jsx';

const MessageList = React.createClass({
  render: function() {
    //console.log("rendering <MessageList/>");
    let messages = this.props.messages;
    let user = messages.username;
    let textColor = this.props.color;
    return (
      <div id="message-list">

        {messages.map((msgObj) => {
          if (msgObj.type === "incomingNotification") {
            return <MessageNotification
              key={msgObj.key}
              content={msgObj.content}
            />
          } else {
          return <Message
            key={msgObj.key}
            username={msgObj.username}
            color={textColor}
            content={msgObj.content}
          />
        }

        })}

      </div>
    );
  }
});

export default MessageList;