import { useSelector } from "react-redux"
import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"


export default function Cart()
{

    const {total,totalItems} = useSelector((state)=> state.auth)
     
    return(
        <div className="text-white">
            <h1>Your cart</h1>
            <p>{totalItems} Courses in cart</p>

            {total >0  
            ? (<div>
                <RenderCartCourses></RenderCartCourses>
                <RenderTotalAmount></RenderTotalAmount>
            </div>) 
            : (<p>Your cart is empty</p>)}
        </div>
    )
}