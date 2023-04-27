import './styles/ProductBox.css'
import './styles/main.css'
import Home from './Screens/Home'
import {auth} from './utils/firebase'
import { SignIn } from './Screens/SignIn';
import { useState } from 'react';
import { SignOut } from './Screens/SignOut';


function App() {
  const[user, setUser] = useState(null)
  const[loading, setLoading] = useState(true)

  auth.onAuthStateChanged( user => {
    setUser(user)
    setLoading(false)
  })

  //TODO Make Loading Better
  if(loading) return('loading')
  
  return (
    <div className="App">
      <header className="App-header">
        <div className='title'>
          <a href='/'>
            First Star
          </a>
        </div>
        <div id="userHeader">
          <span id="user">{user?user.displayName:''}</span>
          {user ? <SignOut /> : <SignIn />}
        </div>
      </header>
      <div id="content">
        {user ?
          <Home />
          :''}
      </div>
        <footer>
          <div id="poem">
            Star light, star bright,<br/>
            First star I see tonight,<br/>
            I wish I may, I wish I might,<br/>
            Have this wish I wish tonight.<br/>
            <span id="author">- Anonymous</span>
          </div>
      </footer>
    </div>
  );
}

export default App;
