import {useEffect} from 'react'

//this hook detects click outside of the specified components and calls the provided handler function
export default function useOnClickOutside(ref,handler)
{
    useEffect(()=>{
        //click event listner function 
        const listener =(event)=>{

            //if the click touch event originated inside the ref element do nothing 
            if(!ref.current || ref.current.contains(event.target))
            {
                return 
            }
            //call the handler function
            handler(event) 
        }

        //add event listenere mousedown and touchstart events
        document.addEventListener('mousedown',listener)
        document.addEventListener('touchstart',listener)
        //cleanup functio to remove the event listeners when the ref/handler dependecies change
        return()=>{
            document.removeEventListener('mousedown',listener)
            document.removeEventListener('touchstart',listener)

        }
        //only run this effect when the ref or handler function called

    },[ref,handler])
}