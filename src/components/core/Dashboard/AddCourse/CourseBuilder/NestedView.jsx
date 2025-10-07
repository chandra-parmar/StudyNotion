import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdArrowDropDownCircle } from "react-icons/md";

const NestedView =({handleChangeEditSectionName})=>{

    const {course} = useSelector((state)=> state.course)
    const {token} = useSelector((state)=> state.auth)
    const dispatch= useDispatch()

    const [addSubSection,setAddSubSection] = useState(null)
     const [viewSubSection,setViewSubSection] = useState(null)
      const [editSubSection,setEditSubSection] = useState(null)

    const [confirmationModal,setConfirmationModal] = useState(null)
   
    //delete section function
    const handleDeleteSection=(sectionId) =>{

    }

    return(
        <div>
           <div className='rounded-lg bg-richblack-500 mt-10'>
              {course?.courseContent?.map((section)=>(
                <details key={section._id} open>
                    <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                       <div className='flex items-center gap-x-3'>
                         <RxDropdownMenu />
                         <p>{section.sectionName}</p>
                       </div>
                     
                     {/* edit icon button */}
                       <div className='flex items-center gap-x-3'>
                        <button onClick={handleChangeEditSectionName(section._id,section.sectionName)}>
                            <FaEdit />
                        </button>

                            <button onClick={()=>{
                                setConfirmationModal({
                                    text1:"Delete this section",
                                    text2:"All the lecture in this section will be deleted",
                                    btn1Text:"Delete",
                                    btn2Text:"Cance",
                                    btn1Handler:()=> handleDeleteSection(section._id),
                                    btn2Handler:()=> setConfirmationModal(null)
                                })
                            }}>
                                <MdDeleteOutline />
                            </button>

                            <span>|</span>
                            <MdArrowDropDownCircle className={`text-xl text-richblack-300`}/>

                       </div>
                    </summary>
                </details>
              ))}
           </div>
        </div>
    )
}
export default NestedView