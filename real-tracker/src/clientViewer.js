import React, { useState, useEffect } from 'react';
import './clientViewer.css';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';
import ProgBar from './ProgBar';
import ProgPerc from './ProgPerc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ClientViewer() {
    const { sgid } = useParams();
    const [showDialog, setShowDialog] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const navigate = useNavigate();
    const openDialog = () => {
        navigate('/login');
      };
  const closeDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    async function fetchPercentage() {
      try {
        const response = await axios.get(`http://localhost:5000/api/getPercentage/${sgid}`); // Use Axios for GET request
        setPercentage(response.data.percentage);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchPercentage();
  }, [sgid]);

  return (
    <div className="Container4">
      <div className="Header4" style={{ display: 'flex' }}>
        <div className="logo4">
          <img src={logo} alt="logo" style={{ width: '170px', height: '100px' }} />
        </div>
        <div className="pages4">
          <p className='home4' style={{ color: '#00C7C8' }}>Track Progress</p>
        </div>
        <div >
            <button className="logout4" style={{ marginRight: '1%' }} onClick={() => setShowDialog(true)}>
          Logout</button>
        </div>
      </div>
      {showDialog && (
      <div className="dialog4">
        <label className='confirmLogout4'>Confirm Logout</label>
        <div className='buttons4'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn4' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
        <div className="view4">
          
        </div>
        <div className="actperc4">
        <ProgPerc calculatedValue={percentage} maxValue={100} />
        </div>
        <div className="actblock4">
          <ProgBar sgid={sgid}/> 
        </div>
    </div>

    
  );
}

export default ClientViewer;