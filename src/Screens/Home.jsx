import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = ( props ) => {
  const { user } = props

  if (user) {
    //User Logged In
    return(
      <div id="wrapper">
        <Link to={'/lists'} >View WishLists</Link>
      </div>
    )
  }else{
    //Not Logged In
    return(
      <div id="wrapper">
        Not Logged in
      </div>
    )
  }
}

export default Home