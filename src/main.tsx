//paquetes
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
// tailwind
import "./index.css";

//componentes
import Login from "./login/login";
import Signup from "./login/signup";
import Welcome from "./dashboard/welcome";
import NotFound from "./paginas extras/notfound";
import EditUser from "./catalogo usuarios/edit";
import ClosedService from "./paginas extras/closedService";
import Edit from "./edit personal info/edit";
import Clima from "./web_service/clima";
import Seach from "./web_service/seach";
import TablaPosts from "./tabla maestro/TablaPosts";
import EditPost from "./tabla maestro/EditPost";
import Post from "./tabla maestro/Post";

function ProtectedRoutes() {
  const [isAuth, setIsAuth] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    token ? setIsAuth(true) : setIsAuth(false);
  }, []);
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}

const router = (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/edit-user/:id" element={<EditUser />} />

          
          <Route path="/edit-my-profile" element={<Edit />} />
          

          <Route path="/weather-service" element={<Clima />} />
          <Route path="/search" element={<Seach />} />
          <Route path="/tabla-posts" element={<TablaPosts />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="/post-a-post" element={<Post />} />


        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/closed-service" element={<ClosedService />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")!).render(router);
