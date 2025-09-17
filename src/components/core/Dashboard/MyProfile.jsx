import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React from 'react'
import IconBtn from '../../common/IconBtn'


const MyProfile =()=>{

    const {user} = useSelector((state)=> state.profile)
    const navigate = useNavigate()

    return(
        <div className="w-full h-full min-h-screen overflow-x-hidden bg-richblack-900">
          <div className="w-full px-8">
             <h1 className="mb-10 text-3xl font-medium text-richblack-5">My Profile</h1>

    {/* section 1 */}
    <div className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <div className="flex items-center gap-x-4">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[78px] rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold text-richblack-5">
            {user?.firstName + " " + user?.lastName}
          </p>
          <p className="text-sm text-richblack-300">{user?.email}</p>
        </div>
      </div>
      <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")} />
    </div>

    {/* section 2 */}
    <div className="mt-6 flex flex-col gap-y-2 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-richblack-5">About</p>
        <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")} />
      </div>
      <p className="text-sm text-richblack-300">
        {user?.additionalDetails?.about ?? "Write something about yourself"}
      </p>
    </div>

    {/* section 3 */}
    <div className="mt-6 flex flex-col gap-y-2 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-richblack-5">
          Personal Details
        </p>
        <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")} />
      </div>

      <div className="grid grid-cols-2 gap-y-5 mt-4">
        <div>
          <p className="text-sm text-richblack-300">First Name</p>
          <p className="font-medium text-richblack-5">{user?.firstName}</p>
        </div>
        <div>
          <p className="text-sm text-richblack-300">Email</p>
          <p className="font-medium text-richblack-5">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-richblack-300">Gender</p>
          <p className="font-medium text-richblack-5">
            {user?.additionalDetails?.gender ?? "Add Gender"}
          </p>
        </div>
        <div>
          <p className="text-sm text-richblack-300">Last Name</p>
          <p className="font-medium text-richblack-5">{user?.lastName}</p>
        </div>
        <div>
          <p className="text-sm text-richblack-300">Phone Number</p>
          <p className="font-medium text-richblack-5">
            {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
          </p>
        </div>
        <div>
          <p className="text-sm text-richblack-300">Date of Birth</p>
          <p className="font-medium text-richblack-5">
            {user?.additionalDetails?.dateOfBirth}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}

export default MyProfile