import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './users.css';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';
import UserTable from './UserTable';


function UserDashBoard() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const navigateToCustomer = () => {
      navigate('/customers');
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
    <div className="Container2">
      <div className="Header2" style={{ display: 'flex' }}>
        <div className="logo2">
          <img src={logo} alt="logo" style={{ width: '170px', height: '100px' }} />
        </div>
        <div className="pages2">
          <p className='headerText2'>Home</p>
        </div>
        <div className="pages2">
          <p className='headerText2'>New Plan</p>
        </div>
        <div className="pages1">
          <p className='headerText1' onClick ={navigateToFile}>FileUpload</p>
        </div>
        <div className="pages2">
          <p className='home2' style={{ color: '#00C7C8' }}>Users</p>
        </div>
        <div className="pages2">
        
          <p className='headerText2' onClick ={navigateToCustomer}>Customers</p>
        </div>
        <div >
            <button className="logout2" style={{ marginRight: '1%' }} onClick={() => setShowDialog(true)}>
          Logout</button>
        </div>
      </div>
    
      {showDialog && (
      <div className="dialog2">
        <label className='confirmLogout2'>Confirm Logout</label>
        <div className='buttons2'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn2' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
    <UserTable/>
    </div>
  );
}

export default UserDashBoard;