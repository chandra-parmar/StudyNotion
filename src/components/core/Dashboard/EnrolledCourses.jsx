import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI'
import { useState } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'

const EnrolledCourses =() =>{
    

    //get data from backend
    const {token } = useSelector((state)=> state.auth)
    const [enrolledCourses,setEnrolledCourses] = useState(null)


    const getEnrolledCourses= async()=>{
        try{
            //call profile api function enrolled course
            const response = await getUserEnrolledCourses(token)
            //inserting in enrolled course 
            setEnrolledCourses(response)


        }catch(error)
        {
            console.log("unable to fetch enrolled course")
        }
    }
    //network call
    useEffect(()=>{
        getEnrolledCourses()
    },[])

    return(
        <div className='text-white'>
             <h1>Enrolled Courses</h1>
             {                                             
                !enrolledCourses ? (<div>Loading...</div>)  : 
                //if enrolledcourse length is zero 
                !enrolledCourses.length ? (<p>You have not enrolled in any course yet</p>) 
                 : (
                    //card render of course
                    <div>
                        <div>
                            <p>Course Name</p>
                            <p>Durations</p>
                            <p>Progress</p>
                        </div>

                        {/** cards  */}
                        {
                            enrolledCourses.map((course,index)=>{
                                  <div>
                                    <div>
                                        {/** thumbnail */}
                                        <img src ={course.thumbnail}></img>
                                        <div>
                                            <p>{course.courseName}</p>
                                            <p>{course.courseDescription}</p>
                                        </div>

                                    </div>
                                    {/** duration  */}
                                    <div>
                                        {course?.totalDuration}
                                    </div>

                                    {/** progress bar */}
                                    <div>
                                        <p>Progress : {course.progressPercentage || 0} % </p>
                                      <ProgressBar 
                                      completed={course.progressPercentage ||0}
                                      height='8px'
                                      isLabelVisible={false}>

                                      </ProgressBar>
                                    </div>


                                </div>
                            })
                        }

                    </div>
                 )
             }

        </div>
    )
}

export default EnrolledCourses