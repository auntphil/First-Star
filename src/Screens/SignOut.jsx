import React from "react";
import { auth, provider } from '../utils/firebase'
import { signInWithPopup } from "firebase/auth";
import '../styles/signin.css'


export function SignOut(){

    const handleClick = () => {
        auth.signOut()
      .then( () => {})
      .catch( error => {
        console.log(error)
      })
    }

    return (
        <div id="SignInWrapper">
            <button id="SignOutButton" onClick={handleClick}>Sign Out</button>
        </div>
    )
}
