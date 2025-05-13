import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer className={`${isLight 
      ? 'bg-gray-50 text-gray-800 relative overflow-hidden before:absolute before:w-full before:h-full before:content-[\'\'] before:left-0 before:top-0 before:bg-violet-500 before:rounded-full before:blur-3xl before:opacity-5 before:[box-shadow:60px_20px_100px_100px_#F9B0B9]' 
      : 'bg-gray-800 text-white'}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Department Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Department Portal</h3>
            <p className={`${isLight ? 'text-gray-600' : 'text-gray-300'} text-sm mb-4`}>
              Empowering students through education, innovation, and research excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${isLight ? 'text-pink-400 hover:text-violet-600' : 'text-gray-300 hover:text-white'}`}>
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className={`${isLight ? 'text-pink-400 hover:text-violet-600' : 'text-gray-300 hover:text-white'}`}>
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className={`${isLight ? 'text-pink-400 hover:text-violet-600' : 'text-gray-300 hover:text-white'}`}>
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/academics/certifications" className={`${isLight ? 'text-gray-600 hover:text-pink-400' : 'text-gray-300 hover:text-white'}`}>Certifications</Link>
              </li>
              <li>
                <Link to="/academics/achievements" className={`${isLight ? 'text-gray-600 hover:text-pink-400' : 'text-gray-300 hover:text-white'}`}>Achievements</Link>
              </li>
              <li>
                <Link to="/academics/research" className={`${isLight ? 'text-gray-600 hover:text-pink-400' : 'text-gray-300 hover:text-white'}`}>Research Papers</Link>
              </li>
              <li>
                <Link to="/academics/placements" className={`${isLight ? 'text-gray-600 hover:text-pink-400' : 'text-gray-300 hover:text-white'}`}>Placements</Link>
              </li>
              <li>
                <Link to="/events/seminars" className={`${isLight ? 'text-gray-600 hover:text-pink-400' : 'text-gray-300 hover:text-white'}`}>Seminars</Link>
              </li>
              <li>
                <Link to="/events/hackathon" className={`${isLight ? 'text-gray-600 hover:text-pink-400' : 'text-gray-300 hover:text-white'}`}>Hackathons</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Contact Us</h3>
            <address className={`not-italic text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              <p className="mb-2">Department of Computer Science</p>
              <p className="mb-2">University Campus</p>
              <p className="mb-2">City, State - Pincode</p>
              <p className="mb-2">
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:department@example.com" className={`${isLight ? 'hover:text-pink-400' : 'hover:text-white'}`}>department@example.com</a>
              </p>
              <p>
                <span className="font-medium">Phone:</span>{' '}
                <a href="tel:+1234567890" className={`${isLight ? 'hover:text-pink-400' : 'hover:text-white'}`}>+123 456 7890</a>
              </p>
            </address>
          </div>
        </div>
        
        <div className={`mt-8 pt-8 ${isLight ? 'border-t border-gray-200' : 'border-t border-gray-700'}`}>
          <p className={`text-center text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} Department Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 