import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
    this.onUsernameChange = this.onUsernameChange.bind(this);
  }

  onUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }


  render() {
    return (
      <div>
      <p>Your Spotify username:<input value={this.state.username} onChange={this.onUsernameChange} type="text" style={{color: "black"}}/></p>
      <p><button type="button" onClick={() => { this.props.submitBtn(this.state.username) }} className="btn btn-info" >Submit</button></p>
      </div>
    )
  }
}

export default Input;
