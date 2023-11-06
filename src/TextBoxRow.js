import React from 'react';
import axios from 'axios';

const TextBoxRow = () => {

  const handleSave = () => {
    const SeriesName = document.getElementById('SeriesName').value;
    const StartingNo = document.getElementById('StartingNo').value;
    const EndingNo = document.getElementById('EndingNo').value;

    axios.post('http://localhost:5000/api/modeldescription', { SeriesName, StartingNo, EndingNo })
    .then((response) => {
      console.log('Server response:',response.data); // If needed, you can display a success message to the user
    })
    .catch((error) => {
      console.log("error occured")
      console.error(error); // Handle any error that occurred during the request
    });
  };

  return (
    <div className="textbox-row">
      <label className="labels">Series Name:</label>
      <input
        type="text"
        className="textbox"
        id="SeriesName"
      />
      <label className="labels">Range:</label>
      <input
        type="text"
        className="textbox"
        id="StartingNo"
      />
      <label className="labels1">to</label>
      <input
        type="text"
        className="textbox"
        id="EndingNo"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TextBoxRow;