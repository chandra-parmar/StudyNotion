import './App.css'
import {Route,Routes}  from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/common/Navbar'
import OpenRoute from './components/core/Auth/OpenRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import Contact from "./pages/Contact"

function App()
{
  return(
    <div className='w-screen min-h-screen bg-richblack-900  flex flex-col font-inter'>

    <Navbar/>
      <Routes>
         <Route path='/' element={<Home/>}></Route>
         <Route
            path='signup'
            element={
              <OpenRoute>
                <Signup></Signup>
              </OpenRoute>
            }
         ></Route>

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

         <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />


        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

          <Route path="/contact" element={<Contact />} />

      </Routes>

    </div>
  )
}

export default App