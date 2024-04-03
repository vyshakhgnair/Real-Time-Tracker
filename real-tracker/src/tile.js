import React, { useState, useEffect } from 'react';
import './tile.css';
import { useNavigate } from 'react-router-dom';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';
import ColorTiles from './ColorTiles';
import { useParams } from 'react-router-dom';

function Tiles() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    const navigateToUser = () => {
        navigate('/users');
    };

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

    const { OAN } = useParams();
    console.log(OAN);
    return (
        <div className="Container3">
            <div className="Header3" style={{ display: 'flex' }}>
                <div className="logo3">
                    <img src={logo} alt="logo" style={{ width: '170px', height: '100px' }} />
                </div>
                <div className="pages3">
                    <p className='headerText3'>Home</p>
                </div>
                <div className="pages3">
                    <p className='headerText3'>New Plan</p>
                </div>
                <div className="pages3">
                    <p className='home3' style={{ color: '#00C7C8' }}>Track Progress</p>
                </div>
                <div className="pages3">
                    <p className='headerText3' onClick={navigateToFile}>FileUpload</p>
                </div>
                <div className="pages3">
                    <p className='headerText3' onClick={navigateToUser}>Users</p>
                </div>
                <div className="pages3">
                    <p className='headerText3' onClick={navigateToCustomer}>Customers</p>
                </div>
                <div>
                    <button className="logout3" style={{ marginRight: '1%' }} onClick={() => setShowDialog(true)}>
                        Logout
                    </button>
                </div>
            </div>
            {showDialog && (
                <div className="dialog3">
                    <label className='confirmLogout3'>Confirm Logout</label>
                    <div className='buttons3'>
                        <button onClick={openDialog}>YES</button>
                        <button className='yesbtn3' onClick={closeDialog}>NO</button>
                    </div>
                </div>
            )}
            <div className="view3"></div>
            <div></div>
            <div className="tiles3">
                <ColorTiles OAN={OAN} />
            </div>
        </div>
    );
}

export default Tiles;
