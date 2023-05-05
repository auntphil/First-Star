import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/signin.css'
import { getCurrentUser, loginUser } from "../../utils/appwrite";
import { LoadingThreeCircles } from "../Loading";


export function SignIn(props){
    const { setUser } = props
    const navigate = useNavigate()

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')

    const handleSubmit = () => {
        setLoading(true)
        setError('')
        loginUser(email,password)
        .then( response => {
            getCurrentUser()
            .then( user => {
                setUser(user)
                navigate('/')
            })
            .catch( error => console.log(error))
        })
        .catch( error => {
            setError(error.message)
            setLoading(false)
        })
    }

    return (
        <div id="SignInWrapper">
            <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" />
            <br/>
            <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" />
            <br/>
            {loading ?
                <LoadingThreeCircles s={17} p={0} />
            :
                <button onClick={handleSubmit}>Login</button>
            }
            <br/>
            {error ?
                <div>{error}</div>
            :
                <div></div>
            }
        </div>
    )
}
