import React, {Component} from 'react';


const NumberUsers = React.createClass({
  render: function() {
    let content = this.props.users;
    return(
      <div className="users">
        {content} Users online!
      </div>
    );
  }
});

export default NumberUsers;