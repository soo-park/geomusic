import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Add from './components/Add.jsx';
import Login from './components/Login.jsx';
import Map from './components/Map.jsx';
import Play from './components/Play.jsx';
import Playlist from './components/Playlist.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      showPlaylist: false,
      radioChecked: false,
      playlistSelected: null,
      locations: []
    }
    this.addBtn = this.addBtn.bind(this);
    this.playSong = this.playSong.bind(this);
    this.addtoDB = this.addtoDB.bind(this);
  }


  addBtn() {
    // ajax call to getPlaylist then give to playlist
    this.setState({
      showPlaylist: true
    })
  }

  playSong() {
    // current location hardcoded, due to be get request
    var lng = -122.408942;
    var lat = 37.783696;

   // get playlistURL of closest pin to current location
    $.ajax({
      method: 'GET',
      url: '/sendClosestPlaylist' + '?' + JSON.stringify(lng) + '=' + JSON.stringify(lat)
    })
    .done(function(data) {
    // redirects client to playlistURL
      window.location.assign(data);
    })

  }

  addtoDB(playlist) {
    console.log(playlist)
    $.ajax({
      url: '/newpin',
      type: 'POST',
      data: {
        location: { type: 'Point', coordinates: [-122.408942, 37.783696] },
        playlistUrl: playlist.external_urls.spotify,
        playlistName: playlist.name
      }
    })
  }

  render () {
    var display = null;
    if (!this.state.loggedIn) {
      display = <Login />
    } else if (this.state.showPlaylist) {
      display = <div className="container">
                  <Playlist addtoDB={this.addtoDB} />
                </div>
    } else {
      display = <div className="container">
                  <Map />
                  <br></br>
                    <div className="btn-group" role="group">
                      <Add addBtn={this.addBtn}/>
                      <Play playSong={this.playSong} />
                    </div>
                </div>
    }
    return (<div>{ display }</div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
