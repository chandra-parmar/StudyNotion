import Button from './Button'
import { TypeAnimation } from 'react-type-animation';
import { FaArrowRight } from "react-icons/fa";


function CodeBlocks({
    position,heading,para,button1,button2,animatedCodeblock,backgroundGradient,codeColor
})
{

    return(
        <div className={`flex ${position} my-20 justify-between gap-10 `}>
           
           {/*section 1*/}
           <div className='w-[50%] flex flex-col gap-8'>
              {heading}

              <div className='text-richblack-300 font-bold '>
                {para}
              </div>

              <div className='flex gap-7 mt-7'>

                 <Button active={button1.active} linkto={button1.linkto}>
                  <div className='flex gap-2 items-center'>
                   {button1.btnText}
                   <FaArrowRight></FaArrowRight>

               </div>

               </Button>

                <Button active={button2.active} linkto={button2.linkto}>

                  <div className='flex gap-2 items-center'>
                     {button2.btnText}
                  </div>

               </Button>


              </div>

           </div>

           {/**section 2 */}
           <div className='flex flex-row h-fit text-[15px] w-[100%] py-4 lg:w-[500px]'>
               {/** TODO:-> bg gradint */}
               <div className='text-center flex flex-col w-[10%] text-richblack-400 font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                 <p>10</p>
                  <p>11</p>

              
               </div>

               <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor}`}>
                 <TypeAnimation
                 sequence={[animatedCodeblock,3000,""]}
                 repeat={Infinity}
                 cursor={true}
                 style={
                    {
                        whiteSpace:"pre-line",
                        display:"block",
                        


                    }
                   
                 }
                  omitDeletionAnimation={true}
                  >
                    
                 </TypeAnimation>  
               </div>
           </div>

        </div>
    )
}
export default CodeBlocks