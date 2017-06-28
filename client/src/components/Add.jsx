import React from 'react';


const Add = (props) => (

    <button type="button" onClick={function(){ props.addSong() }} className="btn btn-info" >Add Playlist</button>

)

export default Add;
