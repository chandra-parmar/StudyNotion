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
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import Cart from './components/core/Dashboard/Cart'
import Settings from './components/core/Dashboard/Settings/index'
import { ACCOUNT_TYPE } from './utils/constants'
import { useSelector } from 'react-redux'
import AddCourse from './components/core/Dashboard/AddCourse'
import MyCourses from './components/core/Dashboard/MyCourses'
import EditCourse from './components/core/Dashboard/EditCourse'


function App()
{
   const { user} = useSelector((state)=> state.profile)
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
            path='dashboard'
              element={
                <PrivateRoute>
                 <Dashboard></Dashboard>
               </PrivateRoute>
           
          }>
          <Route path ='my-profile' element={<MyProfile></MyProfile>}></Route>
          <Route path='settings' element={<Settings></Settings>}></Route>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                 <Route path='enrolled-courses' element={<EnrolledCourses></EnrolledCourses>}></Route>
                 <Route path='cart' element={<Cart></Cart>}></Route>
              </>
            )
          }
            {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                 <Route path='add-course' element={<AddCourse></AddCourse>}></Route>
                 <Route path='my-courses' element={<MyCourses></MyCourses>}></Route>
                 <Route path='edit-course/:courseId' element={<EditCourse/>}></Route>
              </>
            )
          }
         
          </Route>

          

          <Route path='*' element={<Error></Error>}></Route>

      </Routes>

    </div>
  )
}

export default App