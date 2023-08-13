import React, { useState } from 'react';
import './home.css';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';

function DashBoard() {
    const [showDialog, setShowDialog] = useState(false);
    const openDialog = () => {
        setShowDialog(true);
      };
  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="Container">
      <div className="Header" style={{ display: 'flex' }}>
        <div className="logo">
          <img src={logo} alt="logo" style={{ width: '170px', height: '100px' }} />
        </div>
        <div className="pages">
          <p className='home' style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>Home</p>
        </div>
        <div className="pages">
          <p className='headerText'>New Plan</p>
        </div>
        <div className="pages">
          <p className='headerText'>Track Progress</p>
        </div>
        <div className="pages">
          <p className='headerText'>Users</p>
        </div>
        <div className="pages">
          <p className='headerText'>Customers</p>
        </div>
        <div >
            <button className="logout" style={{ marginRight: '1%' }} onClick={() => setShowDialog(true)}>
          Logout</button>
        </div>
      </div>
      {showDialog && (
      <div className="dialog">
        <label className='confirmLogout'>Confirm Logout</label>
        <div className='buttons'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
    </div>
    
  );
}

export default DashBoard;