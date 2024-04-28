import React from 'react';
import { Link } from 'react-router-dom';

const Home:React.FC = () => {
  return (
    <div>
      <Link to="/chat">
        <button className='buttonStyle'>CHAT</button>
      </Link>
      <Link to="/dashboard">
        <button className='buttonStyle'>DASHBOARD</button>
      </Link>
      <Link to="/stats">
        <button className='buttonStyle'>USER STATS</button>
      </Link>
    </div>
  );
};

export default Home;
