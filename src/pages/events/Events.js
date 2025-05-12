import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const Events = () => {
  const { type } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map URL parameters to display names
  const eventTypeMap = {
    'seminars': 'SDP / Technical Seminar',
    'hackathon': 'Hackathon',
    'industrial': 'Industrial Events',
    'sports': 'Sports',
    'cultural': 'Cultural Events'
  };

  // Get the current event type display name
  const currentEventType = type ? eventTypeMap[type] || type : 'All Events';

  useEffect(() => {
    fetchEvents();
  }, [type]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let eventsQuery;
      
      if (!type) {
        eventsQuery = collection(db, 'events');
      } else {
        eventsQuery = query(
          collection(db, 'events'),
          where('eventType', '==', eventTypeMap[type])
        );
      }
      
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date (upcoming first, then recent past events)
      eventsData.sort((a, b) => {
        const dateA = new Date(a.date || a.timestamp);
        const dateB = new Date(b.date || b.timestamp);
        const now = new Date();
        
        if ((dateA > now && dateB > now) || (dateA <= now && dateB <= now)) {
          return dateA - dateB;
        }
        
        return dateA > now ? -1 : 1;
      });
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-900 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {currentEventType}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            Discover the exciting events happening in our department.
          </p>
        </motion.div>

        {/* Event Categories */}
        <motion.div 
          variants={itemVariants}
          className="mt-10"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/events/seminars"
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                type === 'seminars' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-lg shadow-blue-500/20' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              SDP / Technical Seminar
            </Link>
            <Link 
              to="/events/hackathon"
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                type === 'hackathon' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-lg shadow-purple-500/20' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              Hackathon
            </Link>
            <Link 
              to="/events/industrial"
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                type === 'industrial' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-lg shadow-green-500/20' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              Industrial Events
            </Link>
            <Link 
              to="/events/sports"
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                type === 'sports' 
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-lg shadow-orange-500/20' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              Sports
            </Link>
            <Link 
              to="/events/cultural"
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                type === 'cultural' 
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-lg shadow-pink-500/20' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              Cultural Events
            </Link>
          </div>
        </motion.div>

        {/* Events Content */}
        <div className="mt-16">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : events.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12"
            >
              <p className="text-gray-400">No events found for this category.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div 
                variants={containerVariants}
                className="space-y-16"
              >
                {/* Upcoming Events */}
                {events.some(event => isUpcoming(event.date)) && (
                  <motion.div variants={itemVariants}>
                    <h2 className="text-2xl font-bold text-white mb-8 pl-4 border-l-4 border-blue-500">
                      Upcoming Events
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {events
                        .filter(event => isUpcoming(event.date))
                        .map((event) => (
                          <motion.div
                            key={event.id}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                          >
                            {event.imageBase64 ? (
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={event.imageBase64}
                                  alt={event.title}
                                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className="h-48 bg-gray-700/50 flex items-center justify-center">
                                <svg
                                  className="h-12 w-12 text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                                    {event.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-400">{event.venue}</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                                  {event.eventType}
                                </span>
                              </div>
                              {event.date && (
                                <p className="mt-4 text-sm text-gray-400">
                                  <span className="font-medium text-gray-300">Date:</span>{' '}
                                  {formatDate(event.date)}
                                </p>
                              )}
                              {event.description && (
                                <p className="mt-4 text-sm text-gray-400 line-clamp-3">
                                  {event.description}
                                </p>
                              )}
                              {event.registrationLink && (
                                <a
                                  href={event.registrationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-6 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 transition-all duration-300"
                                >
                                  Register Now
                                  <svg
                                    className="ml-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Past Events */}
                {events.some(event => !isUpcoming(event.date)) && (
                  <motion.div variants={itemVariants}>
                    <h2 className="text-2xl font-bold text-white mb-8 pl-4 border-l-4 border-gray-500">
                      Past Events
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {events
                        .filter(event => !isUpcoming(event.date))
                        .map((event) => (
                          <motion.div
                            key={event.id}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700/30 hover:border-gray-600/30 transition-all duration-300"
                          >
                            {event.imageBase64 ? (
                              <div className="h-48 overflow-hidden grayscale">
                                <img
                                  src={event.imageBase64}
                                  alt={event.title}
                                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className="h-48 bg-gray-700/30 flex items-center justify-center">
                                <svg
                                  className="h-12 w-12 text-gray-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                    {event.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500">{event.venue}</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400 border border-gray-600/50">
                                  {event.eventType}
                                </span>
                              </div>
                              {event.date && (
                                <p className="mt-4 text-sm text-gray-500">
                                  <span className="font-medium text-gray-400">Date:</span>{' '}
                                  {formatDate(event.date)}
                                </p>
                              )}
                              {event.description && (
                                <p className="mt-4 text-sm text-gray-500 line-clamp-3">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Events; 