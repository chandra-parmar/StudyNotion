import { useSelector } from "react-redux"
import React from 'react'
import { Outlet } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard =()=>{

    const {loading:authLoading} = useSelector((state)=> state.auth)
    const {loading:profileLoading} = useSelector((state)=> state.auth)

    if(profileLoading || authLoading)
    {
        return (
            <div className="mt-12">
                loading....
            </div>
        )
    }

    return(
        <div className="realative flex min-h-[calc(100vh-3.5rem)]">
          
          <Sidebar></Sidebar>
          <div className="h-full flex-1 overflow-y-auto">
            <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                <Outlet></Outlet>
            </div>

          </div>
        </div>
    )
}

export default Dashboard 