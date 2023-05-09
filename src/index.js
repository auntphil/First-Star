import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Screens/Home';
import CreateAccount from './Screens/Account/CreateAccount';
import { getCurrentUser } from './utils/appwrite';
import { SignIn } from './Screens/Account/SignIn';

import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Wishes from './Screens/Wishes';

export default function App(){
  const[user, setUser] = useState(null)

  useEffect( () => {
    const getAccount = async () => {
      getCurrentUser()
      .then( response => setUser(response))
      .catch( error => {
        console.log(error)
        setUser(null)
      })
    }
    getAccount()
  },[])

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Home user={user}/>}  />
          <Route path="signin" element={<SignIn setUser={setUser} />} />
          <Route path="register" element={<CreateAccount user={user} />} />
          <Route path="wishes" element={<Wishes user={user} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
