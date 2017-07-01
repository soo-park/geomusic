import React from 'react';


const Play = (props) => (

    <button type="button" onClick={function(){ props.getCurrentLocation() }} className="btn btn-info" >Play Playlist</button>

)

export default Play;
