import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../services/firebase';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Sigup successful")
        } catch(err){
            console.log(err.message)
        }
    }

  return (
    <div>
        <form onSubmit={handleSignup}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}

export default Signup