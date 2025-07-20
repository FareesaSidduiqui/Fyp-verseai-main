import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link as ScrollLink } from "react-scroll";

const HomeNav = () => {
  const [nav, setNav] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", to: "hero" },
    { name: "About", to: "about" },
    { name: "Features", to: "features" },
    { name: "Info", to: "cta" },
    { name: "Contact", to: "footer" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex fixed top-4 left-1/2 bg-opacity-60 backdrop-blur-md transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[65%] lg:w-[45%] max-w-screen-lg px-6 py-2 bg-gray-800 shadow-sm rounded-full justify-between items-center z-50 overflow-hidden">
        {/* Left Side (Logo) */}
        <div className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">VERSE AI</div>

        {/* Center (Links) */}
        <ul className="flex gap-6 text-white flex-nowrap justify-center items-center relative">
          {navLinks.map(({ name, to }) => (
            <li key={name} className="relative">
              <ScrollLink
                to={to}
                className={`hover:text-cyan-300 hover:cursor-pointer relative transition-all duration-300 ${activeSection === to ? "text-cyan-300" : "text-white"
                  }`}
                activeClass="text-cyan-400"
                smooth={true}
                duration={500}
                spy={true}
                offset={-80}
                onClick={() => setActiveSection(to)}
              >
                {name}
              </ScrollLink>
              {activeSection === to && (
                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-cyan-600 transition-all duration-300"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setNav(!nav)}
        className="lg:hidden text-white bg-opacity-70 backdrop-blur-md bg-gray-800 p-3 rounded-full fixed top-4 right-4 z-50"
      >
        {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
      </button>

      {/* Mobile Menu */}
      {nav && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-65 backdrop-blur-md flex flex-col items-center justify-center text-white z-50">
          <button
            onClick={() => setNav(false)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            <AiOutlineClose size={30} />
          </button>
          <ul className="flex flex-col items-center gap-8 text-2xl">
            {navLinks.map(({ name, to }) => (
              <li key={name}>
                <ScrollLink
                  to={to}
                  className="hover:text-cyan-500 hover:cursor-pointer"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onClick={() => {
                    setNav(false);
                    setActiveSection(to);
                  }}
                >
                  {name}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default HomeNav;
