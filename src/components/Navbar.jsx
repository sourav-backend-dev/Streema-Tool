import React from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/logo.png';
import img2 from '../assets/Minus.png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="extension-panel-header">
       <div className="extension-header-wrapper">
       <div className="logo-image">
           <img src={img1}/>
           <span className='logo-text'>Streema doctor</span>
       </div>
      <div className='extension-header-icon'>
        <img src={img2}/>
      </div>
    
    </div>
    <nav className='navbar-wrapper'>

      <button className='task-button' onClick={() => navigate('/')} >
        <span className="humburger-icon">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.33333 1H13M4.33333 5H13M4.33333 9H13M1 1H1.00667M1 5H1.00667M1 9H1.00667" stroke="#F3F3F3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

</span>
        Tasks
      </button>
      <button className="history-button" onClick={() => navigate('/history')} >
        <span className="clock-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.99992 4.00001V8.00001L10.6666 9.33334M14.6666 8.00001C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00001C1.33325 4.31811 4.31802 1.33334 7.99992 1.33334C11.6818 1.33334 14.6666 4.31811 14.6666 8.00001Z" stroke="#B9DBEE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
</svg>


        </span>
        History
      </button>
    </nav>
    </div>
  );
};

export default Navbar;
