import React from 'react';
import { Link } from 'react-router-dom';

const Home:React.FC = () => {
  return (
    <div>
      <Link to="/chat">
        <button style={buttonStyle}>CHAT</button>
      </Link>
      <Link to="/dashboard">
        <button style={buttonStyle}>DASHBOARD</button>
      </Link>
      <Link to="/stats">
        <button style={buttonStyle}>USER STATS</button>
      </Link>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#333', // Dark grey color
  color: '#fff',  
  width:"10%",         // White text color
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin:'15px'
};

export default Home;
