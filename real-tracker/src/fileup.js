import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './fileup.css';
import FileUpload from './upload';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';

function DashBoard() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const navigateToCustomer = () => {
      navigate('/customers');
    };
    const navigateToUser = () => {
      navigate('/users');
    };
    const openDialog = () => {
      navigate('/');
      };
  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="Container5">
      <div className="Header5" style={{ display: 'flex' }}>
        <div className="logo5">
          <img src={logo} alt="logo" style={{ width: '170px', height: '100px' }} />
        </div>
        <div className="pages5">
          <p className='headerText5'>Home</p>
        </div>
        <div className="pages5">
          <p className='headerText5'>New Plan</p>
        </div>
        <div className="pages5">
          <p className='home5' style={{ color: '#00C7C8' }}>FileUpload</p>
        </div>
        <div className="pages5">
          <p className='headerText5' onClick ={navigateToUser}>Users</p>
        </div>
        <div className="pages5">
          <p className='headerText5' onClick ={navigateToCustomer}>Customers</p>
        </div>
        <div >
            <button className="logout5" style={{ marginRight: '1%' }} onClick={() => setShowDialog(true)}>
          Logout</button>
        </div>
      </div>
      {showDialog && (
      <div className="dialog5">
        <label className='confirmLogout5'>Confirm Logout</label>
        <div className='buttons5'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn5' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
      <div className="fileupload5">
          <FileUpload />
      </div>
    </div> 
  );
}

export default DashBoard;
