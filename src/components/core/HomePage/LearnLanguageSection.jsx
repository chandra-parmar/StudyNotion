import HighLightText from "./HighLightText"
import know_your_progress from '../../../assets/Images/Know_your_progress.png'
import compare_with_other from '../../../assets/Images/Compare_with_others.png'
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png'
import Button from './Button'
function LearnLanguageSection(){
    return(
        <div className="mt=[130px]">
        
           <div className="flex flex-col gap-5 items-center">
               <div className="text-4xl font-semibold text-center"
               >Your swiss knife for 
                  <HighLightText text={'learning any language'}></HighLightText>
               </div>

               <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[70%] ">
                Using spin making learning multiple languages easy. with 20+ languages video lectures,
                progress tracking,custom scedule and more.
               </div>
               
               {/** 3 image */}
               <div className="flex flex-row items-center justify-center mt-5">
                 
                 <img
                    src={know_your_progress}
                    alt="kyp"
                    className="object-contain -mr-32"
                 />
                  <img
                    src={compare_with_other}
                    alt="cwo"
                    className="object-contain"
                 />
                  <img
                    src={Plan_your_lessons}
                    alt="pyl"
                    className="object-contain -ml-36"
                 />

               </div>

               {/** button */}
                 <div className="w-fit">
                    <Button active={true} linkto={'/signup'}>
                       <div>
                        Learn more
                       </div>
                    </Button>
                 </div>
               </div>
         </div>

    
    )
}

export default LearnLanguageSection