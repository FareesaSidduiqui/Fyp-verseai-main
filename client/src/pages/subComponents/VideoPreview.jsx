import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const VideoPreview = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-[#191f30] rounded-2xl w-full max-w-4xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-400 rounded-full p-2 z-50 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

<div className="relative w-full max-w-5xl mx-auto aspect-video bg-black rounded-xl overflow-hidden group object-contain">
  <video
    controls
    autoPlay
    src={videoUrl}
    className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
  >
    Your browser does not support the video tag.
  </video>
</div>







      </motion.div>
    </motion.div>
  );
};

export default VideoPreview;