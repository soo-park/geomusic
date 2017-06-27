import React from 'react';
import PlaylistItem from './PlaylistItem.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
  }

  getPlaylist() {
    // this function will make a get request to the server for playlist data

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

  }


  render() {
  // this is some dummy data to show playlist before real data comes through

  var dummyPlaylist = [{
    title: "Feeling good",
    location: {lat: -25.363, lng: 131.044}
    }, {
    title: "I got you",
    location: {lat: -25.363, lng: 131.044}      
    },{
    title: "Superbad",
    location: {lat: -25.363, lng: 131.044}      
    }];

    return (
    <div>
      <h4> Playlist </h4>
      <div>
      { dummyPlaylist.map(item => <PlaylistItem item={item} songSelected={this.props.songSelected} />)}
      </div>
    </div>
  )}
}

export default Playlist;