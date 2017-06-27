import React from 'react';


const Play = (props) => (
  <div>
    <button onClick={function(){ props.playSong() }}>Play Song</button>
  </div>
)

export default Play;