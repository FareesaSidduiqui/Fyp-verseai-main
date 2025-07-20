import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import DropDown from "./DropDown";
import axios from "axios";

const stylesList = [
  "horror.png",
  "scifi.png",
  "superhero.png",
  "fairy1.png",
  "princess.png",
];
const genreOptions = [
  "Fantasy",
  "Horror",
  "Drama",
  "Comedy",
  "Mystery",
  "Adventure",
  "Fiction",
  "Supernatural",
  "Thriller",
  "slice of life",
  "Action",
  "Historical",
  "FairyTale",
  "Romance",
  "Non-Fiction",
  "Sci-Fi",
];
const durationOptions = [
  "30s",
  "60s",
  "1 minute",
  "2 minutes",
  "3 minutes",
  "4 minutes",
  "5 minutes",
];

const GenerateStory = ({ isOpen, closeModal, onStoryCreated }) => {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [genre, setGenre] = useState([]);
  const [duration, setDuration] = useState(durationOptions[0]);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % stylesList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset all form-related states when modal opens
      setInputText("");
      setGenre([]);
      setDuration(durationOptions[0]);
      setSelectedStyle(null);
      setVideoUrl(null);
      setCarouselIndex(0);
      setVisibility(true);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      // 1. Get Firebase ID token of the currently signed-in user
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to generate a story.");
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();

      const durationMap = {
        "30s": 30,
        "60s": 60,
        "1 minute": 60,
        "2 minutes": 120,
        "3 minutes": 180,
        "4 minutes": 240,
        "5 minutes": 300,
      };

      const numericDuration = durationMap[duration] || 30; // Default to 30 if unknown

      // 2. Create payload
      const payload = {
        prompt: inputText,
        genre : genre.join(", "),
        duration: numericDuration,
        visibility: visibility ? "public" : "private",
      };

      // 3. Make the POST request to your backend using Axios
      const response = await axios.post(
        "http://localhost:8000/api/videos/generate",
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // 🔥 Send token
          },
        }
      );

      console.log("Generated story:", response.data);
      console.log(response.data.storyName);

      if (onStoryCreated) {
        onStoryCreated(response.data);
      }

      setVideoUrl(response.data.videoUrl); // Update with the actual key your backend returns

      // alert("Story generated!");
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Something went wrong.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const visibleStyles =
    stylesList.slice(carouselIndex, carouselIndex + 6).length < 6
      ? [
          ...stylesList.slice(carouselIndex),
          ...stylesList.slice(0, 6 - stylesList.slice(carouselIndex).length),
        ]
      : stylesList.slice(carouselIndex, carouselIndex + 6);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] h-[635px] max-w-5xl rounded-2xl p-8 shadow-lg flex flex-col lg:flex-row gap-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-400"
          onClick={closeModal}
        >
          <FaTimes size={20} />
        </button>

        {/* Left Panel */}
        <div className="flex-1 text-white overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Create Your Story
          </h2>
          <label className="block font-medium text-sm mb-1">Your Prompt</label>
          <textarea
            placeholder="Enter your story idea or prompt..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-14 p-4 rounded-lg bg-gray-800 text-white focus:outline-none resize-none mb-4"
          />

          <div className="flex items-center gap-6 mb-6">
            {/* Genre Dropdown */}
{/* Genre Multi-Select Buttons */}
<div className="mb-4">
  <label className="block font-medium text-sm mb-2">Genre (max 3)</label>
  <div className="flex flex-wrap gap-2">
    {genreOptions.map((option) => {
      const isSelected = genre.includes(option);
      return (
        <button
          key={option}
          type="button"
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
            isSelected
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
          }`}
          onClick={() => {
            if (isSelected) {
              setGenre(genre.filter((g) => g !== option));
            } else if (genre.length < 3) {
              setGenre([...genre, option]);
            }
          }}
        >
          {option}
        </button>
      );
    })}
  </div>
</div>


            <DropDown
              label="Duration"
              value={duration}
              setValue={setDuration}
              options={durationOptions}
            />

            {/* Duration Dropdown */}
          </div>

          {/* Style Carousel */}
          <label className="block font-medium text-sm mb-2">
            Choose a style
          </label>
          <div className="flex items-center gap-2 mb-6">
            <FaChevronLeft
              onClick={() =>
                setCarouselIndex(
                  (carouselIndex - 1 + stylesList.length) % stylesList.length
                )
              }
              className="text-white cursor-pointer hover:text-cyan-400"
            />
            <div className="flex gap-2">
              {visibleStyles.map((img, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedStyle(img)}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-full overflow-hidden ring-2 cursor-pointer transition-all duration-300 ${
                    selectedStyle === img ? "ring-cyan-500" : "ring-transparent"
                  }`}
                >
                  <img
                    src={`/${img}`}
                    alt={`Style ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <FaChevronRight
              onClick={() =>
                setCarouselIndex((carouselIndex + 1) % stylesList.length)
              }
              className="text-white cursor-pointer hover:text-cyan-400"
            />
          </div>

          <div className="px-3 -left-40">
            <button
              onClick={handleGenerate}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Right Panel */}
        {/* Right Panel */}
        <div className="w-full lg:w-[50%] flex items-center justify-center h-full">
          {loading ? (
            <div className="w-24 h-24 rounded-full animate-spin bg-gradient-to-r from-purple-500 to-cyan-600 p-[5px]">
              <div className="bg-gray-900 w-full h-full rounded-full"></div>
            </div>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full rounded-lg"
            />
          ) : (
            <p className="text-center text-gray-400">
              Your generated story will appear here...
            </p>
          )}
        </div>
      <div className="absolute bottom-4 right-6 flex items-center gap-3 text-white">
  <span className="text-sm font-medium">
    {visibility ? "Public" : "Private"}
  </span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={visibility}
      onChange={() => setVisibility(!visibility)}
    />
    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 relative"></div>
  </label>
</div>

      </div>
    </div>
  );
};

export default GenerateStory;
