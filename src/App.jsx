import React, { Suspense } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useLoadUserQuery } from "@/features/api/authApi";

import MainLayout from "./layout/MainLayout";
import Login from "./pages/login";

// student
import HeroSection from "./pages/student/HeroSection";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import CourseDetail from "./pages/student/CourseDetail";
import LecturePlayer from "./pages/LecturePlayer";

// admin
import Sidebar from "./pages/admin/Sidebar";
const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";

// guards
import ProtectedRoute from "@/components/ProtectedRoute";
import InstructorRoute from "@/components/InstructorRoute";

import LoadingSpinner from "./components/LoadingSpinner";
import CourseProgress from "./pages/student/CourseProgress";
import Footer from "./pages/student/Footer";
import AboutUs from "./pages/student/AboutUs";
import ContactUs from "./pages/student/ContactUs";
import PrivacyPolicy from "./pages/student/PrivacyPolicy";
import TermsAndConditions from "./pages/student/TermsAndConditions";
import RefundPolicy from "./pages/student/RefundPolicy"
import ExploreCourses from "./pages/student/ExploreCourses"
import RoadmapAndRequests from "./pages/student/RoadmapAndRequests"
import SearchPage from "./pages/student/SearchPage";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // ================= PUBLIC =================
      {
        index: true,
        element: (
          <>
            <HeroSection />
            <Courses />
            <Footer/>
          </>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "course-detail/:id", element: <CourseDetail /> },
      { 
        path: "course/search",
        element: <SearchPage /> 
      },
      
      {path:"/about", element:<AboutUs />},
      {path:"/contact", element:<ContactUs />},
         {path:"/privacy-policy", element:<PrivacyPolicy />},
         {path:"/terms-conditions", element:<TermsAndConditions/>},
         {path:"/refund-policy", element:<RefundPolicy/>},
         {path:"/explore-courses", element:<ExploreCourses/>},
         {path:"/roadmap-requests", element:<RoadmapAndRequests/>},
         

      // ================= STUDENT (LOGIN REQUIRED) =================
      {
        element: <ProtectedRoute />,
        children: [
          { path: "my-learning", element: <MyLearning /> },
          { path: "profile", element: <Profile /> },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <LecturePlayer />,
          },

          { path: "course/:courseId/progress", element: <CourseProgress /> },
        ],
      },

      // ================= INSTRUCTOR =================
      {
        path: "admin",
        element: <InstructorRoute />,
        children: [
          {
            element: <Sidebar />,
            children: [
              { path: "dashboard", element:(<Suspense fallback={<LoadingSpinner />}> <Dashboard /></Suspense> )},
              { path: "course", element: <CourseTable /> },
              { path: "course/create", element: <AddCourse /> },
              { path: "course/:id", element: <EditCourse /> },
              { path: "course/:id/lecture", element: <CreateLecture /> },
              {
                path: "course/:id/lecture/:lectureId",
                element: <EditLecture />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  const { isLoading } = useLoadUserQuery();

  // 🔥 Auth hydration guard (VERY IMPORTANT)
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <RouterProvider router={appRouter} />;
}

export default App;
