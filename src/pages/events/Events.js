import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        
        // If both dates are in the future or both in the past
        if ((dateA > now && dateB > now) || (dateA <= now && dateB <= now)) {
          return dateA - dateB;
        }
        
        // If one is in the future and one in the past, future comes first
        return dateA > now ? -1 : 1;
      });
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to check if event is upcoming
  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {currentEventType}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover the exciting events happening in our department.
          </p>
        </motion.div>

        {/* Event Categories */}
        <div className="mt-10">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/events/seminars"
              className={`px-4 py-2 rounded-full text-sm font-medium ${type === 'seminars' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              SDP / Technical Seminar
            </Link>
            <Link 
              to="/events/hackathon"
              className={`px-4 py-2 rounded-full text-sm font-medium ${type === 'hackathon' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Hackathon
            </Link>
            <Link 
              to="/events/industrial"
              className={`px-4 py-2 rounded-full text-sm font-medium ${type === 'industrial' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Industrial Events
            </Link>
            <Link 
              to="/events/sports"
              className={`px-4 py-2 rounded-full text-sm font-medium ${type === 'sports' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Sports
            </Link>
            <Link 
              to="/events/cultural"
              className={`px-4 py-2 rounded-full text-sm font-medium ${type === 'cultural' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Cultural Events
            </Link>
          </div>
        </div>

        {/* Events Content */}
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found for this category.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming Events */}
              {events.some(event => isUpcoming(event.date)) && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events
                      .filter(event => isUpcoming(event.date))
                      .map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          {event.imageBase64 ? (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={event.imageBase64}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                              <svg
                                className="h-12 w-12 text-gray-400"
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
                                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                <p className="mt-1 text-sm text-gray-600">{event.venue}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {event.eventType}
                              </span>
                            </div>
                            {event.date && (
                              <p className="mt-3 text-sm text-gray-600">
                                <span className="font-medium">Date:</span> {formatDate(event.date)}
                              </p>
                            )}
                            {event.time && (
                              <p className="mt-1 text-sm text-gray-600">
                                <span className="font-medium">Time:</span> {event.time}
                              </p>
                            )}
                            {event.description && (
                              <p className="mt-3 text-sm text-gray-500 line-clamp-3">{event.description}</p>
                            )}
                            {event.registrationLink && (
                              <div className="mt-4">
                                <a
                                  href={event.registrationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                  Register Now
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {events.some(event => !isUpcoming(event.date)) && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events
                      .filter(event => !isUpcoming(event.date))
                      .map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          {event.imageBase64 ? (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={event.imageBase64}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                              <svg
                                className="h-12 w-12 text-gray-400"
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
                                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                <p className="mt-1 text-sm text-gray-600">{event.venue}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {event.eventType}
                              </span>
                            </div>
                            {event.date && (
                              <p className="mt-3 text-sm text-gray-600">
                                <span className="font-medium">Date:</span> {formatDate(event.date)}
                              </p>
                            )}
                            {event.description && (
                              <p className="mt-3 text-sm text-gray-500 line-clamp-3">{event.description}</p>
                            )}
                            {event.galleryLink && (
                              <div className="mt-4">
                                <a
                                  href={event.galleryLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                >
                                  View Gallery
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events; 