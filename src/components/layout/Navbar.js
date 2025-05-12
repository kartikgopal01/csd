import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HoveredLink } from '../ui/navbar-menu';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${isScrolled 
      ? 'bg-black/95 backdrop-blur-md shadow-lg'
      : 'bg-black'} 
      w-full z-50 transition-all duration-300  `}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/icon.png" alt="Department Logo" className="h-22 w-20 mr-2 drop-shadow-lg" />
          </Link>

        {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav>
              <ul className="flex gap-8 items-center">
                <li>
                  <Link to="/" className="text-white hover:text-white/90 uppercase font-semibold text-base tracking-wider transition-all duration-200">
                Home
              </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white hover:text-white/90 uppercase font-semibold text-base tracking-wider transition-all duration-200">
                About
              </Link>
                </li>
                <li>
                  <div 
                    className="flex items-center text-white hover:text-white/90 uppercase font-semibold text-base tracking-wider cursor-pointer transition-all duration-200 pt-10 pb-10"
                    onMouseEnter={() => setActive('academics')}
                    onMouseLeave={() => setActive(null)}
                  >
                    Academics
                    <svg className="ml-2 w-4 h-4 text-white/70 group-hover:text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </li>
                <li>
                  <div 
                    className="flex items-center text-white hover:text-white/90 uppercase font-semibold text-base tracking-wider cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setActive('events')}
                    onMouseLeave={() => setActive(null)}
                  >
                    Events
                    <svg className="ml-2 w-4 h-4 text-white/70 group-hover:text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </li>
                <li>
                  <Link to="/students" className="text-white hover:text-white/90 uppercase font-semibold text-base tracking-wider transition-all duration-200">
                    Students
                  </Link>
                </li>
              </ul>
            </nav>
            <Link 
              to="/contact"
              className="btn btn--orange hover--white px-8 py-3 bg-orange-500 hover:bg-white text-white hover:text-orange-500 uppercase text-base font-bold tracking-wider rounded transition-all duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden  pb-10">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-8 h-7 flex flex-col justify-between">
                <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-3' : ''}`}></span>
                <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-3' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Full-width mega dropdown menus */}
      <AnimatePresence>
        {active === 'academics' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-black/95 border-t border-white/10 overflow-hidden"
            onMouseEnter={() => setActive('academics')}
            onMouseLeave={() => setActive(null)}
          >
            <div className="container mx-auto py-12">
              <div className="flex">
                <div className="w-1/3 pr-12">
                  <div className="rounded-lg overflow-hidden h-64 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                      alt="Academics" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Academics</h3>
                  <p className="text-white/70">Discover our academic programs, achievements, and resources designed to help students excel in computer science.</p>
                </div>
                <div className="w-2/3 grid grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Certifications</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/academics/certifications/nptel" className="text-white/80 hover:text-white text-base transition-all">NPTEL</Link>
                      </li>
                      <li>
                        <Link to="/academics/certifications/udemy" className="text-white/80 hover:text-white text-base transition-all">UDEMY</Link>
                      </li>
                      <li>
                        <Link to="/academics/certifications/springboot" className="text-white/80 hover:text-white text-base transition-all">SPRINGBOOT</Link>
                      </li>
                    </ul>
                    </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/academics/achievements" className="text-white/80 hover:text-white text-base transition-all">Achievements</Link>
                      </li>
                      <li>
                        <Link to="/academics/research" className="text-white/80 hover:text-white text-base transition-all">Research Papers</Link>
                      </li>
                      <li>
                        <Link to="/academics/placements" className="text-white/80 hover:text-white text-base transition-all">Placements</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Programs</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/academics/undergraduate" className="text-white/80 hover:text-white text-base transition-all">Undergraduate</Link>
                      </li>
                      <li>
                        <Link to="/academics/postgraduate" className="text-white/80 hover:text-white text-base transition-all">Postgraduate</Link>
                      </li>
                      <li>
                        <Link to="/academics/phd" className="text-white/80 hover:text-white text-base transition-all">PhD</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {active === 'events' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-black/95 border-t border-white/10 overflow-hidden"
            onMouseEnter={() => setActive('events')}
            onMouseLeave={() => setActive(null)}
          >
            <div className="container mx-auto py-12">
              <div className="flex">
                <div className="w-1/3 pr-12">
                  <div className="rounded-lg overflow-hidden h-64 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1700&q=80" 
                      alt="Events" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Events</h3>
                  <p className="text-white/70">Explore our technical and non-technical events designed to enhance student learning and professional development.</p>
                </div>
                <div className="w-2/3 grid grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Technical Events</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/events/seminars" className="text-white/80 hover:text-white text-base transition-all">SDP / Technical Seminar</Link>
                      </li>
                      <li>
                        <Link to="/events/hackathon" className="text-white/80 hover:text-white text-base transition-all">Hackathon</Link>
                      </li>
                      <li>
                        <Link to="/events/workshops" className="text-white/80 hover:text-white text-base transition-all">Workshops</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Non-Technical Events</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/events/cultural" className="text-white/80 hover:text-white text-base transition-all">Cultural Events</Link>
                      </li>
                      <li>
                        <Link to="/events/sports" className="text-white/80 hover:text-white text-base transition-all">Sports</Link>
                      </li>
                      <li>
                        <Link to="/events/clubs" className="text-white/80 hover:text-white text-base transition-all">Club Activities</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Industry Connect</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/events/industrial" className="text-white/80 hover:text-white text-base transition-all">Industrial Visits</Link>
                      </li>
                      <li>
                        <Link to="/events/guest-lectures" className="text-white/80 hover:text-white text-base transition-all">Guest Lectures</Link>
                      </li>
                      <li>
                        <Link to="/events/internships" className="text-white/80 hover:text-white text-base transition-all">Internship Drive</Link>
                      </li>
                    </ul>
          </div>
        </div>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-6 py-8">
              <nav className="flex flex-col gap-6">
                <Link 
                  to="/"
                  className="text-white uppercase font-semibold text-lg tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
              Home
            </Link>
                <Link 
                  to="/about" 
                  className="text-white uppercase font-semibold text-lg tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
              About
            </Link>
                <div>
              <button
                onClick={() => setActive(active === 'academics-mobile' ? null : 'academics-mobile')}
                    className="flex items-center justify-between w-full text-white uppercase font-semibold text-lg tracking-wider"
              >
                    <span>Academics</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${active === 'academics-mobile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
                  <AnimatePresence>
              {active === 'academics-mobile' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 mt-2 border-l border-white/20 space-y-2"
                      >
                        <Link to="/academics/achievements" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    Achievements
                  </Link>
                        <Link to="/academics/research" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    Research Papers
                  </Link>
                        <Link to="/academics/placements" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    Placements
                  </Link>
                      </motion.div>
              )}
                  </AnimatePresence>
            </div>
            
                <div>
              <button
                onClick={() => setActive(active === 'events-mobile' ? null : 'events-mobile')}
                    className="flex items-center justify-between w-full text-white uppercase font-semibold text-lg tracking-wider"
              >
                    <span>Events</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${active === 'events-mobile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
                  <AnimatePresence>
              {active === 'events-mobile' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 mt-2 border-l border-white/20 space-y-2"
                      >
                        <Link to="/events/seminars" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    SDP / Technical Seminar
                  </Link>
                        <Link to="/events/hackathon" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    Hackathon
                  </Link>
                        <Link to="/events/cultural" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    Cultural Events
                  </Link>
                      </motion.div>
              )}
                  </AnimatePresence>
            </div>
            
                <Link 
                  to="/students" 
                  className="text-white uppercase font-semibold text-lg tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
              Students
            </Link>
                
                <Link 
                  to="/contact"
                  className="inline-block btn btn--orange hover--white px-6 py-3 bg-orange-500 hover:bg-white text-white hover:text-orange-500 uppercase text-sm font-bold tracking-wider rounded transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar; 