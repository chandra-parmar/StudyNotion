import React  from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighLightText from '../components/core/HomePage/HighLightText';
import Button from '../components/core/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import LearnLanguageSection from '../components/core/HomePage/LearnLanguageSection';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';
function Home()
{
    return(
        <>

           {/*section 1*/}
            <div className=' realtive flex flex-col mx-auto w-11/12 items-center text-white 
            justify-between '>
                
                {/**Button */}
                <Link to={'/signup'}>

                    <div className=' mt-10 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                    transition-all duration-200 hover:scale-95 w-fit'>
                        <div className='flex flex-row p-3 items-center gap-2 text-white '>
                            <p>Become an Instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>

                <div className='text-center text-4xl font-semibold mt-10'>
                    Empower Your Future with 
                    <HighLightText text={"Coding Skills"}></HighLightText>
                </div>
               
               <p className=' mt-4 w-[90%] text-center text-lg font-bold tex-richblack-300'>
                With our online coding courses you can learn at your own pace from anywhere in the world and get access to a 
                wealth of resources, including hands-on projects,video lectures from Instructors.

               </p>
                 
                 {/*2  button  */}
               <div className='flex flex-row gap-7 mt-8'>
                  <Button active={true} linkto={'/signup'}>
                      Learn More
                  </Button>

                   <Button active={false} linkto={'/login'}>
                      Book a demo
                   </Button> 
               </div>


               {/* video  */}
               <div className='mt-20 rounded-lg shadow-[5px_5px_5px_white]'>
                <video muted loop autoPlay style= {{ width: "800px", height: "400px" }}>
                <source src={Banner} type='video/mp4'/>
                </video>
               </div>


               {/* animation unlock */}

                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock Your 
                                <HighLightText text={"coding potential"}></HighLightText>
                                {' '}
                                with our online courses
                            </div>

                        }
                        para={"our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their experience"}
                        
                      button1={
                        {
                            btnText:"try it yourself",
                            linkto:"/signup",
                            active:true
                        }
                      }

                      button2={
                        {
                            btnText:"learn more",
                            linkto:"/login",
                            active:false
                        }
                      }
                
                    animatedCodeblock={
                        `<!DOCTYPE html>\n<html>\n<head><title>Example</title><link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="one/">One</a>< href="two/">Two</\na><a href="three/">Three</a></nav>\n</body>\n</html>`

                    }
                    codeColor ={'text-yellow-25'}


                    ></CodeBlocks>
                </div>







          </div>

           {/*section 2 unclock the power of code*/}

           <div className ='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[310px]'>
              <div className='w-11/12 max-w-maxContent flex  flex-col  items-center justify-between gap-5 mx-auto'>
              <div className='h-[150px]'></div>

              {/*/buttons*/}
              <div className='flex flex-row gap-7 text-white '>

                  <Button  active={true} linkto={'/signup'}>
                    <div className='flex items-center gap-2'>
                        Explore full catalog 
                        <FaArrowRight/>
                    </div>
                    
                  </Button>

                   <Button  active={false} linkto={'/login'}>
                    <div className='flex items-center gap-2'>
                        Learn More 
                        
                    </div>
                    
                  </Button>

              </div>

              </div>

            </div>

            <LearnLanguageSection></LearnLanguageSection>


           </div>


           {/*section 3 reviews wala*/}
           <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between bg-richblack-900 text-white '>
             <h2 className='text-center tex-4xl font-semibold mt-10'>Review from other learners</h2>
             
             {/** Todo: review slider  */}
             <ReviewSlider></ReviewSlider>
             
           </div>

           {/**footer */}
           <Footer></Footer>

        </>
    )
}

export default Home