import React from 'react'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { Link, matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { categories } from '../../services/api'
import {useState} from 'react'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { apiConnector } from '../../services/apiconnector'
import { useEffect } from 'react'

const defaultSubLinks = [
    {
        title:"python",
        link:"catalog/python"
    },
    {
        title:"java",
        link:"catalog/java"
    }
]
const NavbarLinks =[
    {
        title:"Home",
        path:"/",
    },
    {
        title:"Catalog",
        path:"/catalog"
    },
    {
        title:"Contact us",
        path:"/contact"
    }
]


export default function Navbar()
{

     const {token} = useSelector((state)=> state.auth)
     const {user } = useSelector((state)=> state.profile)
     const {totalItems } = useSelector((state)=> state.cart)
     const location = useLocation()

     // api calls
     const [subLinks , setSubLinks] = useState(defaultSubLinks)

    //  const fetchSubLinks = async()=>{
    //         try{
    //             // to get categories list 
    //             const result = await apiConnector("GET", categories.CATEGORIES_API)
    //             console.log("api response ",result)
    //             if(result?.data.data)
    //             {
    //                 setSubLinks(result.data.data)
    //             }
    //             else{
    //                 console.log('could not fetch the category list')
    //                 setSubLinks([])
    //             }
                
                 
    //         }catch(error)
    //         {
    //             console.log("could not fetch the category list")
    //         }
    //       }

    //   useEffect(()=>{
    //      fetchSubLinks()
          
    //   },[])   

    let matchRoute =(route)=>{
        return matchPath({path:route},location.pathname)
    }
    return(
        <div className='flex  h-14 items-center border-b-[2px] border-b-richblack-700'>
          <div className='flex w-11/12 max-w-maxContent items-center justify-between ml-[30px]'>

              {/** image  logo*/}
              <Link to='/'>
                 <img src={logo} width={160} height={42} loading='lazy'></img>
              </Link>

              {/** navlinks */}
              <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link,index)=>(
                            <li key={index}>
                                {
                                    link.title ==='Catalog' ?(
                                        <div className='relative flex items-center gap-2 group'> 
                                          <p>{link.title}</p>
                                         <IoIosArrowDropdownCircle></IoIosArrowDropdownCircle>

                                         <div className='invisible absolute left-[50%] translate-x-[-60%] translate-y-[80%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] '>
                                             
                                             <div className='absolute left-[50%] top-0  translate-x-[80%] translate-y-[-50%] h-6 w-6 rotate-45 rounded bg-richblack-5'>

                                             </div>
                                             {
                                                subLinks.length >0 ?(
                                                    subLinks.map((subLink,index)=>(
                                                        <Link key={index} to ={`${subLink.link}`}>
                                                          <p>{subLink.title}</p>

                                                        </Link>
                                                    ))
                                                        
                                                    
                                                ) :(<div> No categories</div>)
                                             }

                                         </div>

                                       </div>):(
                                        <Link to= {link?.path}>
                                             <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-white-25"}`}>
                                                {link.title}
                                         
                                             </p> 
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
              </nav>

              {/* login /signup/dashboard */}
              <div className='flex gap-x-4 items-center'>

                 {
                    user && user?.accountType !=='Instructor' &&(
                        <Link to='/dashboard/cart' className='realtive'>
                             <AiOutlineShoppingCart></AiOutlineShoppingCart>
                             {
                                totalItems >0 && 
                                <span>
                                    {totalItems}
                                </span>
                             }

                        </Link>
                    )
                 }
                 {/* if user is not login then show login signup button*/}
                  {
                    token === null && (
                        <Link to='/login'>
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>Log in </button>
                        </Link>
                    )
                  }
                  {
                    token === null && (
                        <Link to='/signup'>
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>Sign up</button>
                        </Link>
                    )
                  }

                  {/** user logged in then showing profile  */}
                  {
                    token !== null  && <ProfileDropDown></ProfileDropDown>
                  }
                  
              </div>

          </div>

        </div>
    )
}