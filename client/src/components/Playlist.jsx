import React from 'react';
import PlaylistItem from './PlaylistItem.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    }
  }

  componentDidMount () {
    console.log('componentDidMount ran!');
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/getplaylists'
    })
    .done(function(data) {
      console.log('playlist data', data)
      context.setState({
        playlists: data
      })
    })
  }

  render() {
    return (
    <div>
      <h4> Select a playlist for this location</h4>
      <div>
      { this.state.playlists.map(item => <PlaylistItem item={item} getCurrentLocation={this.props.getCurrentLocation} addtoDB={this.props.addtoDB} />)}
      </div>
    </div>
  )}
}

export default Playlist;
