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
      // loggedIn: true,
      showPlaylist: false,
      radioChecked: false,
      playlistSelected: null,
      location: []
    }
    this.addBtn = this.addBtn.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.addtoDB = this.addtoDB.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
  }


  addBtn() {
    // ajax call to getPlaylist then give to playlist
    this.setState({
      showPlaylist: true
    })
  }

  playPlaylist(lng, lat) {
    console.log(lng, lat);
    // current location hardcoded, due to be get request
    // var lng = -122.408942;
    // var lat = 37.783696;

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
    var context = this;
    $.ajax({
      url: '/newpin',
      type: 'POST',
      data: {
        location: { type: 'Point', coordinates: [context.state.location[0], context.state.location[1]] },
        playlistUrl: playlist.external_urls.spotify,
        playlistName: playlist.name
      }
    })
  }

// get user's current location & call addtoDB
  getCurrentLocation(playlist) {
    var context = this;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      context.setState({
        location: [crd.longitude, crd.latitude]
      }, function() {
        if (playlist) {
          context.addtoDB(playlist)
        } else {
          context.playPlaylist(context.state.location[0], context.state.location[1])
        }
      })
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    window.navigator.geolocation.getCurrentPosition(success, error, options);
  }


  render () {
    var display = null;
    // if (!this.state.loggedIn) {
    //   display = <Login />
    // } else
    if (this.state.showPlaylist) {
      display = <div className="container">
                  <Playlist getCurrentLocation={this.getCurrentLocation} addtoDB={this.addtoDB} />
                </div>
    } else {
      display = <div className="container">
                  <Map />
                  <br></br>
                    <div className="btn-group" role="group">
                      <Add addBtn={this.addBtn}/>
                      <Play playPlaylist={this.playPlaylist} getCurrentLocation={this.getCurrentLocation}/>
                    </div>
                </div>
    }
    return (<div>{ display }</div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
