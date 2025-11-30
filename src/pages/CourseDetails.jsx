import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { buyCourse } from '../services/operations/studentFeaturesAPI'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI'
import Error from './Error'
import ConfirmationModal from '../components/common/ConfirmationModel'
import RatingStars from '../components/common/RatingStars'
import GetAvgRating from '../utils/avgRating'
import { formatDate } from '../services/formatDate'
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'
import Footer from '../components/common/Footer'
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'
import { BiInfoCircle } from 'react-icons/bi'
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'


const CourseDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)

  const [courseData, setCourseData] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAverageReviewCount] = useState(0)
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

  // ------------------------------
  // Fetch Course Details
  // ------------------------------
  useEffect(() => {
    const getDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId)
        console.log("Fetched courseData:", result)
        setCourseData(result)
      } catch (error) {
        console.log("Could not fetch course details")
      }
    }

    getDetails()
  }, [courseId])

  // courseDetails extract (safe)
  const courseDetails = courseData?.data?.[0] || null

  // ------------------------------
  // Avg Rating Calculation
  // ------------------------------
  useEffect(() => {
    if (courseDetails?.ratingAndReviews) {
      const count = GetAvgRating(courseDetails.ratingAndReviews)
      setAverageReviewCount(count || 0)
    }
  }, [courseDetails])

  // ------------------------------
  // Lecture Count Calculation
  // ------------------------------
  useEffect(() => {
    if (!courseDetails?.courseContent) return

    let lectures = 0
    courseDetails.courseContent.forEach((sec) => {
      lectures += sec?.subSection?.length || 0
    })

    setTotalNoOfLectures(lectures)
  }, [courseDetails])

  // ------------------------------
  // Buy Course Handler
  // ------------------------------

  const [isActive,setIsActive] = useState(Array(0))
  const handleActive =(id ) =>{
    setIsActive(
      !isActive.includes(id) ? isActive.concat(id) : isActive.filter((e)=> e!= id)
    )
  }

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }

    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null)
    })
  }

  // ------------------------------
  // Handling Loading & Invalid States
  // ------------------------------
  if (loading || !courseData) {
    return <div>Loading...</div>
  }

  if (!courseData.success || !courseDetails) {
    return <Error />
  }

  // ------------------------------
  // Destructure courseDetails safely
  // ------------------------------
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt
  } = courseDetails

  // ------------------------------
  // Render
  // ------------------------------
  return (
     <>
         <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
         </div>
      
       
        

      {/** what you will learn */}
        <div className="my-8 border border-richblack-600 p-8 text-white">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>

       {/** course content section */}
       <div className='text-white'>
         <div >
          <p>Course content</p>
         </div>
       
       <div className='flex gap-x-3 justify-between'>
            <div>
          <span>{courseContent.length} section(s)</span>
          <span>{totalNoOfLectures}</span>
          <span>{courseData.data?.totalDuration} total Duration </span>
        </div>

        <div>
          <button onClick={()=> setIsActive([])} >
              collapse all sections
          </button>
        </div>
       </div>

       {/** course details accordion */}
       <div className='py-4'>
        {courseContent?.map((course,index)=>(
          <CourseAccordionBar
           course={course}
            key={index}
             isActive={isActive}
             handleActive={handleActive}>

          </CourseAccordionBar>
        ))}

      </div>       
        
        
          {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
            </div>

            <Footer></Footer>

       </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
        
     </>
  )
}

export default CourseDetails
