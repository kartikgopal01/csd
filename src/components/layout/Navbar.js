import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HoveredLink, Menu, MenuItem, ProductItem } from '../ui/navbar-menu';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-700/50">
      <div className="flex justify-center items-center py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="relative z-50">
            <Menu setActive={setActive}>
              <Link to="/" className="px-4 py-2 text-white hover:text-white/90 flex items-center gap-2 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              
              <Link to="/about" className="px-4 py-2 text-white hover:text-white/90 flex items-center gap-2 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </Link>
              
              <MenuItem setActive={setActive} active={active} item="Academics">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-white mb-2">Certifications</h3>
                    <div className="flex flex-col space-y-2">
                      <HoveredLink href="/academics/certifications/nptel">NPTEL</HoveredLink>
                      <HoveredLink href="/academics/certifications/udemy">UDEMY</HoveredLink>
                      <HoveredLink href="/academics/certifications/springboot">SPRINGBOOT</HoveredLink>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-2">More</h3>
                    <div className="flex flex-col space-y-2">
                      <HoveredLink href="/academics/achievements">Achievements</HoveredLink>
                      <HoveredLink href="/academics/research">Research Papers</HoveredLink>
                      <HoveredLink href="/academics/placements">Placements</HoveredLink>
                    </div>
                  </div>
                </div>
              </MenuItem>
              
              <MenuItem setActive={setActive} active={active} item="Events">
                <div className="flex flex-col space-y-2 text-sm">
                  <HoveredLink href="/events/seminars">SDP / Technical Seminar</HoveredLink>
                  <HoveredLink href="/events/hackathon">Hackathon</HoveredLink>
                  <HoveredLink href="/events/industrial">Industrial Events</HoveredLink>
                  <HoveredLink href="/events/sports">Sports</HoveredLink>
                  <HoveredLink href="/events/cultural">Cultural Events</HoveredLink>
                </div>
              </MenuItem>
              
              <Link to="/students" className="px-4 py-2 text-white hover:text-white/90 flex items-center gap-2 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Students
              </Link>
            </Menu>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-white/90 focus:outline-none transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            
            <Link to="/about" className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            
            {/* Mobile Academics Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActive(active === 'academics-mobile' ? null : 'academics-mobile')}
                className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Academics
              </button>
              
              {active === 'academics-mobile' && (
                <div className="pl-4 bg-white/10 backdrop-blur-sm rounded-lg mt-1">
                  <Link to="/academics/certifications" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Certifications
                  </Link>
                  <div className="pl-4">
                    <Link to="/academics/certifications/nptel" className="block px-3 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
                      NPTEL
                    </Link>
                    <Link to="/academics/certifications/udemy" className="block px-3 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
                      UDEMY
                    </Link>
                    <Link to="/academics/certifications/springboot" className="block px-3 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
                      SPRINGBOOT
                    </Link>
                  </div>
                  <Link to="/academics/achievements" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Achievements
                  </Link>
                  <Link to="/academics/research" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Research Papers
                  </Link>
                  <Link to="/academics/placements" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Placements
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile Events Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActive(active === 'events-mobile' ? null : 'events-mobile')}
                className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Events
              </button>
              
              {active === 'events-mobile' && (
                <div className="pl-4 bg-white/10 backdrop-blur-sm rounded-lg mt-1">
                  <Link to="/events/seminars" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    SDP / Technical Seminar
                  </Link>
                  <Link to="/events/hackathon" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Hackathon
                  </Link>
                  <Link to="/events/industrial" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Industrial Events
                  </Link>
                  <Link to="/events/sports" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Sports
                  </Link>
                  <Link to="/events/cultural" className="block px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200">
                    Cultural Events
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/students" className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 hover:text-white/90 transition-all duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Students
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar; 