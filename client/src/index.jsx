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
      loggedIn: false,
      showPlaylist: false
    }
    this.addSong = this.addSong.bind(this);
    this.playSong = this.playSong.bind(this);
  }


  addSong() {
    this.setState({
      showPlaylist: true
    })
  }

  playSong() {
    console.log('play song clicked')
  }


  render () {
    var display = null;
    if (this.state.showPlaylist) {
      display = <Playlist items={this.state.items}/>
    } else {
      display = <div>
                  <Map />
                  <Add addSong={this.addSong}/>
                  <Play playSong={this.playSong}/>
                </div>
    }

    return (<div>
      
      { display }
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));