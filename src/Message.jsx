import React, {Component} from 'react';


const Message = React.createClass({
  render: function(){
    console.log("rendering <Message/>");
    let username = this.props.username;
    let content = this.props.content;
    return (
      <div className="message">
        <span className="username">{username}</span>
        <span className="content">{content}</span>
      </div>
    );
  }
});

export default Message;