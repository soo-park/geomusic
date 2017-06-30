import React from 'react';

const PlaylistItem = (props) => (
  <div className="jumbotron">
    <h3>
    { props.item.name }
    <button className="btn btn-lg pull-right" type="button" onClick={function(){ props.addtoDB(props.item) }} >Select</button>
    </h3>
  </div>
)

export default PlaylistItem;
