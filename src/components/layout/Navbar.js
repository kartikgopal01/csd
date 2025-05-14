import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HoveredLink } from '../ui/navbar-menu';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { HomeIcon, UserGroupIcon, AcademicCapIcon, CalendarIcon, UserIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { RiMenu3Fill, RiCloseFill } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';

// Create a context to manage dropdown state
const DropdownContext = createContext({
  activeDropdown: null,
  setActiveDropdown: () => {},
  isClosing: false
});

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const timeoutRef = useRef(null);
  const dropdownRef = useRef({});
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle dropdown open/close with a single parent container
  const handleDropdownToggle = (name, isOpen) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isOpen) {
      setActive(name);
    } else {
      timeoutRef.current = setTimeout(() => {
        setActive(null);
      }, 100);
    }
  };

  // Context value
  const dropdownContextValue = {
    activeDropdown: active,
    setActiveDropdown: handleDropdownToggle,
    handleDropdownClose: () => handleDropdownToggle(null, false),
    isClosing: false
  };

  const navLinks = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'About', icon: UserGroupIcon, path: '/about' },
    { 
      name: 'Academics', 
      icon: AcademicCapIcon, 
      path: '/academics', 
      hasSubmenu: true,
      submenu: [
                      { name: 'Research Papers', path: '/academics/research' },
                      { name: 'Achievements', path: '/academics/achievements' },
                      { name: 'Placements', path: '/academics/placements' },
                       { name: 'NPTEL', path: '/academics/certifications/nptel' },
                      { name: 'UDEMY', path: '/academics/certifications/udemy' },
                      { name: 'SPRINGBOOT', path: '/academics/certifications/springboot' }
      ]
    },
    { 
      name: 'Events', 
      icon: CalendarIcon, 
      path: '/events', 
      hasSubmenu: true,
      submenu: [
        { name: 'Technical Events', path: '/events/technical' },
        { name: 'Cultural Events', path: '/events/cultural' },
        { name: 'Workshops', path: '/events/workshops' },
      ]
    },
    { name: 'Students', icon: UserIcon, path: '/students' },
    { name: 'Contact', icon: PhoneIcon, path: '/contact' },
  ];

  return (
    <DropdownContext.Provider value={dropdownContextValue}>
      <header className={`${isScrolled 
        ? isLight ? 'bg-gray-50/95 backdrop-blur-md' : 'bg-black/95 backdrop-blur-md'
        : isLight ? 'bg-gray-50 relative overflow-hidden before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:top-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' : 'bg-black'} 
        w-full z-[90] transition-all duration-300`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 relative z-10 rounded-full">
          <div className="flex justify-center items-center">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl ${isLight 
                  ? 'bg-white/70 text-pink-500 hover:bg-pink-50/50' 
                  : 'bg-white/10 text-white hover:bg-white/20'} backdrop-blur-sm transition-all duration-300`}
              >
                {isMobileMenuOpen ? (
                  <RiCloseFill className="w-6 h-6" />
                ) : (
                  <RiMenu3Fill className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <nav className={`rounded-full px-3 py-1 relative ${isLight 
                ? 'bg-gray-50 border border-pink-200 hover:border-violet-300' 
                : 'bg-white/5 border border-white/20 hover:border-white/40'} transition-all duration-300`}>
                <ul className="flex gap-2 lg:gap-3 items-center">
                  {navLinks.map((link) => (
                    <li key={link.name} className="relative">
                      {link.hasSubmenu ? (
                        <div 
                          ref={el => dropdownRef.current[link.name.toLowerCase()] = el}
                          className="dropdown-container"
                          onMouseEnter={() => handleDropdownToggle(link.name.toLowerCase(), true)}
                          onMouseLeave={() => handleDropdownToggle(link.name.toLowerCase(), false)}
                        >
                          <div 
                            className={`group relative overflow-visible rounded-full px-4 py-1.5 ${isLight 
                              ? 'text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
                              : 'text-white/80 hover:text-white'} font-medium text-sm tracking-wide cursor-pointer transition-all duration-300 flex items-center`}
                          >
                            <span className="relative z-10">{link.name}</span>
                            <svg className="ml-1.5 w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <Link 
                          to={link.path}
                          className={`group relative overflow-hidden rounded-full px-4 py-1.5 ${isLight 
                            ? 'text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
                            : 'text-white/80 hover:text-white'} font-medium text-sm tracking-wide transition-all duration-300`}
                        >
                          <span className="relative z-10">{link.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`md:hidden mt-4 rounded-2xl ${isLight 
                  ? 'bg-white/70 backdrop-blur-xl border border-white/20' 
                  : 'bg-black/70 backdrop-blur-xl border border-white/10'} overflow-hidden`}
              >
                <nav className="p-3">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <div key={link.name}>
                        {link.hasSubmenu ? (
                          <div>
                            <button
                              onClick={() => setActiveSubmenu(activeSubmenu === link.name ? null : link.name)}
                              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl ${isLight 
                                ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50' 
                                : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                            >
                              <span className="font-medium">{link.name}</span>
                              <MdKeyboardArrowDown 
                                className={`w-5 h-5 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} 
                              />
                            </button>
                            <AnimatePresence>
                              {activeSubmenu === link.name && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2 ml-4 space-y-2"
                                >
                                  {link.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.path}
                                      className={`block px-4 py-3 rounded-xl ${isLight 
                                        ? 'bg-white/30 text-pink-500 hover:bg-pink-50/50' 
                                        : 'bg-white/5 text-white/90 hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl ${isLight 
                              ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50' 
                              : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="font-medium">{link.name}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mega menus */}
      <AnimatePresence>
        {active === 'academics' && (
          <div 
            className="mega-menu-container"
            onMouseEnter={() => handleDropdownToggle('academics', true)}
            onMouseLeave={() => handleDropdownToggle('academics', false)}
          >
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-full fixed top-[60px] left-0 ${isLight 
                ? 'bg-white/95 border-y border-pink-200' 
                : 'bg-black/95 border-y border-white/10'} backdrop-blur-md z-50`}
            >
              <div className="container mx-auto py-6">
                <div className="grid grid-cols-3 gap-6">
                  {[
                   
                    { title: 'Resources', items: [
                      { name: 'Research Papers', path: '/academics/research' },
                      { name: 'Achievements', path: '/academics/achievements' },
                      { name: 'Placements', path: '/academics/placements' }
                    ]},
                    { title: 'Certifications', items: [
                      { name: 'NPTEL', path: '/academics/certifications/nptel' },
                      { name: 'UDEMY', path: '/academics/certifications/udemy' },
                      { name: 'SPRINGBOOT', path: '/academics/certifications/springboot' }
                    ]}
                  ].map((section, idx) => (
                    <div key={idx} className="px-4">
                      <h4 className={`text-lg font-semibold mb-4 ${isLight ? 'text-pink-400' : 'text-white'}`}>
                        {section.title}
                      </h4>
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.path}
                              className={`block px-4 py-2 rounded-xl ${isLight 
                                ? 'text-pink-400 hover:text-violet-600 hover:bg-violet-50/50' 
                                : 'text-white/80 hover:text-white hover:bg-white/10'} transition-all duration-300`}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {active === 'events' && (
          <div 
            className="mega-menu-container"
            onMouseEnter={() => handleDropdownToggle('events', true)}
            onMouseLeave={() => handleDropdownToggle('events', false)}
          >
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-full fixed top-[60px] left-0 ${isLight 
                ? 'bg-white/95 border-y border-pink-200' 
                : 'bg-black/95 border-y border-white/10'} backdrop-blur-md z-50`}
            >
              <div className="container mx-auto py-6">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { title: 'Technical Events', items: [
                      { name: 'SDP / Technical Seminar', path: '/events/seminars' },
                      { name: 'Hackathon', path: '/events/hackathon' },
                      { name: 'Workshops', path: '/events/workshops' }
                    ]},
                    { title: 'Non-Technical Events', items: [
                      { name: 'Cultural Events', path: '/events/cultural' },
                      { name: 'Sports', path: '/events/sports' },
                      { name: 'Club Activities', path: '/events/clubs' }
                    ]},
                    { title: 'Industry Connect', items: [
                      { name: 'Industrial Visits', path: '/events/industrial' },
                      { name: 'Guest Lectures', path: '/events/guest-lectures' },
                      { name: 'Internship Drive', path: '/events/internships' }
                    ]}
                  ].map((section, idx) => (
                    <div key={idx} className="px-4">
                      <h4 className={`text-lg font-semibold mb-4 ${isLight ? 'text-pink-400' : 'text-white'}`}>
                        {section.title}
                      </h4>
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.path}
                              className={`block px-4 py-2 rounded-xl ${isLight 
                                ? 'text-pink-400 hover:text-violet-600 hover:bg-violet-50/50' 
                                : 'text-white/80 hover:text-white hover:bg-white/10'} transition-all duration-300`}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add CSS for dropdown containers */}
      <style jsx>{`
        .dropdown-container {
          position: relative;
          display: inline-block;
        }
        .mega-menu-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
        }
      `}</style>

      {/* Scrolled Mobile Navigation */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ width: "auto", y: -100 }}
            animate={{ 
              width: "auto",
              y: 0,
              transition: {
                width: { duration: 0.3, ease: "easeInOut" },
                y: { duration: 0.3, ease: "easeInOut" }
              }
            }}
            exit={{ width: "auto", y: -100 }}
            className={`fixed top-4 left-4 right-4 md:hidden ${isLight 
              ? 'bg-white/70 backdrop-blur-xl border border-white/20' 
              : 'bg-black/70 backdrop-blur-xl border border-white/10'} 
              rounded-2xl z-[100] shadow-lg transition-all duration-300`}
          >
            <nav className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <span className={`text-lg font-medium ${isLight ? 'text-pink-500' : 'text-white'}`}>
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-full ${isLight 
                    ? 'bg-pink-100/50 text-pink-500 hover:bg-pink-200/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'} backdrop-blur-sm`}
                >
                  {isMobileMenuOpen ? (
                    <RiCloseFill className="w-6 h-6" />
                  ) : (
                    <RiMenu3Fill className="w-6 h-6" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    {navLinks.map((link) => (
                      <div key={link.name} className="mb-2">
                        {link.hasSubmenu ? (
                          <div>
                            <button
                              onClick={() => setActiveSubmenu(activeSubmenu === link.name ? null : link.name)}
                              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl ${isLight 
                                ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50' 
                                : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                            >
                              <span className="font-medium">{link.name}</span>
                              <MdKeyboardArrowDown 
                                className={`w-5 h-5 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} 
                              />
                            </button>
                            <AnimatePresence>
                              {activeSubmenu === link.name && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="ml-4 mt-2 space-y-2"
                                >
                                  {link.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.path}
                                      className={`block px-4 py-3 rounded-xl ${isLight 
                                        ? 'bg-white/30 text-pink-500 hover:bg-pink-50/50' 
                                        : 'bg-white/5 text-white/90 hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl ${isLight 
                              ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50' 
                              : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="font-medium">{link.name}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Sidebar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ width: "60px" }}
            animate={{ width: isHovered ? "240px" : "60px" }}
            exit={{ width: "60px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed left-0 top-1/2 -translate-y-1/2 h-auto ${isLight 
              ? 'bg-gray-50/95 backdrop-blur-xl border-r border-y border-neutral-200' 
              : 'bg-black/95 backdrop-blur-xl border-r border-y border-white/10'} rounded-r-xl overflow-hidden z-[100] hidden md:block`}
          >
            <nav className="p-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 last:mb-0 ${isLight 
                      ? 'bg-gray-50 text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'} transition-all duration-300 relative overflow-hidden whitespace-nowrap`}
                    onClick={(e) => {
                      if (link.hasSubmenu) {
                        e.preventDefault();
                        setActiveSubmenu(activeSubmenu === link.name ? null : link.name);
                      }
                    }}
                  >
                    <link.icon className="w-5 h-5 min-w-[20px]" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 flex-1"
                    >
                      {link.name}
                    </motion.span>
                    {link.hasSubmenu && isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MdKeyboardArrowDown 
                          className={`w-5 h-5 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} 
                        />
                      </motion.div>
                    )}
                  </Link>
                  
                  {/* Sidebar Submenu */}
                  <AnimatePresence>
                    {link.hasSubmenu && activeSubmenu === link.name && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-3 mt-1 mb-2 overflow-hidden"
                      >
                        <div className="space-y-1">
                          {link.submenu.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block px-3 py-2 rounded-lg text-sm ${isLight 
                                ? 'text-pink-400 hover:text-violet-600 hover:bg-violet-50/50' 
                                : 'text-white/70 hover:text-white hover:bg-white/10'} transition-all duration-300`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownContext.Provider>
  );
};

export default Navbar; 