import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdArrowDropDownCircle } from "react-icons/md";
import SubSectionModal from './SubSectionModal';
import ConfirmationModal from '../../../../common/ConfirmationModel'
import {setCourse} from '../../../../../slices/courseSlice'
import { MdEdit } from 'react-icons/md';
import { deleteSection } from '../../../../../services/operations/courseDetailsAPI';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";


const NestedView =({handleChangeEditSectionName})=>{

    const {course} = useSelector((state)=> state.course)
    const {token} = useSelector((state)=> state.auth)
    const dispatch= useDispatch()

    const [addSubSection,setAddSubSection] = useState(null)
     const [viewSubSection,setViewSubSection] = useState(null)
      const [editSubSection,setEditSubSection] = useState(null)

    const [confirmationModal,setConfirmationModal] = useState(null)
   
    //delete section function
    const handleDeleteSection= async(sectionId) =>{
        const result = await deleteSection({
            sectionId,
            courseId:course._id,
            token
        })
      if(result)
      {
        dispatch(setCourse(result))
      }
      setConfirmationModal(null)

    }

    //delete subsection
    const handleDeleteSubSection= async(subSectionId,sectionId)=>{
        const result = await handleDeleteSubSection({subSectionId,sectionId,token})
       if(result)
       {
        const updatedCourseContent = course.courseContent.map((section)=> section._id === sectionId ? result : section)
        const updatedCourse={...course,courseContent:updatedCourseContent}
        dispatch(setCourse(updatedCourse))
       }
       setConfirmationModal(null)

    }

    return(
        <div>
           <div className='rounded-lg bg-richblack-500 mt-10'>
              {Array.isArray(course?.courseContent) && course.courseContent.map((section)=>(
                <details key={section._id} open>

                    <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                       <div className='flex items-center gap-x-3'>
                         <RxDropdownMenu />
                         <p>{section.sectionName}</p>
                       </div>
                     
                     {/* edit icon button */}
                       <div className='flex items-center gap-x-3'>
                        <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                          <FaEdit />
                        </button>

                            <button onClick={()=>{
                                setConfirmationModal({
                                    text1:"Delete this section",
                                    text2:"All the lecture in this section will be deleted",
                                    btn1Text:"Delete",
                                    btn2Text:"Cancel",
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

                    {/** sub sectionn */}
                    <div>
                        {  
                            Array.isArray(section.subSection) && (section.subSection || []).map((data) => (
                                <div
                                  key={data?._id}
                                  onClick={()=> setViewSubSection(data)}
                                  className='flex items-center justify-between gap-x-3 border-b-2'>

                                  <div className='flex items-center justify-between gap-x-3'>
                                    <RxDropdownMenu></RxDropdownMenu>
                                    <p>{data.title}</p> 
                                  </div>

                                  {/** edit and delete icon  */}
                                  <div className='flex items-center gap-x-3'>
                                        <button
                                        onClick={()=> setEditSubSection({...data,sectionId:section._id})}>
                                            <MdEdit></MdEdit>
                                        </button>

                                        <button
                                        onClick={()=> setConfirmationModal(
                                            {
                                                text1:"Delete this sub section",
                                                text2:"selected lecture will be deleted",
                                                btn1Text:"delete",
                                                btn2Text:"Cancel",
                                                btn1Handler:()=> handleDeleteSubSection(data._id,section._id),
                                                btn2Handler:()=> setConfirmationModal(null,)
                                            }
                                        )}>

                                        <RiDeleteBin6Line></RiDeleteBin6Line>

                                        </button>
                                  </div>

                                </div>
                            ))
                        }

                        {/** add lecture button */}
                        <button
                          onClick={()=> setAddSubSection(section._id)}
                          className='mt-4 flex items-center gap-x-2 text-yellow-50'>
                               <FaPlus />
                               <p>Add lecture</p>
                        </button>

                    </div>
                </details>

              ))}
           </div>

           {/** add subsection modal */}

           {
            addSubSection ? (<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} ></SubSectionModal>)
            :viewSubSection ? (<SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} ></SubSectionModal>)
            : editSubSection ? (<SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} ></SubSectionModal>)
            : (<div></div>)
            }

        {  confirmationModal ?
            (
                 (<ConfirmationModal modalData ={confirmationModal}></ConfirmationModal>)
            )  
            : (<div></div>)

            }

        </div>
    )
}
export default NestedView