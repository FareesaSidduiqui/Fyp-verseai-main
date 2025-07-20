import React, { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiBook, FiImage, FiStar, FiLayout, FiFolder,FiSettings, FiUsers,FiUploadCloud } from 'react-icons/fi';
import AuthModal from "./subComponents/AuthModel";
import '../../src/index.css';
import { motion, useInView, AnimatePresence } from "framer-motion";

const images = [
  "/ai-creation.png",
  "/superhero.png",
  "/horror.png",
  "/scifi.png",
  "/thriller.png",
];

const Home = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 }); // Trigger every time it comes into view (50% visible)
  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: false, amount: 0.5 });
  const aboutRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: false, amount: 0.5 });
  const ctaRef = useRef(null);
  const isCTAInView = useInView(ctaRef, { once: false, amount: 0.4 });
  const featuresHeadingRef = useRef(null);
  const isFeaturesHeadingInView = useInView(featuresHeadingRef, { once: false, amount: 0.5 });
  const featuresGridRef = useRef(null);
  const isFeaturesGridInView = useInView(featuresGridRef, { once: false, amount: 0.1 });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // Changes every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#191f30] to-[#191f30] text-white min-h-screen overflow-hidden">
        {/* Hero Section */}
        {/* Glowing Circle - Top Right of Hero */}
        <div className="absolute -top-20 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-300/30 to-purple-500/30 rounded-full blur-3xl z-10 pointer-events-none" />

        <section
          id="hero"
          className="relative min-h-[90vh] pt-24 pb-16 flex items-center justify-center overflow-hidden"
        >

          {/* Background Decorative Rings */}
          <div className="absolute inset-0 z-0 pointer-events-none">

            {/* Glow Rings */}
            {/* First Ring - Top Left */}
            <div className="absolute top-[4%] left-[1%] w-48 h-24 z-20 animate-pulse blur-sm -rotate-[20deg] transform-gpu">
              <svg viewBox="0 0 192 96" preserveAspectRatio="none">
                <ellipse
                  cx="96"
                  cy="48"
                  rx="92"  // (192/2) - borderWidth*2
                  ry="44"  // (96/2) - borderWidth*2
                  stroke="#22d3ee"  // blue-400
                  strokeWidth="4"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Second Ring - Top Right */}
            <div className="absolute top-[45%] right-[2%] w-40 h-28 z-20 animate-pulse blur-sm -rotate-[15deg] transform-gpu">
              <svg viewBox="0 0 224 112" preserveAspectRatio="none">
                <ellipse
                  cx="112"
                  cy="56"
                  rx="108"  // (224/2) - 4
                  ry="52"   // (112/2) - 4
                  stroke="#a855f7"  // blue-300
                  strokeWidth="4"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Additional White Rings in Text & Lower Area */}
            <div className="absolute top-[8%] left-[20%] w-3 h-3 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute top-[10%] left-[55%] w-2 h-2 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute top-[45%] left-[5%] w-3 h-3 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute bottom-[10%] left-[7%] w-2 h-2 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute top-[20%] left-[40%] w-3 h-3 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute bottom-[30%] right-[50%] w-2 h-2 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute bottom-[2%] left-[40%] w-3 h-3 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute top-[45%] left-[55%] w-4 h-4 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute bottom-[20%] left-[30%] w-3 h-3 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute bottom-[8%] right-[30%] w-4 h-4 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute top-[10%] right-[5%] w-2 h-2 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
            <div className="absolute bottom-[20%] right-[5%] w-3 h-3 border-2 border-gray-500 opactiy-20 animate-pulse rounded-full" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={ref}
              initial={{ x: -100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
                <span className="text-cyan-400">Explore</span> the fascinating <br />
                world of <span className="text-purple-400">VR</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-10">
                Enter a space where imagination meets technology. Let AI recreate, explore, and
                narrate. Dive into a universe far beyond the ordinary with Verse AI.
              </p>
              <button
                onClick={toggleModal}
                className="bg-gradient-to-r from-purple-500 to-cyan-600 px-10 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-xl flex items-center gap-3">
                <FiBook className="text-2xl" />
                Begin Your Quest
              </button>
            </motion.div>

            {/* Robot Image */}
            <motion.div
              ref={imageRef}
              initial={{ x: 100, opacity: 0 }}
              animate={isImageInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative top-8 left-12 z-10"
            >
              <img
                src="/roborings.png"
                alt="Flying Robot"
                className="w-full max-w-md md:max-w-lg mx-auto animate-float"
              />
            </motion.div>
          </div>
          {/* Modal Rendering */}
          {isModalOpen && <AuthModal isOpen={isModalOpen} closeModal={toggleModal} />}
        </section>

        {/* Glowing Circle - Between Hero & About Section (Bottom Left) */}
        <div className="absolute bottom-[-80px] left-[-80px] w-96 h-96 bg-gradient-to-tr from-cyan-300/30 to-purple-500/40 rounded-full blur-[100px] z-10 pointer-events-none" />

        {/* About Section */}
        <section className="py-24 relative">
          <div id="about" className="max-w-7xl mx-auto px-4 pt-8 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative h-[400px] w-full">
              {images.map((src, idx) => {
                const isActive = idx === current;

                return (
                  <motion.div
                    key={idx}
                    className="absolute w-full h-full rounded-2xl border border-purple-700/30 overflow-hidden shadow-xl"
                    style={{
                      zIndex: isActive ? 10 : images.length - idx,
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.4,
                      scale: isActive ? 1 : 0.95,
                      rotate: isActive ? 0 : -2 * (images.length - idx),
                      transition: {
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <img
                      src={src}
                      alt={`Deck Image ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              ref={aboutRef}
              initial={{ x: 100, opacity: 0 }}
              animate={isAboutInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2">
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Redefining Digital Storytelling
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                At Verse AI, we're pioneering a new era of narrative creation. Our platform combines
                cutting-edge language models with visual synthesis technology to create immersive
                storytelling experiences.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-[#ffffff05] rounded-xl border border-gray-700">
                  <h4 className="text-2xl font-bold text-purple-400 mb-2">100M+</h4>
                  <p className="text-gray-400">Stories Created</p>
                </div>
                <div className="p-6 bg-[#ffffff05] rounded-xl border border-gray-700">
                  <h4 className="text-2xl font-bold text-cyan-400 mb-2">📚 Genre Flexibility</h4>
                  <p className="text-gray-400">Supports a wide range of storytelling genres</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section >

        {/* Features Section */}
        < section id="features" className="py-24 relative" >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              ref={featuresHeadingRef}
              initial={{ y: -50, opacity: 0 }}
              animate={isFeaturesHeadingInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-20">
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Powerful Creation Tools
              </h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                Equip yourself with our arsenal of next-gen storytelling features
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FiStar, title: 'AI Narrative Engine',
                  text: 'Craft personalized, genre-specific stories using LLaMA 3'
                },
                {
                  icon: FiImage, title: 'Visual Alchemy',
                  text: 'Stable Diffusion image synthesis tailored to your narrative'
                },
                {
                  icon: FiLayout, title: 'Story-to-Video Experience',
                  text: 'Transform your story into a complete animated video, blending audio and visuals seamlessly.'
                },
                {
                  icon: FiFolder, title: 'Create Workspace',
                  text: 'Organize, save, and evolve your stories all in one place.'
                },
                {
                  icon: FiSettings, title: 'Smart Story Controls',
                  text: "Customize narrative flow, genre, and characters using intuitive in-app controls."

                },
                {
                  icon: FiUploadCloud, title: 'One-Click Publishing',
                  text: "Easily share or download your story in video or visual storyboard formats."

                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  ref={featuresGridRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isFeaturesGridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: false }}
                  className="bg-[#24243d] p-8 rounded-xl border border-[#24243d] hover:border-purple-500/30 transition-all group hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feature.icon className="text-4xl mb-6 text-purple-400" />
                  <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                  <p className="text-gray-400">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section >



        {/* CTA Section */}
        < motion.section
          ref={ctaRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isCTAInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          id="cta" className="py-32 relative" >
          <div className="max-w-xl mx-auto text-center px-4">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl " />
            <div className="absolute -bottom-12 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl " />

            <h3 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
              Start Your Journey Today
            </h3>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of creators already shaping tomorrow's stories.
              What legend will you bring to life?
            </p>
            {/* Button that opens the Login modal */}
            <button
              onClick={toggleModal}
              className="bg-gradient-to-r from-purple-500 to-cyan-600 px-16 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl hover:shadow-purple-500/30 relative overflow-hidden group"
            >
              Start For Free
            </button>

            {/* Modal Rendering */}
            {isModalOpen && <AuthModal isOpen={isModalOpen} closeModal={toggleModal} />}
            <p className="text-sm text-gray-500 mt-4">No credit card required</p>
          </div>
        </motion.section >
      </div >
    </>
  );
};

export default Home;
