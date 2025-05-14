import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import FacultySection from '../../components/sections/FacultySection';
import { ContainerScroll } from '../../components/ui/container-scroll-animation';

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
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchAchievements();
    fetchRecentEvents();
    fetchActiveNotifications();
  }, []);

  // Notification auto-rotation
  useEffect(() => {
    if (notifications.length > 0) {
      console.log('Setting up notification rotation with notifications:', notifications);
      setShowNotification(true);
      const interval = setInterval(() => {
        setCurrentNotificationIndex((prev) => {
          const nextIndex = prev === notifications.length - 1 ? 0 : prev + 1;
          console.log('Rotating to notification index:', nextIndex);
          return nextIndex;
        });
      }, 5000); // Rotate every 5 seconds

      return () => clearInterval(interval);
    } else {
      console.log('No notifications to display');
      setShowNotification(false);
    }
  }, [notifications]);

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

  const fetchActiveNotifications = async () => {
    try {
      console.log('Fetching active notifications...');
      const now = Timestamp.now();
      console.log('Current timestamp:', now.toDate());
      
      const notificationsRef = collection(db, 'notifications');
      
      // First try with the optimal query (requires index)
      try {
        const q = query(
          notificationsRef,
          where('active', '==', true),
          where('startDate', '<=', now),
          where('endDate', '>=', now)
        );
        
        console.log('Executing optimized query...');
        const querySnapshot = await getDocs(q);
        const activeNotifications = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Processing notification:', {
            id: doc.id,
            title: data.title,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate(),
            active: data.active,
            type: data.type,
            priority: data.priority
          });
          return {
            id: doc.id,
            ...data
          };
        });

        // Sort by priority (high -> normal -> low)
        activeNotifications.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        console.log('Setting notifications state with:', activeNotifications);
        setNotifications(activeNotifications);
      } catch (indexError) {
        // If index doesn't exist yet, fall back to a less optimal but working query
        console.log('Index not ready, falling back to client-side filtering...');
        const q = query(
          notificationsRef,
          where('active', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const activeNotifications = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(notification => {
            const start = notification.startDate?.toDate() || new Date(0);
            const end = notification.endDate?.toDate() || new Date();
            const current = now.toDate();
            return start <= current && end >= current;
          })
          .sort((a, b) => {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          });

        console.log('Setting notifications state with fallback data:', activeNotifications);
        setNotifications(activeNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Add a new useEffect to log when notifications state changes
  useEffect(() => {
    console.log('Notifications state updated:', notifications);
  }, [notifications]);

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return isLight
          ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-800'
          : 'bg-gradient-to-r from-green-500/10 to-green-500/20 border-l-4 border-green-500 text-green-400';
      case 'warning':
        return isLight
          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 text-yellow-800'
          : 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 border-l-4 border-yellow-500 text-yellow-400';
      case 'error':
        return isLight
          ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800'
          : 'bg-gradient-to-r from-red-500/10 to-red-500/20 border-l-4 border-red-500 text-red-400';
      default: // info
        return isLight
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 text-blue-800'
          : 'bg-gradient-to-r from-blue-500/10 to-blue-500/20 border-l-4 border-blue-500 text-blue-400';
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  // Card component for both events and achievements
  const Card = ({ item, type }) => {
    const isEvent = type === 'event';
    
    return (
      <motion.div
        onClick={() => {
          setSelectedItem({ ...item, type });
          setIsModalOpen(true);
        }}
        className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3]"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Card Background */}
        <div className="absolute inset-0">
          {item.imageBase64 ? (
            <img
              src={item.imageBase64}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20" />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-end text-white">
          <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-sm">
                {isEvent ? item.eventType : `${item.achievementType === 'FACULTY' ? 'Faculty' : 'Student'} Achievement`}
              </span>
              {item.date && (
                <span className="text-sm text-white/80">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold leading-tight">
              {item.title}
            </h3>
            
            <p className="text-sm text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.description}
            </p>

            {!isEvent && (
              <div className="flex items-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {(item.studentName || item.facultyName || "").split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {item.studentName || item.facultyName}
                  </p>
                  <p className="text-xs text-white/60">
                    {item.branch || "Computer Science & Design"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Modal Component
  const DetailModal = () => {
    if (!selectedItem) return null;

    const isEvent = selectedItem.type === 'event';

    return (
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative h-64 sm:h-80">
                {selectedItem.imageBase64 ? (
                  <img
                    src={selectedItem.imageBase64}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/20">
                      {isEvent ? selectedItem.eventType : 'Achievement'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isLight
                      ? 'bg-violet-100 text-violet-800'
                      : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    {isEvent ? selectedItem.eventType : `${selectedItem.achievementType === 'FACULTY' ? 'Faculty' : 'Student'} Achievement`}
                  </span>
                  {selectedItem.date && (
                    <span className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className={`text-2xl font-bold mb-4 ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  {selectedItem.title}
                </h3>

                <p className={`mb-6 ${
                  isLight ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {selectedItem.description}
                </p>

                {!isEvent && (selectedItem.studentName || selectedItem.facultyName) && (
                  <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isLight
                          ? 'bg-violet-100'
                          : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
                      }`}>
                        <span className={`text-lg font-medium ${
                          isLight ? 'text-violet-800' : 'text-white'
                        }`}>
                          {(selectedItem.studentName || selectedItem.facultyName || "").split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        {selectedItem.studentName || selectedItem.facultyName}
                      </p>
                      <p className={`text-sm ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {selectedItem.branch || "Computer Science & Design"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className={`${isLight 
      ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
      : 'bg-[#030014] bg-grid-pattern'}`}>
      
      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && notifications.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4"
          >
            {(() => {
              try {
                const currentNotification = notifications[currentNotificationIndex];
                console.log('Rendering notification:', currentNotification);
                
                return (
                  <div className={`relative max-w-4xl w-full rounded-xl shadow-lg backdrop-blur-sm ${
                    getNotificationStyles(currentNotification.type)
                  }`}>
                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-current opacity-10">
                      <motion.div
                        className="h-full bg-current opacity-50"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        key={currentNotificationIndex}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {currentNotification.type === 'success' && (
                            <div className={`rounded-full p-2 ${isLight ? 'bg-green-100' : 'bg-green-500/20'}`}>
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {currentNotification.type === 'warning' && (
                            <div className={`rounded-full p-2 ${isLight ? 'bg-yellow-100' : 'bg-yellow-500/20'}`}>
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                          )}
                          {currentNotification.type === 'error' && (
                            <div className={`rounded-full p-2 ${isLight ? 'bg-red-100' : 'bg-red-500/20'}`}>
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {currentNotification.type === 'info' && (
                            <div className={`rounded-full p-2 ${isLight ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 text-lg">
                            {currentNotification.title}
                          </h3>
                          <p className="text-sm opacity-90">
                            {currentNotification.message}
                          </p>
                          
                          {/* Priority Badge */}
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currentNotification.priority === 'high'
                                ? isLight ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-400'
                                : currentNotification.priority === 'normal'
                                ? isLight ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-400'
                                : isLight ? 'bg-gray-100 text-gray-800' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {currentNotification.priority.charAt(0).toUpperCase() + currentNotification.priority.slice(1)} Priority
                            </span>
                          </div>
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={() => {
                            console.log('Closing notification');
                            setShowNotification(false);
                          }}
                          className="flex-shrink-0 rounded-full p-1.5 hover:bg-current hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } catch (error) {
                console.error('Error rendering notification:', error);
                return null;
              }
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10 w-full">
          <div className="flex flex-col overflow-hidden">
            <ContainerScroll
              titleComponent={
                <div className="text-center">
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
                    Department of Computer Science & Design
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
                    Training the next generation of tech leaders in Computer Science and Design
                  </motion.p>
                </div>
              }
            >
              <img
                src="/linear.webp"
                alt="hero"
                height={720}
                width={1400}
                className="mx-auto rounded-2xl object-cover h-full object-left-top"
                draggable={false}
              />
            </ContainerScroll>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-40 -right-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-20 left-60 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
        </div>
        <div className="relative z-10 w-full">
          <FacultySection />
        </div>
      </section>

      {/* Recent Events Section */}
      <section className={`relative overflow-hidden min-h-screen flex items-center ${isLight ? 'bg-transparent' : 'bg-[#030014]/50'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10 w-full">
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
                <Card key={event.id} item={event} type="event" />
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
      <section className={`relative overflow-hidden min-h-screen flex items-center ${isLight ? 'bg-transparent' : 'bg-[#020010]/50'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
          <div className="absolute center-0 left-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10 w-full">
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
                <Card key={achievement.id} item={achievement} type="achievement" />
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

      {/* Modal */}
      <DetailModal />

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