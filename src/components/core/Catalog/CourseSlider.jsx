import React from 'react'
import {Swiper, SwiperSlide}  from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { FreeMode} from 'swiper'

import Course_Card from './Course_Card'


const CourseSlider =({Courses})=>{
    return(
        <div>
          {
            Courses?.length ?(
                <Swiper
                  slidesPerView={1}
                 loop={true}
                 spaceBetween={200}
                
                 
                 className='mySwiper'
                 
                 
                 breakpoints={{
                    1024:{sliderPerView:3}
                 }}
                 
                 >
                {
                     Courses?.map((course,index)=>(
                        <SwiperSlide key={index}>
                            <Course_Card course={course} Height={"h-[250px]"}></Course_Card>
                        </SwiperSlide>
                     ))
                }
                </Swiper>
            ) :(
                <p>No courses found</p>
            )
          }
        </div>
    )
}

export default CourseSlider 