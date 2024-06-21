import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../pages/Loader'

function Protected({ children, authentication = true }) {

    const authStatus = useSelector((state) => state.auth.status)

    const navigate = useNavigate()

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        // if authentication was required and you were not authenticated >>> login
        if (authentication && authStatus !== authentication) {
            navigate('/login')
        }
        // if authentication was not required and yet you weren't authenticated >>> home
        else if (!authentication && authStatus !== authentication) {
            navigate('/')
        }
        setLoader(false)
    }, [authStatus, authentication, navigate])

    return loader ? <Loader /> : <>{children}</>
}

export default Protected