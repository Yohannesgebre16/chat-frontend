import './App.css'
import { BrowserRouter as Router , Routes ,Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import PrivateRoute from './Components/PrivateRoute'
import Chats from './pages/Chats'



function App() {


  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/chats' element={
          <PrivateRoute>
            <Chats/>

            </PrivateRoute>
        }/>


      </Routes>


    </Router>
    
 

 
 
  )
}

export default App
