import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerDashBoard from './customers';
import ColorTiles from './ColorTiles';
import UserDashBoard from './users';
import Login from './login';
import ClientViewer from './clientViewer';
import Tiles from './tile';
import FileUpload from './fileup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<CustomerDashBoard />} />
        <Route path="/" element={<Login />} />
        <Route path="/file" element={<FileUpload />} />
        <Route path="/users" element={<UserDashBoard />} />
        <Route path="/tile/:OAN" element={<Tiles />} />
        <Route path="/ColorTiles" element={<ColorTiles />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/clientViewer/:OAN" element={<ClientViewer />} />
        
      </Routes>
    </Router>
  );
}

export default App;
