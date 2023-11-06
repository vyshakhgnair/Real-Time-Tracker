/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customerTable.css';
import { useNavigate } from 'react-router-dom';

function CustomerTable() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  
  const handleOANClick = (OAN) => {
    try {
      //console.log(OAN); // Make sure you are getting the 'OAN' value here
      const tilesURL = `/tile/${OAN}`; // Use backticks and /tiles/${OAN}
      // Redirect to the Tiles component with the 'OAN' parameter
      navigate(tilesURL);
    } catch (error) {
      console.error(error);
    }
  }
  


  useEffect(() => {
    axios.get('http://localhost:5000/datacustomer')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <table className="user-table2">
        <thead>
          <tr>
            <th>ClientID</th>
            <th>ClientName</th>
            <th>OAN</th>
            <th>Completion Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.ClientID} onClick={() => handleOANClick(item.OAN)}>
              <td>{item.ClientID}</td>
              <td>{item.ClientName}</td>
              <td>{item.OAN}</td>
              <td>{item.Percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;
