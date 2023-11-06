import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './customers.css';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';
import ProgBar from './modelProgBar';
import CustomerTable from './customerTable';
import ProgBar2 from './modelProgBar2';
import ProgBar3 from './modelProgBar3';
//import ProgPerc from './ProgPerc';

function CustomerDashBoard() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    
    const navigateToUser = () => {
      navigate('/users');
    };
    const navigateToFile = () => {
      navigate('/file');
    };
    const openDialog = () => {
        navigate('/');
      };
  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="Container1">
      <div className="Header1" style={{ display: 'flex' }}>
        <div className="logo1">
          <img src={logo} alt="logo" style={{ width: '170px', height: '100px' }} />
        </div>
        <div className="pages1">
          <p className='headerText1'>Home</p>
        </div>
        <div className="pages1">
          <p className='headerText1'>New Plan</p>
        </div>
        <div className="pages1">
          <p className='headerText1' onClick ={navigateToFile}>FileUpload</p>
        </div>
        <div className="pages1">
          <p className='headerText1' onClick ={navigateToUser}>Users</p>
        </div>
        <div className="pages1">
          <p className='home1' style={{ color: '#00C7C8' }}>Customers</p>
        </div>
        <div >
            <button className="logout1" style={{ marginRight: '1%' }} onClick={() => setShowDialog(true)}>
          Logout</button>
        </div>
      </div>
      {showDialog && (
      <div className="dialog1">
        <label className='confirmLogout1'>Confirm Logout</label>
        <div className='buttons1'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn1' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
        <br/>
        <div className='container1'>
            <div className="actblock1">
            <ProgBar/> 
            </div>
            <div className="actblock2">
            <ProgBar2/> 
            </div>
            <div className="actblock3">
            <ProgBar3/> 
            
            </div>
           
            
        </div>
        <br/>
            <div className='ct1' style={{ width: '100%' }}>
            <CustomerTable/>
            </div>
    </div>

    
  );
}

export default CustomerDashBoard;