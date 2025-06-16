import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../services/firebase'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login Successful")
        }catch(err){
            console.log(err.message)
        }
    }

  return (
    <div>
        <form onSubmit={handleLogin}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
            <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login