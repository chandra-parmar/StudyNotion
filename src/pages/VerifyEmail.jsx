import React from 'react'
import { useNavigate} from 'react-router-dom'
import OTPInput from 'react-otp-input'
import { useDispatch } from 'react-redux'
import { signUp } from '../services/operations/authAPI'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import {sendOtp} from '../services/operations/authAPI'


const VerifyEmail =()=>{
     
    const [otp,sendOtp] = useState("")
    const dispatch = useDispatch()
    const {signupData,loading} = useSelector ((state)=> state.auth)
    const navigate = useNavigate()

    {/** if data not present in signup then return to signup*/}
    useEffect(()=>{
        if(!signupData)
        {
            navigate('/signup')
        }
    },[])

    const handleOnSubmit =(e)=>{
        e.preventDefault()
       
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,

        } = signupData

        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate))

    }

    return(
        <div className='text-white flex items-center justify-center mt-[150px] '>
           {
            loading ? (<div>Loading...</div>) :
            (
                <div>
                    <h1>Verify Email</h1>
                    <p>A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit}>
                     
                     <OTPInput
  value={otp}
  onChange={sendOtp}
  numInputs={6}
  renderSeparator={<span className="mx-2">-</span>}  // for spacing/dashes between boxes
  renderInput={(props) => (
    <input
      {...props}
      className="w-12 h-12 border border-gray-400 rounded text-center text-white bg-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  )}
/>


                        <button type='submit'>Verify Email</button>

                    </form>

                    <div>
                        <div>
                            <Link to='/login'><p>Back to login</p></Link>
                        </div>
                    </div>
                    

                    <button onClick={()=> dispatch(sendOtp(signupData.email,navigate))}>
                        Resend it 
                    </button>
                </div>
            )
           }

        </div>
    )
}

export default VerifyEmail