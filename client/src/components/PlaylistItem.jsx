import React from 'react';

const PlaylistItem = (props) => (
  <div className="jumbotron">
    <h3>
    { props.item.name }
    <input className="btn btn-lg pull-right" type="checkbox" onChange={function(){ props.addtoDB(props.item) }} />
    </h3>
  </div>
)

export default PlaylistItem;
