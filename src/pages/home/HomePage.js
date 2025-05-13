import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import FacultySection from '../../components/sections/FacultySection';

// Animation variants for text slide
const textSlideVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const HomePage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const videoRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchAchievements();
    fetchRecentEvents();
  }, []);

  const fetchAchievements = async () => {
    try {
      const achievementsCollection = collection(db, 'achievements');
      const achievementsSnapshot = await getDocs(achievementsCollection);
      const achievementsData = achievementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date (newest first) and take only the latest 3
      achievementsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setAchievements(achievementsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent events
  const fetchRecentEvents = async () => {
    setEventsLoading(true);
    try {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      eventsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      setRecentEvents(eventsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isLight 
      ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
      : 'bg-[#030014] bg-grid-pattern'}`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-block px-6 py-2 rounded-full text-sm font-medium mb-8 ${
                isLight 
                  ? 'bg-violet-100 text-violet-800' 
                  : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
              }`}
            >
              Computer Science & Design Department
            </motion.div>

            <motion.h1 
              className={`text-5xl md:text-7xl font-bold mb-8 ${
                isLight 
                  ? 'text-gray-900' 
                  : 'text-white'
              }`}
            >
              <span className="block">Empowering Students to</span>
              <span className={`block ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>
                Code, Create & Innovate
              </span>
            </motion.h1>

            <motion.p 
              className={`text-xl mb-12 ${
                isLight ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              Training the next generation of tech leaders in computer science and design
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                to="#contact-form"
                className={`px-8 py-4 rounded-full font-medium transition-all duration-300 ${
                  isLight
                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-violet-500/25'
                    : 'bg-violet-500 text-white hover:bg-violet-400 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50'
                }`}
              >
                Start Learning
              </Link>
              <Link 
                to="/academics/achievements"
                className={`px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  isLight
                    ? 'bg-white text-gray-800 hover:bg-gray-50 shadow-lg'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                View Achievements
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto mt-24"
          >
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 rounded-2xl p-8 ${
              isLight
                ? 'bg-white/70 shadow-xl backdrop-blur-xl'
                : 'bg-white/5 border border-white/10 backdrop-blur-xl'
            }`}>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isLight ? 'text-violet-600' : 'text-violet-400'
                }`}>500+</div>
                <div className={isLight ? 'text-gray-600' : 'text-gray-400'}>Students</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isLight ? 'text-cyan-600' : 'text-cyan-400'
                }`}>50+</div>
                <div className={isLight ? 'text-gray-600' : 'text-gray-400'}>Faculty</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isLight ? 'text-pink-600' : 'text-pink-400'
                }`}>100%</div>
                <div className={isLight ? 'text-gray-600' : 'text-gray-400'}>Placement</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isLight ? 'text-purple-600' : 'text-purple-400'
                }`}>20+</div>
                <div className={isLight ? 'text-gray-600' : 'text-gray-400'}>Labs</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-40 -right-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-20 left-60 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
        </div>
        <div className="relative z-10">
          <FacultySection />
        </div>
      </section>

      {/* Recent Events Section */}
      <section className={`relative overflow-hidden py-20 ${isLight ? 'bg-transparent' : 'bg-[#030014]/50'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}>
              Recent Events
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Stay updated with the latest happenings in our department
            </p>
          </motion.div>

          {eventsLoading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isLight ? 'border-violet-600' : 'border-violet-400'
              }`}></div>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No recent events found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid gap-8 md:grid-cols-3"
            >
              {recentEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className={`group rounded-2xl overflow-hidden ${
                    isLight
                      ? 'bg-white shadow-xl hover:shadow-2xl'
                      : 'bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10'
                  } transition-all duration-300`}
                >
                  {event.imageBase64 ? (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={event.imageBase64}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute inset-0 ${
                        isLight
                          ? 'bg-gradient-to-t from-white to-transparent'
                          : 'bg-gradient-to-t from-[#030014] to-transparent'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                      <span className={`text-4xl font-bold ${
                        isLight ? 'text-violet-300' : 'text-white/20'
                      }`}>{event.eventType}</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isLight
                          ? 'bg-violet-100 text-violet-800'
                          : 'bg-violet-500/20 text-violet-400'
                      }`}>
                        {event.eventType}
                      </span>
                      {event.date && (
                        <span className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    } group-hover:text-violet-500 transition-colors duration-300`}>
                      {event.title}
                    </h3>
                    <p className={`mb-4 ${
                      isLight ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/events"
              className={`inline-flex items-center gap-2 ${
                isLight
                  ? 'text-violet-600 hover:text-violet-700'
                  : 'text-violet-400 hover:text-violet-300'
              } font-medium transition-colors`}
            >
              View All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Achievements Section */}
      <section className={`relative overflow-hidden py-20 ${isLight ? 'bg-transparent' : 'bg-[#020010]/50'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
          <div className="absolute center-0 left-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}>
              Latest Achievements
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Celebrating the success of our students and faculty
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isLight ? 'border-violet-600' : 'border-violet-400'
              }`}></div>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No achievements found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid gap-8 md:grid-cols-3"
            >
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className={`group rounded-2xl overflow-hidden ${
                    isLight
                      ? 'bg-white shadow-xl hover:shadow-2xl'
                      : 'bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10'
                  } transition-all duration-300`}
                >
                  {achievement.imageBase64 && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={achievement.imageBase64}
                        alt={achievement.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        achievement.achievementType === 'FACULTY'
                          ? isLight
                            ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-cyan-500/20 text-cyan-400'
                          : isLight
                            ? 'bg-violet-100 text-violet-800'
                            : 'bg-violet-500/20 text-violet-400'
                      }`}>
                        {achievement.achievementType === 'FACULTY' ? 'Faculty' : 'Student'} Achievement
                      </span>
                      {achievement.date && (
                        <span className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    } group-hover:text-violet-500 transition-colors duration-300`}>
                      {achievement.title}
                    </h3>
                    <p className={`mb-4 ${
                      isLight ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isLight
                            ? 'bg-violet-100'
                            : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
                        }`}>
                          <span className={`font-medium ${
                            isLight ? 'text-violet-800' : 'text-white'
                          }`}>
                            {(achievement.studentName || achievement.facultyName || "").split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isLight ? 'text-gray-900' : 'text-white'
                        }`}>
                          {achievement.studentName || achievement.facultyName}
                        </p>
                        <p className={`text-xs ${
                          isLight ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {achievement.branch || "Computer Science & Design"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/academics/achievements"
              className={`inline-flex items-center gap-2 ${
                isLight
                  ? 'text-violet-600 hover:text-violet-700'
                  : 'text-violet-400 hover:text-violet-300'
              } font-medium transition-colors`}
            >
              View All Achievements
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative overflow-hidden py-12 ${isLight ? 'bg-transparent' : 'bg-[#030014]/80'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute top-0 left-1/3 w-48 h-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <img src="/icon.png" alt="CSD Logo" className="h-10 w-10" />
              <div>
                <h3 className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Computer Science & Design
                </h3>
                <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
                  PESITM, Shivamogga
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <a href="#" className={`${
                isLight ? 'text-gray-600 hover:text-violet-600' : 'text-gray-400 hover:text-violet-400'
              } transition-colors`}>About</a>
              <a href="#" className={`${
                isLight ? 'text-gray-600 hover:text-violet-600' : 'text-gray-400 hover:text-violet-400'
              } transition-colors`}>Contact</a>
              <a href="#" className={`${
                isLight ? 'text-gray-600 hover:text-violet-600' : 'text-gray-400 hover:text-violet-400'
              } transition-colors`}>Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage; 