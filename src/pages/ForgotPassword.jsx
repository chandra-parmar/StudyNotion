import { IoMdArrowBack } from "react-icons/io";
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getPasswordResetToken } from "../services/operations/authAPI";


function ForgotPassword()
{
    //flag for email or forgot password show
    const [emailSent,setEmailSent] = useState(false)
    const [email,setEmail] = useState("")

    const {loading } = useSelector((state)=> state.auth)
    const dispatch = useDispatch()

    const handleOnSubmit=(e)=>{
        e.preventDefault()
        dispatch(getPasswordResetToken(email,setEmailSent))

    }


return(    
        <div className="text-white flex justify-center items-center">
        {
           loading ? (    <div>Loading...</div>  )   :
           
           (
            <div>

                <h1>
                          {/** if email not sent  */}
                    {
                        !emailSent ? "Reset your Password" :"Check your Email"
                    }
                </h1>

                <p>
                    {
                        !emailSent ? "We'll email you instructions to reset password."
                        : `We have sent the reset email to ${email}`
                    } 
                </p>

                <form onSubmit={handleOnSubmit}>
                {
                      !emailSent && (
                        <label>
                            <p>Email Address</p>
                            <input
                            required
                            type='email'
                            name='email'
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            ></input>
                        </label>

                      )
                }
                <button type="submit">
                    {
                        !emailSent ? "Reset Password" :"Resend Email"
                    }
                </button>

                </form>

                {/**  back to login button  */}
                <div>
                    <Link to ='/login'>

                       <p>Back to Login </p>
                    </Link>
                </div>

            
             </div>

           )
        }
       </div>

    
    )
}


export default ForgotPassword