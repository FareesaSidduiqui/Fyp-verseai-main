import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig"; // adjust path as needed
import { getAdditionalUserInfo } from "firebase/auth";
import axios from 'axios'

const AuthModal = ({ isOpen, closeModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleAuth = async () => {
  try {
    let userCredential;
    if (isLogin) {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    }

    const user = userCredential.user;
    const tokenID = await user.getIdToken();

    const displayName = user.displayName || user.email;

    // Store locally
    localStorage.setItem("accessToken", tokenID);
    localStorage.setItem("username", displayName);

    // Only send token to backend if user signed up
    if (!isLogin) {
    const token= await user.getIdToken();

      await axios.post(
        "http://localhost:8000/api/auth/verify-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    closeModal();
    navigate("/community");
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);
    alert(error.message);
  }
};


const handleGoogleAuth = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const tokenID = await user.getIdToken(); // ✅ Rename to token for consistency

    const displayName = user.displayName || user.email;

    // Save to localStorage
    localStorage.setItem("accessToken", tokenID);
    localStorage.setItem("username", displayName);

    // ✅ Optional: Check if user is new
    const additionalInfo = getAdditionalUserInfo(result);
    const isNewUser = additionalInfo?.isNewUser;

    // ✅ Send to backend only if new user
    if (isNewUser) {
    const token = await user.getIdToken(); // ✅ Rename to token for consistency

      await axios.post(
        "http://localhost:8000/api/auth/verify-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    closeModal();
    navigate("/community");
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    alert(error.message);
  }
};





  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#191f30] rounded-lg p-6 w-[80%] max-w-[400px] shadow-xl text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              {isLogin ? "Login" : "Signup"}
            </h2>
            <p className="text-sm text-center mb-6">
              Please {isLogin ? "login" : "sign up"} with your credentials
            </p>

            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 mx-2 ${
                  isLogin ? "bg-purple-700" : "bg-gray-800"
                } rounded`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 mx-2 ${
                  !isLogin ? "bg-purple-700" : "bg-gray-800"
                } rounded`}
                onClick={() => setIsLogin(false)}
              >
                Signup
              </button>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800"
            />
            <button
              className="w-full py-2 mb-4 rounded bg-purple-600 hover:bg-purple-700"
              onClick={handleAuth}
            >
              {isLogin ? "Login" : "Signup"}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-500" />
              <p className="px-4 text-sm text-gray-400">Or</p>
              <hr className="flex-1 border-gray-500" />
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-2 mb-2 border border-gray-500 rounded hover:bg-gray-700 transition-colors"
              onClick={handleGoogleAuth}
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            <button
              onClick={closeModal}
              className="text-sm text-gray-400 hover:text-white mt-4 block mx-auto transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
