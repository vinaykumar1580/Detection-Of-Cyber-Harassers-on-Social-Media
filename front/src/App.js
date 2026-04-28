import React, { useState, useEffect } from 'react';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './admin/Sidebar'
import Login from './Login';

const App = () => {
  
  return (
    <Router>
       
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="admin/:id" element={<Sidebar/>}></Route>
       
      </Routes>
    </Router>
  );
};

export default App;
