import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  
  const [loading, setLoading] = useState(false)

  if(loading)return(<div id="wrapper"><h5>Loading...</h5></div>)
  return(
    <div id="wrapper">
      <Link to={'/lists'} >View WishLists</Link>
    </div>
  )
}

export default Home