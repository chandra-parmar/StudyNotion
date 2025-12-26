import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm


// import { useState } from "react"
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
// import { useDispatch } from "react-redux"
// import { Link, useNavigate } from "react-router-dom"

// import { login } from "../../../services/operations/authAPI"

// function LoginForm() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const [showPassword, setShowPassword] = useState(false)

//   const { email, password } = formData

//   const handleOnChange = (e) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const handleOnSubmit = (e) => {
//     e.preventDefault()
//     dispatch(login(email, password, navigate))
//   }

//   return (
//     <form
//       onSubmit={handleOnSubmit}
//       className="mt-6 mx-auto flex w-full flex-col gap-y-6"  
//     >
//       {/* Email Field */}
//       <label className="w-full">
//         <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
//           Email Address <sup className="text-pink-200">*</sup>
//         </p>
//         <input
//           required
//           type="email"  
//           name="email"
//           value={email}
//           onChange={handleOnChange}
//           placeholder="Enter email address"
//           className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5
//                      focus:outline-none focus:ring-2 focus:ring-yellow-50
//                      shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
//         />
//       </label>

//       {/* Password Field */}
//       <label className="w-full relative">
//         <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
//           Password <sup className="text-pink-200">*</sup>
//         </p>
//         <input
//           required
//           type={showPassword ? "text" : "password"}
//           name="password"
//           value={password}
//           onChange={handleOnChange}
//           placeholder="Enter Password"
//           className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5
//                      focus:outline-none focus:ring-2 focus:ring-yellow-50
//                      shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
//         />

//         {/* Eye Icon */}
//         <span
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-[38px] z-10 cursor-pointer"
//         >
//           {showPassword ? (
//             <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//           ) : (
//             <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//           )}
//         </span>

//         {/* Forgot Password Link */}
//         <Link to="/forgot-password">
//           <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
//             Forgot Password
//           </p>
//         </Link>
//       </label>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         className="mt-6 w-full  rounded-[8px] bg-yellow-50 py-[12px] px-[24px] font-medium text-richblack-900
//                    hover:bg-yellow-100 transition-all duration-200"
//       >
//         Sign In
//       </button>
//     </form>
//   )
// }

// export default LoginForm