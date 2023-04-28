import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return(
    <div id="wrapper">
      <Link to={'/lists'} >View WishLists</Link>
    </div>
  )
}

export default Home