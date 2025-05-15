import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import FacultySection from '../../components/sections/FacultySection';
import { ContainerScroll } from '../../components/ui/container-scroll-animation';
import { AnimatedTestimonials } from '../../components/ui/animated-testimonials';
import { TextHoverEffect } from '../../components/ui/text-hover-effect';


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
  const [facultyData, setFacultyData] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
    fetchRecentEvents();
    fetchActiveNotifications();
    fetchFacultyData();
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
    // Create a more consistent design language matching the site's aesthetic
    switch (type) {
      case 'success':
        return isLight
          ? 'border-l-4 border-emerald-500 text-emerald-800 bg-gradient-to-r from-emerald-50/80 to-teal-50/90'
          : 'border-l-4 border-emerald-500 text-emerald-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
      case 'warning':
        return isLight
          ? 'border-l-4 border-amber-500 text-amber-800 bg-gradient-to-r from-amber-50/80 to-yellow-50/90'
          : 'border-l-4 border-amber-500 text-amber-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
      case 'error':
        return isLight
          ? 'border-l-4 border-rose-500 text-rose-800 bg-gradient-to-r from-rose-50/80 to-red-50/90'
          : 'border-l-4 border-rose-500 text-rose-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
      default: // info
        return isLight
          ? 'border-l-4 border-violet-500 text-violet-800 bg-gradient-to-r from-violet-50/80 to-indigo-50/90'
          : 'border-l-4 border-violet-500 text-violet-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
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

  // Fetch faculty data
  const fetchFacultyData = async () => {
    setFacultyLoading(true);
    try {
      const facultyCollection = collection(db, 'faculty');
      const facultySnapshot = await getDocs(facultyCollection);
      
      if (facultySnapshot.empty) {
        // Use fallback data if no records found
        setFacultyData(getFallbackFacultyData());
      } else {
        const facultyList = facultySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Faculty Member",
            designation: data.position || "Faculty", 
            quote: data.quote || data.specialization || "Faculty member in the Department of Computer Science & Design",
            src: data.imageBase64 || null
          };
        });
        
        setFacultyData(facultyList);
      }
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      // Use fallback data in case of error
      setFacultyData(getFallbackFacultyData());
    } finally {
      setFacultyLoading(false);
    }
  };

  // Fallback faculty data if database fetch fails
  const getFallbackFacultyData = () => {
    return [
      {
        id: "1",
        quote: "Dedicated to advancing computer science education and research, with a focus on artificial intelligence and machine learning.",
        name: "Dr. Sarah Chen",
        designation: "Associate Professor",
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2376&auto=format&fit=crop"
      },
      {
        id: "2",
        quote: "Passionate about teaching programming fundamentals and developing the next generation of software engineers.",
        name: "Michael Rodriguez",
        designation: "Assistant Professor",
        src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
      },
      {
        id: "3",
        quote: "Research interests include human-computer interaction, UI/UX design, and accessibility in technology.",
        name: "Dr. Emily Watson",
        designation: "Professor",
        src: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=2574&auto=format&fit=crop"
      },
      {
        id: "4",
        quote: "Specializing in cybersecurity and network systems with over 15 years of industry experience.",
        name: "Dr. James Kim",
        designation: "Professor",
        src: "https://images.unsplash.com/photo-1577880216142-8549e9488dad?q=80&w=2670&auto=format&fit=crop"
      },
      {
        id: "5",
        quote: "Focused on data science and analytics, bringing real-world projects into the classroom.",
        name: "Lisa Thompson",
        designation: "Associate Professor",
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2522&auto=format&fit=crop"
      }
    ];
  };

  return (
    <div className={`${isLight 
      ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
      : 'bg-[#030014] bg-grid-pattern'}`}>
      
      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none"
          >
            {(() => {
              try {
                const currentNotification = notifications[currentNotificationIndex];
                console.log('Rendering notification:', currentNotification);
                
                return (
                      <motion.div
                    className="pointer-events-auto"
                    initial={{ y: 100, scale: 0.8, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      scale: 1, 
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                        mass: 0.9
                      }
                    }}
                    exit={{ 
                      y: 20, 
                      scale: 0.9, 
                      opacity: 0,
                      transition: { duration: 0.3 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* 3D rotation wrapper */}
                    <motion.div
                      whileHover={{ 
                        rotateX: 5, 
                        rotateY: -5,
                        transition: { duration: 0.3 }
                      }}
                      style={{ perspective: 800 }}
                    >
                      {/* Main notification container */}
                      <div 
                        className={`relative overflow-hidden max-w-md w-full rounded-3xl shadow-2xl ${
                          isLight 
                            ? 'bg-white/90 text-gray-800 backdrop-blur-lg'
                            : 'bg-black/60 text-gray-100 backdrop-blur-lg'
                        }`}
                        style={{
                          boxShadow: isLight 
                            ? '0 10px 40px -10px rgba(124, 58, 237, 0.3), 0 0 80px -40px rgba(56, 189, 248, 0.4), 0 0 2px 1px rgba(124, 58, 237, 0.05)' 
                            : '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 80px -40px rgba(124, 58, 237, 0.4), 0 0 2px 1px rgba(124, 58, 237, 0.1)'
                        }}
                      >
                        {/* Decorative corner elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16">
                          <motion.div 
                            className="absolute inset-0 bg-violet-500 rounded-full mix-blend-screen opacity-30 blur-xl"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.2, 0.3]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 translate-x-16 translate-y-16">
                          <motion.div 
                            className="absolute inset-0 bg-cyan-400 rounded-full mix-blend-screen opacity-30 blur-xl"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.1, 0.3]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5
                            }}
                          />
                        </div>
                        
                        {/* Animated glow background */}
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.div 
                            className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-500/10 to-cyan-600/20 opacity-40 blur-3xl"
                            animate={{ 
                              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ 
                              duration: 8, 
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut" 
                            }}
                            style={{ backgroundSize: '200% 200%' }}
                          />
                        </div>
                        
                        {/* Premium border */}
                        <div 
                          className="absolute inset-0 rounded-3xl pointer-events-none"
                          style={{
                            border: isLight 
                              ? '1px solid rgba(255, 255, 255, 0.5)' 
                              : '1px solid rgba(255, 255, 255, 0.05)',
                            backgroundImage: isLight
                              ? 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))'
                              : 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(20, 20, 20, 0.7))'
                          }}
                        />
                        
                        {/* Content container with inner shadow */}
                        <div 
                          className="relative p-7"
                          style={{
                            boxShadow: isLight 
                              ? 'inset 0 1px 1px rgba(255, 255, 255, 0.6)' 
                              : 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {/* Top line decoration */}
                          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                          
                          {/* Header area */}
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex space-x-1.5">
                              {notifications.map((_, index) => (
                                <motion.div 
                                  key={index} 
                                  className={`w-2 h-2 rounded-full ${
                                    index === currentNotificationIndex 
                                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500' 
                                      : isLight ? 'bg-gray-200' : 'bg-gray-700'
                                  }`}
                                  animate={index === currentNotificationIndex ? {
                                    scale: [1, 1.4, 1],
                                    boxShadow: [
                                      '0 0 0 0 rgba(139, 92, 246, 0)',
                                      '0 0 0 3px rgba(139, 92, 246, 0.3)',
                                      '0 0 0 0 rgba(139, 92, 246, 0)'
                                    ]
                                  } : {}}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                  }}
                                />
                              ))}
                            </div>
                            
                            {/* Elegant progress bar */}
                            <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        key={currentNotificationIndex}
                                style={{
                                  boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)'
                                }}
                      />
                    </div>

                            {/* Close Button with glow effect */}
                            <motion.button
                              onClick={() => setShowNotification(false)}
                              className={`relative rounded-full p-1.5 flex items-center justify-center overflow-hidden ${
                                isLight 
                                  ? 'bg-gray-100/50 hover:bg-gray-100'
                                  : 'bg-gray-800/50 hover:bg-gray-800'
                              } backdrop-blur-sm transition-colors group`}
                              whileHover={{ rotate: 90, scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500/20 to-cyan-500/20"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              />
                              <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </motion.button>
                        </div>

                          {/* Content with sequential animation and line decoration */}
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                            }}
                            className="relative"
                          >
                            {/* Left line decoration */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
                            
                            <div className="pl-4">
                              <motion.h3 
                                className="text-xl font-medium mb-3"
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
                                }}
                              >
                            {currentNotification.title}
                              </motion.h3>
                              
                              <motion.p 
                                className="text-sm opacity-85 leading-relaxed font-light"
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
                                }}
                              >
                            {currentNotification.message}
                              </motion.p>
                              
                              {/* Timeline indicator */}
                              <motion.div 
                                className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400"
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut", delay: 0.1 } }
                                }}
                              >
                                <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-violet-100' : 'bg-violet-900'} mr-2 flex items-center justify-center`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      </div>
                                <span>Just now</span>
                              </motion.div>
                    </div>
                          </motion.div>
                  </div>
                      </div>
                    </motion.div>
                  </motion.div>
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

        <div className="container mx-auto px-4 py-20 relative w-full">
          <div className="flex flex-col overflow-hidden">
            <div className="mx-auto mb-[-60px]">
              <TextHoverEffect text="PESITM" duration={0.3} />
            </div>
            
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
          <div className="container mx-auto px-4 py-20">
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
                Our Faculty
              </h2>
              <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Meet the brilliant minds shaping the future of computer science and design
              </p>
            </motion.div>
            
            {facultyLoading ? (
              <div className="flex justify-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                  isLight ? 'border-violet-600' : 'border-violet-400'
                }`}></div>
              </div>
            ) : facultyData.length === 0 ? (
              <div className="text-center py-12">
                <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No faculty information available at the moment.</p>
              </div>
            ) : (
              <>
                <AnimatedTestimonials testimonials={facultyData} autoplay={true} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section with 3D Marquee */}
    

       

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
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .animate-gradient-x {
          animation: gradient-x 3s linear infinite;
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage; 