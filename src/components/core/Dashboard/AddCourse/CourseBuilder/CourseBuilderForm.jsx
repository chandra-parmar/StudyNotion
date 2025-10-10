import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { MdNavigateNext } from "react-icons/md";
import { createSection,updateSection,deleteSection } from '../../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import NestedView from './NestedView';
import { setCourse } from '../../../../../slices/courseSlice';
import { setStep } from '../../../../../slices/courseSlice';
import { setEditCourse } from '../../../../../slices/courseSlice';
import { data } from 'react-router-dom';

const CourseBuilderForm =()=>{

    const {register, handleSubmit, setValue, formState:{errors}} = useForm()
    
    //flag for edit section button and create section btn
    const [editSectionName,setEditSectionName] = useState(null)
    const {course} = useSelector((state)=> state.course)
    const dispatch= useDispatch()
    const [loading,setLoading] = useState(false)
   const {token} = useSelector((state)=> state.auth)

    //form on submit function
    const onSubmit=async(data)=>{
       setLoading(true)
       let result
       //either edit or create
       if(editSectionName)
       {
         // update section api call
         result = await updateSection(
            {
                sectionName:data.sectionName,
                sectionId: editSectionName,
                courseId:course._id
            },token
         )

       }
       //create section button
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
         setValue('sectionName',"")
       }
       //loading false
       setLoading(false)

    }

    const cancelEdit =()=>{
        setEditSectionName(null)
        setValue("sectionName","")
    }

    {/** go back  function */}
    const goBack =()=>{
      dispatch(setStep(1))
      dispatch(setEditCourse(true))
    }
    
    {/** go to next */}
    const goToNext=()=>{
        // only go to next step when atleast 1 section is created
        if(course.courseContent.length ===0)
        {
            toast.error("Please add atleast one Section")
            return
        }
        if(course.courseContent.some((section)=> section.subSection.length ===0))
        {
            toast.error("please add alteast one lecture in each section")
            return
        }

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


    return(
        <div className='text-white'>
            <h2>Course Builder</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                
                {/** label */}
                <div>
                    <label htmlFor='sectionName'>Section name<sup>*</sup></label>
                    <input
                     id='sectionName'
                     placeholder='add a section name'
                     {...register('sectionName',{required:true})}
                      className='w-full'></input>
                     {
                        errors.sectionName && (
                            <span>Section name is required</span>
                        )
                     }
                </div>

                {/*create section button*/}
                <div className='mt-[10px] flex w-full'>
                    <IconBtn
                     type="Submit"
                     text={editSectionName ? "Edit Section Name " :"create section" }
                     outline={true}
                     customClasses={"text-white"}
                     >
                     <CiCirclePlus className='text-white size={20}' />

                    </IconBtn>
                    {/** cancel edit button */}
                    {editSectionName && (
                        <button
                         type='button'
                         onClick={cancelEdit}
                         className='text-sm  text-white underline ml-[10px]'>

                            cancel edit
                        </button>
                    )}
                </div>
            </form>

              {/** nested view component */}
              {course.courseContent.length > 0 && (
                <NestedView handleChangeEditSectionName={handleChangeEditSectionName}></NestedView>
              )}

              {/** back and next button */}
              <div className='flex justify-end gap-x-3'>
                <button
                 onClick={goBack}
                 className='rounded-md cursor-pointer flex items-center'>
                    Back
                </button>

                <IconBtn text="Next" onClick={goToNext}
                >
                <MdNavigateNext />

                </IconBtn>
              </div>
                
        </div>
    )
}

export default CourseBuilderForm