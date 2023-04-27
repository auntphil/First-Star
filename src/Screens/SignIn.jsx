import React from "react";
import { auth, provider } from '../utils/firebase'
import { signInWithPopup } from "firebase/auth";
import '../styles/signin.css'


export function SignIn(){

    const handleClick = () => {
        signInWithPopup(auth, provider).then( data => {})
    }

    return (
        <div id="SignInWrapper">
            <button id="SignInButton" onClick={handleClick}>Sign In</button>
        </div>
    )
}
