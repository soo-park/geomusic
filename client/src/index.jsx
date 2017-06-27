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
  }

  // componentDidMount() {
  //   $.ajax({
  //     url: '/items', 
  //     success: (data) => {
  //       this.setState({
  //         items: data
  //       })
  //     },
  //     error: (err) => {
  //       console.log('err', err);
  //     }
  //   });
  // }
  addSong() {
    this.setState({
      showPlaylist: true
    })
  }


  render () {
    var display = null;
    if (this.state.showPlaylist) {
      display = <Playlist items={this.state.items}/>
    } else {
      display = <div>
                  <Map />
                  <Add addSong={this.addSong}/>
                  <Play />
                </div>
    }

    return (<div>
      <h1>Item List </h1>
      { display }
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));