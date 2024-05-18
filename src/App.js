// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginForm from './components/login/LoginForm';
import SignupForm from './components/login/SignupForm';
import DashBoard from './components/home/DashBoard';
import PrivateRoute from './components/login/PrivateRoute';

const App = () => {
  return (
    <Router>
      <div className="login-screen">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<PrivateRoute component={DashBoard} />} />
          <Route path="/" element={<LoginForm />} /> {/* Redirect to login by default */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;