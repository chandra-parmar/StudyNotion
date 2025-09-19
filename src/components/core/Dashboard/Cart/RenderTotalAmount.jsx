import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'

const RenderTotalAmount =()=>{

    const {total, cart} = useSelector((state)=> state.cart)

    const handleBuyCourse =()=>{
        const courses= cart.map((course)=> course._id)
        console.log("Bought these course",courses)

        //TODO :API intergate -> payment gateway 
    

    }

    return(
        <div>
             <p>Total:</p>
             <p>Rs.{total}</p>

             <IconBtn text="Buy Now"
                     onClick={handleBuyCourse}
                     customClasses={"w-full justify-center"}
                     >

             </IconBtn>
        </div>
    )
}

export default RenderTotalAmount