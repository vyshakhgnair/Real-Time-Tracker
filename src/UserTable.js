import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './UserTable.css'

function UserTable() {
  const [data, setData] = useState([]);
  //const [updatedUserData, setUpdatedUserData] = useState({});
  //const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false); // For changing user status 
  const [isAlert,setIsAlertOpen]=useState(false);// State to control the visibility of the modal
  const [isStatusUpdatedAlertOpen, setIsStatusUpdatedAlertOpen] = useState(false); // For displaying status updated alert
  const [statusUpdatedMessage, setStatusUpdatedMessage] = useState(''); // Message for status updated alert
  
  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleOpenChangeStatusModal = (userID) => {
    setSelectedUserID(userID);
    setIsChangeStatusModalOpen(true);
  };

  const handleCloseChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const handleStatusSave = () => {
    axios
      .put(`http://localhost:5000/api/data/${selectedUserID}`, { status: newStatus })
      .then((response) => {
        console.log('Status changed:', response.data,newStatus);
        setStatusUpdatedMessage('Status updated successfully'); // Set the message for the status updated alert
        setIsStatusUpdatedAlertOpen(true);
        setIsChangeStatusModalOpen(false);

        // Update the user's status in the 'data' state
        setData((prevData) =>
          prevData.map((user) => {
            if (user.UserID === selectedUserID) {
              return { ...user, Status: newStatus };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setIsChangeStatusModalOpen(false);
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  
  const handleCancel=()=>{
    handleCloseModal();
  };
  const handleisAlert = () => {
    handleCloseModal();
    const UserID = document.getElementById('UserIDInput').value;
    const UserName = document.getElementById('UserNameInput').value;
    const Role = document.getElementById('RoleInput').value;
    const Email = document.getElementById('EmailInput').value;
    const Password = document.getElementById('PasswordInput').value;

    axios.post('http://localhost:5000/api/data', { UserID, UserName, Role, Email, Password })
    .then((response) => {
      console.log('Server response:',response.data); // If needed, you can display a success message to the user
      setIsAlertOpen(true);
       // Show the success alert
    })
    .catch((error) => {
      console.log("error occured")
      console.error(error); // Handle any error that occurred during the request
    });
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };
  const handleSubmit = () => {
    // Handle form submission here
    handleCloseAlert();
  };

  const handleCloseStatusUpdatedAlert = () => {
    setIsStatusUpdatedAlertOpen(false);
  };

  return (
    <div>
      <div className="newUser2" style={{ display: 'flex', justifyContent: 'flex-end',marginTop:"2%"}} >
        <button className='addUserBtn2' onClick={handleOpenModal} >Add User</button>
       </div>

       {isModalOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Add a new User</h2>
            <div style={{textAlign:'center'}} >
          
              <input className="modal-box2" type="text" id="UserIDInput" placeholder="UserID" style={{width:'80%'}} /><br/>
              <input className="modal-box2" type="text" placeholder="UserName"  id="UserNameInput" style={{width:'80%'}}/><br/>
              <input className="modal-box2" type="text" placeholder="Role" id="RoleInput" style={{width:'80%'}}/><br/>
              <input className="modal-box2" type="email" placeholder="email" id="EmailInput" style={{width:'80%'}} /><br/>
              <input className="modal-box2" type="password" placeholder="Password" id="PasswordInput" style={{width:'80%'}} /><br/>
              <div className="create-cancel2" style={{marginTop:'7%'}}>
              <button onClick={handleisAlert}>Create</button>
              <button onClick={handleCancel} style={{marginLeft:'8%'}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isAlert && (
           <div className="custom-modal2">
           <div className="modal-content2">
           <h3>New User added</h3>
           <button onClick={handleSubmit}>OK</button> 
            </div>
            </div>
      )}

      {isChangeStatusModalOpen && (
        // Change status modal
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Change User Status</h2>
            <div style={{ textAlign: 'center' }}>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DISABLED">Disabled</option>
              </select>
              <div className="create-cancel2" style={{ marginTop: '7%' }}>
                <button onClick={handleStatusSave}>Save</button>
                <button onClick={handleCloseChangeStatusModal} style={{ marginLeft: '8%' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isStatusUpdatedAlertOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h3>{statusUpdatedMessage}</h3>
            <button onClick={handleCloseStatusUpdatedAlert}>OK</button>
          </div>
        </div>
      )}

      <table className="user-table2">
        <thead>
          <tr>
            <th>UserID</th>
            <th>UserName</th>
            <th>Role</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
     
        <tbody>
          {data.map((item) => (
            <tr key={item.UserID}>
              <td>{item.UserID}</td>
              <td>{item.UserName}</td>
              <td>{item.UserType}</td>
              <td>{item.Status}</td>
              <td>
                    
                <button className='table-delete-btn2' onClick={() => handleOpenChangeStatusModal(item.UserID)}>Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable
