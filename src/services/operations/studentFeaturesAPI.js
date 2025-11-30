import { studentEndpoints } from "../api"
import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import rzp_Logo from "../../assets/Logo/rzp_logo.png"

import { setPaymentLoading } from "../../slices/courseSlice"
import { resetCart } from "../../slices/cartSlice"

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints

// load Razorpay script
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src

        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)

        document.body.appendChild(script)
    })
}

// buy course
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading payment...")

    try {
        const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if (!sdkLoaded) {
            toast.error("Failed to load Razorpay SDK")
            return
        }

        // 1️⃣ Create order from backend
        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            { Authorization: `Bearer ${token}` }
        )

        

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message || "Order creation failed")
        }

        // ✔ order object
        const order = orderResponse.data.order
        console.log("ORDER:", order)

        // 2️⃣ Razorpay checkout configuration
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: order.currency,
            amount: order.amount,
            order_id: order.id,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            image: rzp_Logo,

            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email,
            },

            handler: function (response) {
                // 3️⃣ Send email
                sendPaymentSuccessEmail(response, order.amount, token)

                // 4️⃣ Verify payment
                verifyPayment({ ...response, courses }, token, navigate, dispatch)
            },
        }

        // 5️⃣ Open Razorpay checkout
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment failed")
            console.log(response.error)
        })

    } catch (error) {
        console.log("payment api error:", error)
        toast.error("Could not initiate payment")
    }

    toast.dismiss(toastId)
}

// send payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            { Authorization: `Bearer ${token}` }
        )
    } catch (error) {
        console.log("payment success email error:", error)
    }
}

// verify payment with backend
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying payment...")
    dispatch(setPaymentLoading(true))

    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            { Authorization: `Bearer ${token}` }
        )

        if (!response.data.success) {
            throw new Error(response.data.message || "Payment verification failed")
        }

        toast.success("Payment successful! You are now enrolled.")
        dispatch(resetCart())
        navigate("/dashboard/enrolled-courses")

    } catch (error) {
        console.log("payment verify error:", error)
        toast.error("Could not verify payment")
    }

    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}
