import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import IconBtn from '../../common/IconBtn'
import React from 'react'
import ReactStars from 'react-rating-stars-component'
import {createRating }from '../../../services/operations/courseDetailsAPI'

const CourseReviewModal =({setReviewModal}) =>{

    const {user} = useSelector((state)=> state.profile)
    const {token} = useSelector((state)=> state.auth)
   //    get course data from slice
     const {courseEntireData} = useSelector((state)=> state.viewCourse)


    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors},

    }= useForm()

    // storing values at first render
    useEffect(()=>{
        setValue('courseExperience',"")
        setValue('courseRating',0)

    },[])

    
    const onSubmit =async(data) =>{

        // save entry in database of rating review 
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience   
            }
            ,token
        )
        //close modal
        setReviewModal(false)

    }

    const ratingChanged=(newRating)=>{
        setValue('courseRating',newRating)

    }

    return(
        <div className=" fixed inset-0 z-[1000] flex items-center justify-center overflow-auto bg-black bg-opacity-60 text-white">
           <div className="w-11/12 max-w-lg rounded-lg border border-richblack-400 bg-richblack-800 p-6 shadow-lg">
            {/* modal header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-2xl font-semibold text-richblack-5">Add review</p>
                <button
                  onClick={()=> setReviewModal(true)}
                  className="text-2xl text-richblack-300 hover:text-richblack-100 transition-all">
                    <RxCross1 />
                </button>
            </div>

            {/* modal body */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <img
                     src={user?.image}
                     alt='user image'
                     className="aspect-square w-[50px] rounded-full object-cover">
                        
                     </img>
                     <div>
                        <p className="font-medium text-richblack-5">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-richblack-300">posting publicaly</p>
                     </div>

                     
                </div>
                {/* form review */}
                <form
                 onSubmit={handleSubmit(onSubmit)}
                 className="mt-6 flex flex-col items-center spac-y-8 ">
                  
                  {/* rating stars */}
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColors='#ffd700'>

                    </ReactStars>

                    {/* text area */}
                    <div className="w-full">
                        <label htmlFor="courseExperience" className="block text-lg font-medium text-richblack-5 mb-2">
                            Add your experience
                        </label>
                        <textarea
                         id='courseExperience'
                         placeholder="add your experience here"
                         {...register('courseExperience',{required:true})}
                         className="form-style min-h-[130px] w-full text-black" ></textarea>
                         {
                            errors.courseExperience &&  (
                                <span className="text-xs text-pink-200 mt-1 block">please add your experience</span>
                            )
                         }
                    </div>

                    {/* cancel and save button */}
                    <div className="flex w-full justify-end gap-4">
                        <button onClick={()=> setReviewModal(false)} className="cursor-pointer rounded-md bg-richblack-700 px-6 py-3 font-medium text-richblack-100 transition-all">Cancel</button>
                        <IconBtn text='save' type='submit' customClasses='bg-yellow-50 text-black font-bold px-6 py-3 rounded-md transition-all'></IconBtn>
                    </div>
                  
                </form>
            </div>
           </div>
        </div>
    )
}

export default CourseReviewModal