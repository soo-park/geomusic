import React from 'react';

const PlaylistItem = (props) => (
  <div>
    <li>
    { props.item.title }
    <input type="radio" onChange={function(){ props.songSelected(props.item) }} />
    </li>
  </div>
)

export default PlaylistItem;