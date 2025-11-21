import React from 'react'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { resetCourseState } from '../../../../../slices/courseSlice'
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import { COURSE_STATUS } from '../../../../../utils/constants'
import { setStep } from '../../../../../slices/courseSlice'
import IconBtn from '../../../../common/IconBtn'

const PublishCourse=()=>{

    const {register,handleSubmit,setValue,getValues} = useForm()
    const dispatch= useDispatch()
     const {course} = useSelector((state)=> state.course)
     const {token } = useSelector((state)=> state.auth)
     const [loading,setLoading] = useState(false)
   
     const onSubmit =()=>{
        handleCoursePublish()
     }

     const goToCourses=()=>{
        dispatch(resetCourseState())
        // navigate dashboard my course

     }

     const handleCoursePublish= async()=>{
          if(course?.status === COURSE_STATUS.PUBLISHED && getValues('public') === true || (course.status === COURSE_STATUS.DRAFT && getValues('public')=== false))
          {
             // no updation on form 
             // no need to make api call
             goToCourses()
             return

          }
          // if form is updated
          const formData = new FormData()
          formData.append('courseId',course._id)
          const courseStatus= getValues('public') ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
          formData.append('status',courseStatus)

          setLoading(true)
          const result = await editCourseDetails(formData,token)

          if(result)
          {
             goToCourses()
          }
          setLoading(false)

     }

     const goBack =()=>{
          dispatch(setStep(2))
     }

    return(
        <div className='rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700'>
            <p>Publish Course</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='public'></label>
                    <input type='checkbox' id='public' {...register('public')} className='rounded h-4 m-5'></input>
                    <span className='ml-3'>Make this course as public</span>
                </div>

                {/** buttons */}
                <div className='flex justify-end gap-x-3'>
                    <button disabled={loading} onClick={goBack} className='flex items-center rounded-md bg-richblack-300 p-6' >Back</button>
                    <IconBtn disabled={loading} text='save changes'></IconBtn>
                </div>
            </form>
        </div>

    )
}

export default PublishCourse