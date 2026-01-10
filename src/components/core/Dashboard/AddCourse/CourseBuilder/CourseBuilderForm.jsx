import React from 'react'
import {useForm} from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import {BiAddToQueue} from 'react-icons/bi'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NestedView from './NestedView'
import { updateSection,createSection } from '../../../../../services/operations/courseDetailsAPI'
import { data } from 'react-router-dom'
import { setStep } from '../../../../../slices/courseSlice'
import { setCourse } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'
import { setEditCourse } from '../../../../../slices/courseSlice'
import { MdNavigateNext } from "react-icons/md"
const CourseBuilderForm =()=>{

    const {register,handleSubmit,setValue,formState:{errors}} = useForm()
    const [editSectionName,setEditSectionName] = useState(null)
    const {course} = useSelector((state)=> state.course)
    const dispatch= useDispatch()
    const [loading,setLoading] = useState(false)
    const {token} = useSelector((state)=> state.auth)

    //form submit
    const onSubmit = async (data)=>{
     setLoading(true)
     let result

     if(editSectionName)
     {
        //editing the section name
        result = await updateSection(
            {
                sectionName:data.sectionName,
                sectionId:editSectionName,
                courseId:course._id,

            },token
        )
     }
     else{
        result = await createSection({
            sectionName: data.sectionName,
            courseId:course._id,

        },token)
     }

     //update values
     if(result)
     {
        dispatch(setCourse(result))
        setEditSectionName(null)
        setValue("sectionName","")

     }
     //loading false
     setLoading(false)

    }

    {/* cancel edit function */}
    const cancelEdit= ()=>{
        setEditSectionName(null)
        setValue("sectionName","")
    }
    {/** go back function */}
    const goBack =()=>{
        dispatch(setStep(1))
        dispatch(setEditCourse(true))
    }

    {/** go to next  */}
    const goToNext=()=>{
        //atleast one section is created
        if(course.courseContent.length===0)
        {
            toast.error("please add atleast one section")
            
            return

        }
        //check for subSection
        // if(course.courseContent.some((section)=> section.subSection.length ===0))
        // {
        //     toast.error("please add atleast one lecture in each section")
        //     return
        // }

        //move to next step
        dispatch(setStep(3))

    }

    const handleChangeEditSectionName = (sectionId,sectionName)=>{
          if(editSectionName === sectionId)
          {
            cancelEdit()
            return
          }
          setEditSectionName(sectionId)
          setValue("sectionName",sectionName)

    }


    return (
        <div className='text-white'>
           <p>Course Builder</p>
           <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='sectionName'>Section name<sup>*</sup></label>
                <input
                 id='sectionName'
                 placeholder='add section name'
                 {...register("sectionName",{required:true})}
                 className='w-full'>

                </input>
                {errors.sectionName &&(
                    <span>Section name is required</span>
                )}
                
            </div>

            {/** create section button */}
            <div className='mt-10 flex '>
             <IconBtn
             type="Submit"
             text={editSectionName? "Edit Section Name":"Create Section"}
             outline={true}
             customClasses={"text-white"}>
              <BiAddToQueue className='text-yellow' size={20}></BiAddToQueue>
             </IconBtn>

             {/** editSection name */}
             {editSectionName && (
                <button
                  type='button'
                  onClick={cancelEdit}
                  className='text-sm text-richblack-300 underline'>
                  Cancel Edit 

                </button>  
                )}        

            </div>
            
           </form>

           {course.courseContent.length >0 && (
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}></NestedView>
           )}

          {/** back and next button */}
           <div className='flex justify-end gap-x-3'>
              <button onClick={goBack}
               className='rounded-md cursor-pointer flex items-center'>
                Back
              </button>
             
             <button onClick={goToNext}>Next</button>
           </div>
        </div>
    )
}

export default CourseBuilderForm