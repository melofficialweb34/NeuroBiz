import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Sigup successful")
            navigate("/login")
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
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    </div>
  )
}

export default Signup