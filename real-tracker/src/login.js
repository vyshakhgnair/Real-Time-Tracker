import React ,{useState,useEffect} from 'react';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';
import './login.css';
import user from './user.png';
import { useNavigate } from 'react-router-dom';

function Login(){
  const [isLoading, setIsLoading] = useState(true);
  const [sgid, setSGID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sgid, password }),
    });

    const response2 = await fetch('http://localhost:5000/api/getPercentage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sgid, password }),
    });

    const data = await response.json();
    if (data.success) {
      if (data.role === 'Viewer') {
        // Redirect to the ClientViewer component
        navigate(`/clientViewer/${sgid}`);
      } else if(data.role === 'Other'){
        // Redirect to the Users component
        navigate('/users');
      }
    } else {
      // Handle login failure
    setSGID('');
    setPassword('');
    alert(data.message);
    }
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoading(false);
    };
    image.src = user;
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

    return(
    <>
   
    <div className="container">
    <div className='loginBox' >
        <h1>LOGIN</h1>
      
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} >
    
    
        <div className="demo"style={{width:'80%',height:'80%',justifyContent:'center',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div className="user-container">
                <img src={user} alt="user" style={{ width: '100px', height: '100px' }} />
                {isLoading && <div className="spinner" />}
              </div>
             
        <div className="Labels">
        <label> SG_ID</label>
        </div>
        <div className="Inputs">
        <input
            type="text"
            placeholder="SGID"
            className="input"
            value={sgid}
            onChange={(e) => setSGID(e.target.value)}
          />
        </div>
       <div className="Labels">
       <label>Password</label>
       </div>
       <div className="Inputs">
       <input
            type="password" // Change to password type
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress} // Assign handleKeyPress to onKeyPress event
          />
       </div>
       <div className="Buttons">
       <button className='myButton' >SSO</button><br/>
       </div>
       <div className="Buttons" style={{marginTop:'20px'}}>
       <button className='myButton' onClick={handleLogin}>LOGIN</button>
       </div>   
        </div>
       
        
        
    </div>
    <div className="logo"  >
    <img src={logo} alt="Logo" style={{width:'150px',height:'100px',marginLeft:'3%',marginBottom:'-15%'}}/>
    </div> 
    </div>
    </div>
   
</>
            
       
    );
}

export default Login;