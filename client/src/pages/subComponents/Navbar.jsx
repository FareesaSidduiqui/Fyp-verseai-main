import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import HomeNav from './HomeNav'
import DefaultNav from './DefaultNav'

const menuVariants = {
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  closed: {
    x: "-100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleNav = () => setNav(!nav);
  const closeNav = () => setNav(false);
  const toggleAuthModal = () => setShowAuthModal(!showAuthModal);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (

    <nav>
      {isHomePage ? (
        <HomeNav /> // special navbar for homepage
      ) : (
        <DefaultNav />
      )}
    </nav>
  );
};


export default Navbar