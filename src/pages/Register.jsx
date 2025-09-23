import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
 
import { useNavigate } from 'react-router-dom'
import { saveauth } from '../Utils/auth'

function Register() {
    const [formData , setFormData] = useState({
        username: "",
        email : "",
        password: ""
    })
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/register`, formData)
            if(res.data.user){
                saveauth(res.data)
                navigate("/chats")
            }

        }catch(err){
            setMessage(err.response?.data?.msg || "Something went wrong")

        }
    }



  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className=' w-full max-w-md mx-auto mt-10 space-y-6 p-8 border border-gray-300 rounded-md shadow-md'>
            <h1 className='text-2xl font-bold text-center text-gray-800'>Register</h1>
            <form onSubmit={handleSubmit} className='space-y-4' action="">
                <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className='w-full px-4 py-2 border  rounded-lg foucs:outline-none focus:ring-1 foucs:ring-indigo-400 '
                
                />
                <input
                type="email" 
                name = "email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className='w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400'
                
                />

                <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='password'
                required
                className='w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400'
                />

                <button
                className='w-full bg-blue-400 font-semibold p-3 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400'
                 type="submit"
                 >Signup</button>

            </form>
            {message && <p>{message}</p>}

            <p>Already have an account ? 
            <Link to='/login' className='text-blue-500 hover:underline'>Login</Link>
            </p>
        </div>
    </div>
  )
}

export default Register