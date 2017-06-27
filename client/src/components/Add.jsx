import React from 'react';


const Add = (props) => (
  
    <button type="button" onClick={function(){ props.addSong() }} className="btn btn-info" >Add Song</button>
  
)

export default Add;