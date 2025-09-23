import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { saveauth } from '../Utils/auth'

function Login() {
    const [formData , setFormData] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate()

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]: e.target.value })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post((`${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/login`), formData)
            if(res.data.token && res.data){
                saveauth(res.data)
                navigate("/chats")
            }else{
                console.error("Login failed",res.data)
            }
            
           
        }catch(err){
            setMessage(err.response?.data?.msg || "Something went wrong")
        }
    }




  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center '>
        <div className='w-full max-w-md mx-auto mt-10 space-y-6 p-8 border border-gray-300 rounded-md shadow-md'>
            <h1 className='text-2xl font-bold text-center text-gray-800 '>Login</h1>
            <form onSubmit={handleSubmit} className='space-y-4' action="">

                <input 
                name = "email"
                type="email"
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 rounded-lg
                 border focus:outline-none focus:ring focus:border-blue-300'
                />

                <input
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='****'
                required
                className='w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:border-blue-300'
                />


                <button className='w-full rounded-xl p-2 hover:bg-orange-500 bg-orange-400 font-semibold text-black ' type="submit">Login</button>

            </form>
            <p className='text-sm text-center text-gray-600'>Don't have an account? <Link to='/register' className='text-blue-500 hover:underline'>Register</Link></p>
        </div>
    </div>
  )
}

export default Login