import React, { useState } from 'react';
import axios from 'axios';
import './upload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [clientId, setClientId] = useState('');
  const [OANumber, setOANumber] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClientIdChange = (e) => {
    setClientId(e.target.value);
  };

  const handleOANumberChange = (e) => {
    setOANumber(e.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('OANumber', OANumber);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File and details submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Submission failed.');
    }
  };

  return (
    <div>
      <h1> File Upload</h1>
      <div>
        <label>Enter the client ID:</label>
        <input type="text" value={clientId} onChange={handleClientIdChange} />
      </div>
      <div>
        <label>Enter the OA Number:</label>
        <input type="text" value={OANumber} onChange={handleOANumberChange} />
      </div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default FileUpload;
