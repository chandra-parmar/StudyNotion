import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CiStar } from "react-icons/ci"
import { FaStar } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { removeFromCart } from '../../../../slices/cartSlice'
import ReactStars from 'react-rating-stars-component'

const RenderCartCourses=()=>{

    const {cart} = useSelector((state)=> state.cart)
    const dispatch = useDispatch()


    return(
        <div>
           {
              cart.map((course,index)=>{
                   <div>
                      <div>
                        <img src={course?.thumbnail}>
                            <div>
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name}</p>
                                <div>
                                    <span>4.8</span>
                                    <ReactStars
                                       count={5}
                                       size={20}
                                       edit={false}
                                       activeColor="yellow"
                                       emptyIcon={<CiStar />}
                                       fullIcon={<FaStar />}>

                                    </ReactStars>

                                    <span>{course?.ratingAndReviews?.length}Ratings</span>

                                </div>

                            </div>
                        </img>
                      </div>

                      <div>
                            <button onClick={()=> dispatch(removeFromCart(course._id))}>
                                <MdDelete />
                                
                            </button>

                            <p>Rs.{course?.price} </p>
                      </div>
                   </div>

              })
           }

        </div>

    )
}

export default RenderCartCourses