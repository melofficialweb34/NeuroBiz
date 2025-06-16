import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../services/firebase'

const PrivateRoute = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthenticated(!!user)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    if (loading) return <div>Loading...</div>
  return (
    authenticated ? children : <Navigate to="/login" />
  )
}

export default PrivateRoute