import React from 'react';


const Add = (props) => (
  <div>
    <button onClick={function(){ props.addSong() }} >Add Song</button>
  </div>
)

export default Add;