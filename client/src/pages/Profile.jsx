import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaTrashAlt,
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import GenerateStory from "./subComponents/GenerateStory";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import VideoPreview from "./subComponents/videoPreview";
import Pagination from "./subComponents/Pagination";
import { auth } from '../firebaseConfig'; // adjust the path to your firebase.js file

const Profile = () => {
  const [filter, setFilter] = useState("All");
  const [username, setUsername] = useState("User");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStoryAdded, setNewStoryAdded] = useState(false);

 
    // Fetch user's stories from backend
  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const storedUsername = localStorage.getItem("username");
        const response = await fetch(`http://localhost:8000/api/videos/community?cache=${Date.now()}`);
        
        if (!response.ok) throw new Error("Failed to fetch stories");
        
        const data = await response.json();
        
        // Filter stories for current user
        const userStories = data.stories.filter(story => 
          story.userId.username === storedUsername
        ).map(story => ({
          id: story._id,
          src: story.thumbnail,
          title: story.storyName,
          videoUrl: story.videoUrl,
          isFavourite: false, // You'll need to implement this from your backend
          visibility: story.visibility
        }));

        setVideos(userStories);
        setUsername(storedUsername);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStories();
  }, [newStoryAdded]);
  
  const handleNewStory = (story) => {
  setVideos(prev => [{
    id: story._id,
    src: story.thumbnail,
    title: story.storyName.replace(/^"|"$/g, ''), // Remove surrounding quotes here
    videoUrl: story.videoUrl,
    visibility: story.visibility,
    isFavourite: false
  }, ...prev]);
  setNewStoryAdded(prev => !prev);
};


  const toggleStoryModal = () => setShowStoryModal(prev => !prev);

 const handleDelete = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:8000/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete story");
      }

      // Update local state after successful deletion
      setVideos(videos.filter((video) => video.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
    }
  };


  const toggleFavourite = (id) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, isFavourite: !video.isFavourite } : video
    ));
  };

  const filteredVideos = () => {
    switch(filter) {
      case "Favourites": return videos.filter(video => video.isFavourite);
      case "Public": return videos.filter(video => video.visibility === 'public');
      case "Private": return videos.filter(video => video.visibility === 'private');
      default: return videos;
    }
  };

  const paginatedVideos = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVideos().slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePlay = (video) => {
    setSelectedVideo(video);
  };

  const closePreview = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => setCurrentPage(1), [filter]);
  
   if (loading) {
    return <div className="min-h-screen bg-[#191f30] text-white flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#191f30] text-white flex justify-center items-center">Error: {error}</div>;
  }

  // Calculate stats based on actual data
  const userStats = {
    public: videos.filter(video => video.visibility === 'public').length,
    private: videos.filter(video => video.visibility === 'private').length,
    favorites: videos.filter(video => video.isFavourite).length,
    total: videos.length
  };

  return (
    <div className="min-h-screen bg-[#191f30] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-cyan-900/10" />

      {/* Profile Header */}
      <div className="relative z-10 pt-24 pb-16 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto">
              <span className="text-4xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {username}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="bg-[#ffffff10] px-6 py-2 rounded-full backdrop-blur-sm">
                <span className="text-cyan-400 font-bold">{videos.length}</span> Stories Created
              </div>
              <div className="bg-[#ffffff10] px-6 py-2 rounded-full backdrop-blur-sm">
                <span className="text-purple-400 font-bold">1.2M</span> Views
              </div>
              <div className="bg-[#ffffff10] px-6 py-2 rounded-full backdrop-blur-sm">
                <span className="text-pink-400 font-bold">4.8</span> Rating
              </div>
            </div>
          </div>

          <div className="md:self-start">
            <button
              onClick={toggleStoryModal}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-8 py-4 rounded-2xl font-semibold text-lg transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
            >
              <FaPlus className="text-xl" />
              Create New Story
            </button>
          </div>
        </div>


      {/* Update stats grid to use real data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
        {[
          { label: "Public Stories", value: userStats.public, color: "bg-cyan-500" },
          { label: "Private Stories", value: userStats.private, color: "bg-purple-500" },
          { label: "Favorites", value: userStats.favorites, color: "bg-pink-500" },
          { label: "Total Stories", value: userStats.total, color: "bg-indigo-500" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#ffffff08] p-4 rounded-xl backdrop-blur-sm border border-white/5"
          >
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
      </div>

      {/* Stories Grid */}
      <div className="relative z-10 px-8 max-w-7xl mx-auto pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Your Stories</h1>
          <div className="flex gap-2 bg-[#ffffff10] p-1 rounded-full backdrop-blur-sm">
            {["All", "Favourites", "Public", "Private"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedVideos().map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative group overflow-hidden rounded-xl bg-[#ffffff08] backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white/90">{video.title}</h3>
                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => toggleFavourite(video.id)}
                      className={`p-1.5 rounded-lg ${
                        video.isFavourite ? "text-pink-500" : "text-white/50"
                      } hover:bg-white/10`}
                    >
                      {video.isFavourite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-red-400/80 p-1.5 rounded-lg hover:bg-white/10"
                    >
                      <FaTrashAlt />
                    </button> */}
                  </div>
                </div>
                <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={video.src}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-center mt-4">
                  {/* <button className="flex items-center gap-2 text-sm text-white/80 hover:text-cyan-400">
                    <Eye size={16} />
                    Preview
                  </button> */}
                    <button
                      onClick={() => toggleFavourite(video.id)}
                      className={`p-1.5 rounded-lg ${
                        video.isFavourite ? "text-pink-500" : "text-white/50"
                      } hover:bg-white/10`}
                    >
                      {video.isFavourite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-red-400/80 p-1.5 rounded-lg hover:bg-white/10 mr-10"
                    >
                      <FaTrashAlt />
                    </button>
                  <button
                    onClick={() => handlePlay(video)}
                    className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 ml-10"
                  >
                    <FaPlay className="text-cyan-400" />
                    <span className="text-sm">Play Story</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 mb-7">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredVideos().length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <GenerateStory isOpen={showStoryModal} closeModal={toggleStoryModal}
        onStoryCreated={handleNewStory} // Add this prop
 />
      <VideoPreview
        isOpen={!!selectedVideo}
        onClose={closePreview}
        videoUrl={selectedVideo?.videoUrl}
      />
    </div>
  );
};

export default Profile;