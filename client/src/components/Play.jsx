import React from 'react';


const Play = (props) => (
  <div>
    <h4> List Component </h4>
    There are { props.items.length } items.
    { props.items.map(item => <ListItem item={item}/>)}
  </div>
)

export default Play;