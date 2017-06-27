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
      radioChecked: false
    }
    this.addSong = this.addSong.bind(this);
    this.playSong = this.playSong.bind(this);
    this.songSelected = this.songSelected.bind(this);
  }


  addSong() {
    this.setState({
      showPlaylist: true
    })
  }

  playSong() {
    console.log('play song clicked')
  }

  songSelected(song) {
    // when this is clicked we can create a post request here to server requesting that
    // song be added to the database
    console.log('Playlist song selected', song);
  }


  render () {
    var display = null;
    if (!this.state.loggedIn) {
      display = <Login /> 
    } else if (this.state.showPlaylist) {
      display = <div className="container">
                  <Playlist items={this.state.items} songSelected={this.songSelected} />
                </div>
    } else {
      display = <div className="container">
                  <Map />
                  <br></br>
                    <div className="btn-group" role="group">
                      <Add addSong={this.addSong}/>
                      <Play playSong={this.playSong} />
                    </div>
                </div>
    }
    return (<div>{ display }</div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));