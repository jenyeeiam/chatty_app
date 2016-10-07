import React, {Component} from 'react';


const NumberUsers = React.createClass({
  render: function() {
    console.log("numusers props", this.props);
    let content = this.props.users;
    return(
      <div className="users">
        {content} Users online!
      </div>
    );
  }
});

export default NumberUsers;