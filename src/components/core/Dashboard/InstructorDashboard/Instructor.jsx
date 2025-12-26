import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
import { getSlideTransformEl } from "swiper/effect-utils"

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData} from '../../../../services/operations/profileAPI'
import { LuIndianRupee } from "react-icons/lu";
import InstructorChart from './InstructorChart'
import { Link } from "react-router-dom"


const Instructor =()=>{

    const [loading,setLoading] = useState(false)
    const [instructorData,setInstructorData] = useState(null)
    const [courses,setCourses] = useState([])
    const {token} = useSelector((state)=> state.auth)
    const {user} = useSelector((state)=> state.profile)


    useEffect(()=>{
        const getCourseDataWithStats= async()=>{
            setLoading(true)
 
            //pending
            const instructorApiData = await getInstructorData(token)
            const result = await fetchInstructorCourses(token)

            console.log(instructorApiData)

            if(instructorApiData.length)
            {
                setInstructorData(instructorApiData)
            }
            if(result)
            {
                setCourses(result)
            }
            setLoading(false)


        }
        getCourseDataWithStats()
    },[])

    const totalAmount = instructorData?.reduce((acc,curr)=> acc+ curr.totalAmountGenerated,0)
    const totalStudents = instructorData?.reduce((acc,curr)=> acc+ curr.totalStudentsEnrolled,0)


    return(
        <div className="text-white">
           <div>
            <h1>Hai {user?.firstName}</h1>
            <p>let's start something new</p>

           </div>
           {/* if loading then show spinner  */}

           { loading ? (<div className="spinner"></div>) : courses.length >0 ? 
           (
            <div>
                 <div>
                    <div>
                          <InstructorChart courses= {instructorData}></InstructorChart>
                          <div>
                            <p>Total Courses</p>
                            <p>{courses.length}</p>

                          </div>

                          <div>
                            <p>Total students</p>
                            <p>{totalStudents}</p>
                          </div>

                          <div>
                            <p>Total Income</p>
                            <p><LuIndianRupee />{totalAmount}</p>
                          </div>

                    </div>
              </div>
              {/* courses list  */}
                <div>
                    <div>
                        <p>Your courses</p>
                        <Link to='/dashboard/my-courses'>
                            <p>View all</p>
                        </Link>
                    </div>
                    <div>
                        {
                          courses.slice(0,3).map((course)=>(
                            <div>
                                <img src={course.thumbnail}></img>
                                <div>
                                    <p>{course.courseName}</p>
                                    <div>
                                        <p>{course.studentsEnrolled.length} students</p>
                                        <p>|</p>
                                        <p>Rs.{course.price}</p>
                                    </div>
                                </div>
                            </div>
                          ))   
                        }
                    </div>
                </div>
            </div>
             
             ) : (
                <div>
                    <p>You have not created any courses</p>
                    <Link to={'/dashboard/add-course'}>Create a course</Link>
                </div>
             )}
        </div>
    )
}

export default Instructor