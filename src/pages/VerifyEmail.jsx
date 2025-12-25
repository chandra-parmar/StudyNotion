import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { signUp, sendOtp } from "../services/operations/authAPI";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(""); // Fixed: sendOtp → setOtp
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);

  // Redirect to signup if no signupData (user came directly)
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-richblack-900">
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold text-richblack-5">
            Verify Email
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            A verification code has been sent to your email. Enter the code below.
          </p>

          <form onSubmit={handleOnSubmit}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
                  className="w-[60px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:outline-none focus:ring-1 focus:ring-yellow-50"
                />
              )}
              containerStyle="justify-center gap-x-4 lg:gap-x-6 my-8"
              renderSeparator={<span></span>}
            />

            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <Link to="/login">
              <p className="text-richblack-5 flex items-center gap-x-2 hover:text-richblack-25 transition-all">
                ← Back to Login
              </p>
            </Link>

            <button
              onClick={() => dispatch(sendOtp(signupData?.email, navigate))}
              className="text-blue-100 text-sm lg:text-base hover:text-blue-200 transition-all"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;