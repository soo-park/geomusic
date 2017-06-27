import React from 'react';
import PlaylistItem from './PlaylistItem.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
  }

  getPlaylist() {
    //componentDidMount
    //  $.ajax({
    //   url: '/PlaylistItems', 
    //   success: (data) => {
    //     this.setState({
    //       items: data
    //     })
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   }
    // });
  var dummyPlaylist = [{
    title: "feeling good",
    location: {lat: -25.363, lng: 131.044}
    }, {
    title: "i got you",
    location: {lat: -25.363, lng: 131.044}      
    },{
    title: "superbad",
    location: {lat: -25.363, lng: 131.044}      
    }];

  return dummyPlaylist;
  }


  render() {
  var dummyPlaylist = [{
    title: "feeling good",
    location: {lat: -25.363, lng: 131.044}
    }, {
    title: "i got you",
    location: {lat: -25.363, lng: 131.044}      
    },{
    title: "superbad",
    location: {lat: -25.363, lng: 131.044}      
    }];
    
    return (
    <div>
      <h4> List Component </h4>

      { dummyPlaylist.map(item => <PlaylistItem item={item}/>)}
    </div>
  )}
}

export default Playlist;