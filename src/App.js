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
import MyProfile from './components/core/Dashboard/MyProfile'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Error from './pages/Error'

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

          <Route
          element={
              <PrivateRoute>
                <Dashboard></Dashboard>
               </PrivateRoute>
           
          }>
          <Route path ='dashboard/my-profile' element={<MyProfile></MyProfile>}></Route>
         {/*} <Route path='dashboard/settings' element={<Settings></Settings>}></Route>*/}
          </Route>

          

          <Route path='*' element={<Error></Error>}></Route>

      </Routes>

    </div>
  )
}

export default App