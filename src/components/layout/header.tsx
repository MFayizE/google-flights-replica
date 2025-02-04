import React, { useState, useEffect } from "react";
import { FaBars, FaMoon, FaSun, FaTh } from "react-icons/fa";
import {
  MdOutlineFlight,
  MdOutlineHotel,
  MdOutlineExplore,
  MdOutlineHome,
  MdOutlineLuggage,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#292A2D] shadow-md border border-b border-[#d2e3fc] dark:border-[#3C4043]">
      <div className="flex items-center gap-4">
        <FaBars className="text-xl cursor-pointer text-[#5f6368] dark:text-[#E8EAED]" />

        <img
          src="https://static-00.iconduck.com/assets.00/google-icon-1024x337-2t1ovfuf.png"
          alt="Google Logo"
          className="h-6 object-contain"
        />

        <nav className="hidden md:flex gap-2 p-1">
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#d2e3fc] dark:border-[#3C4043] bg-white dark:bg-[#292A2D] text-black dark:text-[#E8EAED] font-medium">
            <MdOutlineLuggage className="text-lg text-[#1a73e8]" /> Travel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#d2e3fc] dark:border-[#3C4043] bg-white dark:bg-[#292A2D] text-black dark:text-[#E8EAED] font-medium">
            <MdOutlineExplore className="text-lg text-[#1a73e8]" /> Explore
          </button>
          <button
            onClick={goToHome}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#d2e3fc] dark:border-[#3C4043] bg-[#e8f0fe] dark:bg-[#3C4043] text-[#1a73e8] font-medium cursor-pointer"
          >
            <MdOutlineFlight className="text-lg" /> Flights
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#d2e3fc] dark:border-[#3C4043] bg-white dark:bg-[#292A2D] text-black dark:text-[#E8EAED] font-medium">
            <MdOutlineHotel className="text-lg text-[#1a73e8]" /> Hotels
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#d2e3fc] dark:border-[#3C4043] bg-white dark:bg-[#292A2D] text-black dark:text-[#E8EAED] font-medium">
            <MdOutlineHome className="text-lg text-[#1a73e8]" /> Vacation rentals
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {!isDarkMode ? (
          <FaSun
            className="text-xl cursor-pointer text-[#5f6368] dark:text-[#E8EAED]"
            title="Dark Mode"
            onClick={toggleDarkMode}
          />
        ) : (
          <FaMoon
            className="text-xl cursor-pointer text-[#5f6368] dark:text-[#E8EAED]"
            title="Light Mode"
            onClick={toggleDarkMode}
          />
        )}

        <FaTh className="text-xl cursor-pointer text-[#5f6368] dark:text-[#E8EAED]" />
        <div className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 dark:border-[#3C4043] bg-gray-500"></div>
      </div>
    </header>
  );
};

export default Header;
