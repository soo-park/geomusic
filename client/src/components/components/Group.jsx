import React from 'react';

const Group = (props) => (
  <div className="group">
    <h3>{props.group.name}</h3>
    {props.group.members.map(member => {
      return <p>{member}</p>
    })}
  </div>
);

export default Group;
