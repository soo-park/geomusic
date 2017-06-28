import React from 'react';

const PreferenceList = ({student}) => (
  <div className="pref-list">
    <div className="pref">
      <div className="pref-name title"> Name </div>
      <div className="pref-item title"> To {student.name} </div>
    </div>
    <div className="pref item">
      <div className="pref-name"> {student.preferences[0].name}</div>
      <div className="pref-item"> {student.preferences[0].toPreference} </div>
    </div>
    <div className="pref item">
      <div className="pref-name"> {student.preferences[1].name}</div>
      <div className="pref-item"> {student.preferences[1].toPreference} </div>
    </div>
    <div className="pref item">
      <div className="pref-name"> {student.preferences[2].name}</div>
      <div className="pref-item"> {student.preferences[2].toPreference} </div>
    </div>
    <div className="pref item">
      <div className="pref-name"> {student.preferences[3].name}</div>
      <div className="pref-item"> {student.preferences[3].toPreference} </div>
    </div>
    <div className="pref item">
      <div className="pref-name"> {student.preferences[4].name}</div>
      <div className="pref-item"> {student.preferences[4].toPreference} </div>
    </div>
  </div>
);

export default PreferenceList;

// <div className="pref-list">
//   <div className="pref">
//     <div className="pref-name title"> Name </div>
//     <div className="pref-item title"> To {student.name} </div>
//   </div>
//   <div className="pref item">
//     <div className="pref-name"> {student.preferences[0].name}</div>
//     <div className="pref-item"> {student.preferences[0].toPreference} </div>
//   </div>
//   <div className="pref item">
//     <div className="pref-name"> {student.preferences[1].name}</div>
//     <div className="pref-item"> {student.preferences[1].toPreference} </div>
//   </div>
//   <div className="pref item">
//     <div className="pref-name"> {student.preferences[2].name}</div>
//     <div className="pref-item"> {student.preferences[2].toPreference} </div>
//   </div>
//   <div className="pref item">
//     <div className="pref-name"> {student.preferences[3].name}</div>
//     <div className="pref-item"> {student.preferences[3].toPreference} </div>
//   </div>
//   <div className="pref item">
//     <div className="pref-name"> {student.preferences[4].name}</div>
//     <div className="pref-item"> {student.preferences[4].toPreference} </div>
//   </div>
// </div>
