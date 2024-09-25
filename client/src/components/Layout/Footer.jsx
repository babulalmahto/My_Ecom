import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ backgroundColor: '#c6c996', color: 'white', padding: '25px 0',fontSize:"17px" }}>
    <div style={{ textAlign: 'center' }}>
       <Link to="/about" style={{textDecoration:"none", color:"white"}}><span className='new-navbar2' style={{ marginRight: '10px' }}>About</span> </Link> 
      <span style={{ marginRight: '10px' }}>|</span>
      <Link to="/contact" style={{textDecoration:"none", color:"white"}}><span className='new-navbar2' style={{ marginRight: '10px' }}>Contact</span> </Link> 
      <span style={{ marginRight: '10px' }}>|</span>
      <Link to="/policy" style={{textDecoration:"none", color:"white"}}><span className='new-navbar2' style={{ marginRight: '10px' }}>Policy</span> </Link> 
  
    </div>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span>All rights reserved to Vishal ©  {new Date().getFullYear()}</span>
      </div>
  </footer>
  )
}

export default Footer