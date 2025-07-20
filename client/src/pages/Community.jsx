import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { FaAngleLeft, FaAngleRight, FaRegHeart } from "react-icons/fa";
import Pagination from "./subComponents/Pagination";
import VideoPreview from "./subComponents/videoPreview";
import axios from "axios";

const categories = [
  "All Channels",
  "Props",
  "Game Art",
  "Character Animation",
  "VFX for Film, TV & Animation",
  "Unreal Engine",
  "Architectural Visualization",
  "Insta",
];

const Community = () => {
  const categoriesRef = useRef(null);
  const footerTriggerRef = useRef(null);
  const [showNav, setShowNav] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Match the items per page with Profile

  // ... existing useEffect for fetching stories

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStories = stories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stories.length / itemsPerPage);

  // Fetch stories from backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/videos/community"
        );

        // Axios automatically parses JSON for you
        const data = response.data;

        // Format the stories
        const formattedStories = data.stories
          .filter((story) => story.visibility === "public")
          .map((story) => ({
            src: story.thumbnail,
            title: story.storyName,
            madeBy: story.userId.username,
            videoUrl: story.videoUrl,
          }));

        setStories(formattedStories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = 300;
      categoriesRef.current.scrollTo({
        left:
          categoriesRef.current.scrollLeft +
          (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (story) => {
    setSelectedVideo(story);
  };

  const closePreview = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNav(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerTriggerRef.current) {
      observer.observe(footerTriggerRef.current);
    }

    return () => {
      if (footerTriggerRef.current) {
        observer.unobserve(footerTriggerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-[#191f30] text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-[#191f30] text-white flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#191f30] text-white">
      {/* Categories with Arrows */}
      <div className="relative px-4 py-8">
        <div className="flex items-center">
          <button
            onClick={() => scrollCategories("left")}
            className="absolute left-4 z-10 text-2xl text-cyan-500 p-2"
          >
            <FaAngleLeft />
          </button>

          <div
            ref={categoriesRef}
            className="flex space-x-4 overflow-x-auto mx-14"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className="inline-flex bg-[#ffffff05] px-6 py-2 rounded-full hover:bg-cyan-500 flex-shrink-0 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories("right")}
            className="absolute right-4 z-10 text-2xl text-cyan-500 p-2"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold p-6 pb-12">
        <span>Community</span> Stories
      </h2>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-7 px-4 pb-20">
        {currentStories.map((story, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
            className="relative bg-[#ffffff05] rounded overflow-hidden group hover:scale-105 transition-transform duration-300 h-60"
            onClick={() => handleCardClick(story)}
          >
            <img
              src={story.src}
              alt={story.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="space-y-2">
                <h3 className="font-medium text-white">{story.title}</h3>
                <p className="text-sm text-cyan-300">By {story.madeBy}</p>
              </div>
            </div>

            {/* Favorite Button */}
            <button
              className="absolute top-2 right-2 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-cyan-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite logic here
              }}
              title="Add to Favorites"
            >
              <FaRegHeart size={16} />
            </button>
          </motion.div>
        ))}
      </div>

          {/* Updated Pagination with proper props */}
      <div ref={footerTriggerRef} className="w-full flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>


      {/* Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50 transition-opacity duration-300">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-full shadow-md flex justify-center space-x-6 py-2 px-4">
            <button className="px-6 py-2 rounded-full hover:bg-cyan-700 text-white transition-colors">
              Community
            </button>
            <button className="px-6 py-2 rounded-full hover:bg-cyan-700 text-white transition-colors">
              Trending
            </button>
            <button className="px-6 py-2 rounded-full hover:bg-cyan-700 text-white transition-colors">
              Latest
            </button>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      <VideoPreview
        // className=''
        isOpen={!!selectedVideo}
        onClose={closePreview}
        videoUrl={selectedVideo?.videoUrl}
      />
    </div>
  );
};

export default Community;
