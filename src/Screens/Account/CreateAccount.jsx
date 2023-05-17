import { useState } from 'react'
import {  createUser } from '../../utils/appwrite'

const CreateAccount = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [name,setName]=useState('')

    const handleCreateUser = async (event) => {
        event.preventDefault();
        createUser(email, password, name)
        .then( response => console.log(response))
        .catch( error => console.log(error))

    }

    return(
        <div>
            <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Display Name" />
            <br/>
            <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" />
            <br/>
            <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" />
            <br/>
            <button onClick={handleCreateUser}>Create Account</button>
        </div>
    )
}

export default CreateAccount