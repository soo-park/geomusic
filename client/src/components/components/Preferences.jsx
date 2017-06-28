import React from 'react';
import data from '../dummy_data.js';

import PreferenceList from './PreferenceList.jsx';

class Preferences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      student: data.student,
      students: data.students,
      selectedStudent: {}
    };
  }

  handleChange(e) {
    this.setState({
      selectedStudent: e.target.value,
      student: e.target.value
    })
  }

  render() {
    return (
      <div className="panel">
        <h2>
          Preferences
        </h2>
        <label htmlFor="mySelect">Choose a student:
        </label>
        <select name="mySelect" onChange={this.handleChange.bind(this)} value={this.state.selectedStudent}>
          {this.state.students.map((student) => (
            <option key={student.id}>{student.name}</option>
          ))}
        </select>
        {this.state.student
          ? <PreferenceList student={this.state.student}/>
          : ''}
      </div>
    );
  }
}

export default Preferences;
