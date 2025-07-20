import React from 'react'
import { FaGithubSquare, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer id='footer' class="relative bg-[#191f30] px-4 pt-20">
      <div class="absolute -top-14 left-1/2 h-24 w-24 -translate-x-1/2"><img class="h-full w-full object-contain" src="/logo1.png" alt="" /></div>
      <nav aria-label="Footer Navigation" class="mx-auto flex max-w-lg flex-col gap-10 text-center sm:flex-row sm:text-left">
        <a href="#" class="font-medium text-white">Home</a>
        <a href="#" class="font-medium text-white">Support</a>
        <a href="#" class="font-medium text-white">Privacy Policy</a>
        <a href="#" class="font-medium text-white">Terms & Conditions</a>
      </nav>
      <p class="py-6 text-center text-sm text-gray-300">© 2025 VERSE AI | All Rights Reserved</p>
    </footer>
  )
}

export default Footer