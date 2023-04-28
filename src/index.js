import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Screens/Home';
import { auth } from './utils/firebase';
import ViewAll from './Screens/WishLists/ViewAll';
import ViewOne from './Screens/WishLists/ViewOne';

export default function App(){
  const[user, setUser] = useState(null)

  auth.onAuthStateChanged( user => {
    setUser(user)
  })

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Home user={user} />} />
          <Route path="lists" element={<ViewAll user={user} />} />
          <Route path="list" element={<ViewOne user={user} />} />
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
