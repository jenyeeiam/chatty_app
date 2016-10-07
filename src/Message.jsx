import React, {Component} from 'react';


const Message = React.createClass({
  render: function(){
    let color = {color: this.props.color};
    let username = this.props.username;
    let content = this.props.content;
    return (
      <div className="message">
        <span className="username" style={color}>{username}</span>
        <span className="content">{content}</span>
      </div>
    );
  }
});

export default Message;