import React, {Component} from 'react';


const MessageNotification = React.createClass({

  render: function() {
    let content = this.props.content;
    return(
      <div className="message system">
        {content}
      </div>
    );
  }
});

export default MessageNotification;