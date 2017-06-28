import React from 'react';
import data from '../dummy_data.js';
import Group from './Group.jsx'

class Groups extends React.Component {
  constructor(props) {
    super(props);
  }

  // getDataFromDB() {
  //   var context = this;
  //   $.ajax({
  //     method: 'GET',
  //     url: '/api/groups',
  //   }).then(function(data) {
  //     context.setState({
  //       groups: data
  //     })
  //   })
  // }

  render() {
    return (
      <div className="panel">
        <h2> Groups </h2>
        <button>Get Groups</button>
        <div className="group-list">
          {this.props.groups.map((group) => {
            return <Group group={group}></Group>
          })}
        </div>
      </div>
    )
  }

}


// const Groups = (props) => (
//   <div className="panel">
//     <h2> Groups </h2>
//     <button>Get Groups</button>
//     <div className="group-list">
//       {props.groups.map((group) => {
//         return <Group group={group}></Group>
//       })}
//     </div>
//   </div>
// );

export default Groups;
