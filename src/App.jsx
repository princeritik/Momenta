import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import authentication from "./appwrite/Auth"
import Layout from "./components/Layout";
import Home from "./pages/Home"
import MyPosts from "./pages/MyPostPages"
import AddPost from "./pages/AddPostPage";
import Login from "./pages/LoginPages";
import SignUp from "./pages/SignupPages"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login as authlogin } from "./store/authSlice";
import ProfilePage from "./pages/ProfilePage.jsx"
import EditPostPage from "./pages/Editpages";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import MyProfilePage from "./pages/MyProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { Toaster } from "sonner";
import AppLoader from "./components/AppLoader.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import ForgotPassword from "./components/PasswordForget.jsx";
import ResetPassword from "./components/ResetPassword.jsx";



const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
  path: "/verify-email",
  element: <VerifyEmail />,
  },
  {
  path: "/forgot-password",
  element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "myposts", element: <MyPosts /> },
      { path: "addPost", element: <AddPost /> },
      { path: "editPost/:id", element: <EditPostPage /> },
      { path: "post/:postId", element: <PostDetailPage /> },
      { path: "profile", element: <MyProfilePage /> },
      { path: "profile/:userId", element: <ProfilePage /> },
      { path: "editProfile", element: <EditProfilePage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    authentication.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(authlogin(userData));
          //console.log(userData)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, []);

  if (loading) {
    return <AppLoader />;
  }


  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App
