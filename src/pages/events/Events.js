import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useTheme } from '../../contexts/ThemeContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      eventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
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

  // Card component for events
  const EventCard = ({ event }) => {
  return (
    <motion.div 
        onClick={() => {
          setSelectedEvent(event);
          setIsModalOpen(true);
        }}
        className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3]"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
            >
        {/* Card Background */}
        <div className="absolute inset-0">
                            {event.imageBase64 ? (
                                <img
                                  src={event.imageBase64}
                                  alt={event.title}
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
                                  {event.eventType}
                                </span>
                              {event.date && (
                <span className="text-sm text-white/80">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold leading-tight">
              {event.title}
            </h3>
            
            <p className="text-sm text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {event.description}
                                </p>
                            </div>
                    </div>
                  </motion.div>
    );
  };

  // Modal Component
  const DetailModal = () => {
    if (!selectedEvent) return null;

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
                {selectedEvent.imageBase64 ? (
                                <img
                    src={selectedEvent.imageBase64}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                                />
                            ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/20">
                      {selectedEvent.eventType}
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
                    {selectedEvent.eventType}
                  </span>
                  {selectedEvent.date && (
                    <span className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                      {new Date(selectedEvent.date).toLocaleDateString()}
                                </span>
                  )}
                              </div>

                <h3 className={`text-2xl font-bold mb-4 ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  {selectedEvent.title}
                </h3>

                <p className={`mb-6 ${
                  isLight ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {selectedEvent.description}
                                </p>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedEvent.location}
                  </div>
                              )}
                            </div>
                          </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  // Get unique event types
  const eventTypes = ['ALL', ...new Set(events.map(event => event.eventType))];

  // Filter events based on active tab
  const filteredEvents = activeTab === 'ALL' 
    ? events 
    : events.filter(event => event.eventType === activeTab);

  return (
    <div className={`min-h-screen ${isLight 
      ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
      : 'bg-[#030014] bg-grid-pattern'}`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isLight 
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
              : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
          }`}>
            Events
          </h1>
          <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Stay updated with the latest happenings in our department
          </p>
        </motion.div>

        {/* Event Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <nav className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 backdrop-blur-lg rounded-lg" aria-label="Tabs">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeTab === type
                    ? isLight
                      ? 'bg-violet-100 text-violet-800 shadow-lg'
                      : 'bg-white/10 text-white shadow-lg'
                    : isLight
                      ? 'text-gray-600 hover:text-violet-800 hover:bg-violet-50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {type}
              </button>
            ))}
          </nav>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              isLight ? 'border-violet-600' : 'border-violet-400'
            }`}></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>
              No events found for {activeTab === 'ALL' ? 'any category' : activeTab}.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid gap-8 md:grid-cols-3"
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <DetailModal />

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
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Events; 