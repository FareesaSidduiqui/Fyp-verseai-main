import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./pages/subComponents/Navbar";
import Footer from "./pages/subComponents/Footer";
import AuthModal from "./pages/subComponents/AuthModel";
import Community from "./pages/Community";
// import AuthWrapper from './pages/subComponents/AuthWrapper'; // ✅ NEW
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const LayoutWrapper = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showNavAndFooter = ["/", "/profile", "/community"].includes(
    location.pathname
  );
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      {showNavAndFooter && <Navbar toggleModal={toggleModal} />}

      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("accessToken") ? (
              <Navigate to="/community" replace />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/profile"
          element={
            <AuthWrapper>
              <Profile />
            </AuthWrapper>
          }
        />
        <Route
          path="/community"
          element={
            <AuthWrapper>
              <Community />
            </AuthWrapper>
          }
        />
      </Routes>

      {showNavAndFooter && <Footer />}
      {isModalOpen && (
        <AuthModal isOpen={isModalOpen} closeModal={toggleModal} />
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
