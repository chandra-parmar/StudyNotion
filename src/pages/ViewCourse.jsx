import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet,useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCompletedLectures, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import { useState } from 'react'
import { setCourseSectionData } from '../slices/viewCourseSlice'
const ViewCourse = ()=>{

    const [reviewModal,setReviewModal] = useState(false)
    const {courseId } = useParams()
    const {token}= useSelector((state)=> state.auth)
    const dispatch= useDispatch()

    useEffect(()=>{
        const setCourseSpecificDetails = async()=>{
            const courseData= await getFullDetailsOfCourse(courseId,token)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            dispatch(setEntireCourseData(courseData.courseDetails))
            dispatch(setCompletedLectures(courseData.completedVideos))
            
            let lectures=0
            courseData?.courseDetails?.courseContent?.forEach((sec)=>{
                lectures= lectures+ sec.subSection.length

            })
            dispatch(setTotalNoOfLectures(lectures))

        }
        setCourseSpecificDetails()
    },[])

    return(
        <>
            <div className=' relative flex min-h-screen bg-richblack-900 text-richblack-5'>
                <VideoDetailsSidebar setReviewModal={setReviewModal}></VideoDetailsSidebar>

                <div className='mx-auto flex w-full flex-1 flex-col'>
                    <div className='flex-1'>
                        <Outlet></Outlet>
                    </div>
                   
                </div>
            </div>
            { reviewModal && <CourseReviewModal setReviewModal={setReviewModal} ></CourseReviewModal>}
        </>
    )
}

export default ViewCourse