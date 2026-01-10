# 📚 StudyNotion – Full Stack EdTech Platform

StudyNotion is a **full‑stack EdTech web application** inspired by platforms like Udemy. It allows **students to purchase courses**, **watch video lectures**, and **track their progress**, while **instructors can create and manage courses**.

This project was built as a **project‑based learning** initiative to deeply understand **real‑world backend, frontend, authentication, payments, and database design**.

---

## 🚀 Live Demo

🔗 **Hosted on Render** (Backend + Frontend)

> *(Add your deployed URL here)*

---

## 🧠 Key Features

### 👨‍🎓 Student Features

* User authentication (Signup / Login / Logout)
* Browse and purchase courses
* Razorpay payment integration
* Watch course video lectures
* Mark lectures as completed
* Track course progress
* Secure access using JWT

### 👨‍🏫 Instructor Features

* Create and manage courses
* Upload course thumbnails
* Upload video lectures (Cloudinary)
* Create sections & subsections
* View enrolled students

### 🔐 Authentication & Security

* JWT based authentication
* Role based access (Student / Instructor / Admin)
* Protected routes

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Joi (Validation)

### Payments & Media

* Razorpay (Payment Gateway)
* Cloudinary (Image & Video Uploads)

### Deployment

* Render

---

## 📂 Project Structure

```
StudyNotion/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── slices/
│   │   └── utils/
│
├── server/          # Node + Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── config/
│
└── README.md
```

---

## 🔄 Application Flow (Simple Explanation)

### 1️⃣ Authentication Flow

* User signs up / logs in
* Server generates JWT
* Token stored and sent in headers for protected APIs

### 2️⃣ Course Purchase Flow (Razorpay)

1. Frontend requests backend to create an order
2. Backend creates Razorpay order
3. Razorpay checkout opens on frontend
4. Payment is completed
5. Payment is verified on backend
6. User is enrolled in the course

### 3️⃣ Course Progress Tracking

* Each user has a `CourseProgress` document
* When a lecture is completed:

  * Subsection ID is stored in `completedVideos`
* Progress is shown dynamically

---

## 💳 Razorpay Integration (Interview Explanation)

* Razorpay order is created from backend
* Order details are sent to frontend
* Razorpay Checkout is opened
* On success, payment signature is verified
* User enrollment is completed securely

---

## ☁️ Cloudinary Integration

* Images and videos are uploaded using Cloudinary
* Media URLs are stored in MongoDB
* Ensures fast and optimized content delivery

---

## ⚙️ Environment Variables

Create a `.env` file in the **server** directory:

```
PORT=5000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

Create a `.env` file in the **client** directory:

```
REACT_APP_BASE_URL=your_backend_url
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

---

## ▶️ Run Locally

### Backend

```
cd server
npm install
npm run dev
```

### Frontend

```
cd client
npm install
npm start
```

---

## 🎯 What I Learned from This Project

* End‑to‑end authentication using JWT
* Secure payment integration (Razorpay)
* Media upload using Cloudinary
* MongoDB schema design for real applications
* Redux Toolkit for state management
* Debugging real production‑level bugs
* Deploying full‑stack applications

---

## 🧩 Future Improvements

* Course ratings & reviews
* Wishlist feature
* Instructor dashboard analytics
* Admin moderation panel



