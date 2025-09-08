import { IoMdArrowBack } from "react-icons/io";
import React from 'react'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword()
{
    //flag for email or forgot password show
    const [emailSent,setEmailSent] = useState(false)
    const [email,setEmail] = useState("")

    const {loading } = useSelector((state)=> state.auth)


return(    
        <div>
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

                <form>
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
                <button>
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