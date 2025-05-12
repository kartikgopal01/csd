import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { Link } from 'react-router-dom';

// Animation variants for text slide
const textSlideVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
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

  // Faculty data
  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Pramod",
      position: "Associate Professor and Head of Department",
      email: "hodcsd@pestrust.edu.in",
      phone: "9886890174",
      image: null,
      education: "Ph.D. in Computer Science",
      specialization: "Artificial Intelligence, Machine Learning",
    },
    {
      id: 2,
      name: "Mrs. Ayisha Khanum",
      position: "Assistant Professor",
      email: "ayisha@pestrust.edu.in",
      phone: "",
      image: null,
      education: "M.Tech in Computer Science",
      specialization: "Programming, Data Structures",
    },
    {
      id: 3,
      name: "Mr. Shivakumar S V",
      position: "Lab Instructor",
      email: "shivakumar@pestrust.edu.in",
      phone: "",
      image: null,
      education: "B.E in Computer Science",
      specialization: "Laboratory Management",
    }
  ];

  return (
    <div className="bg-black">
      {/* Hero Section with Phenomenon Studio Style */}
      <section className="relative bg--dark overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0% 100%)' }}>
        <div className="container mx-auto px-6 py-24 text-white">
          <div className="txt txt--caption-m text-white/80 uppercase font-semibold mb-6 isview slidetop visible">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Computer Science & Design Department
            </motion.h1>
        </div>

          <div className="title mw-1040 isview textslide trd02 visible">
            <motion.div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              {["Empowering Students", "to Code, Create,", "and Innovate", "for the", "Future"].map((line, i) => (
                <div key={i} className="overflow-hidden">
        <motion.div 
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={textSlideVariants}
                    className="a-line"
                  >
                    {i === 4 ? <span className="text-orange-500">{line}</span> : line}
                  </motion.div>
              </div>
              ))}
        </motion.div>
      </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4"
            >
            <Link 
              to="#contact-form" 
              className="btn btn--orange hover--white px-8 py-4 bg-orange-500 hover:bg-white text-white hover:text-orange-500 uppercase text-sm font-bold tracking-wider rounded transition-all duration-300"
            >
              <span><b>Start Learning</b></span>
            </Link>
            <Link 
              to="/academics/achievements" 
              className="btn btn--white-light arr arr-right hover--white px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black uppercase text-sm font-bold tracking-wider rounded transition-all duration-300 flex items-center gap-2"
            >
              <span><b>View our achievements</b></span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            </motion.div>
          
          <div className="mt-16 mt-10-mob grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="col sticky isview fadein visible"
            >
              <div className="media_wrap">
                <video 
                  ref={videoRef}
                  className="w-full rounded-xl shadow-2xl" 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  autoPlay 
                  playsInline 
                  muted 
                  loop
                  poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                />
              </div>
            </motion.div>
            
            <div className="col pt-8 md:pt-16 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="txt--lead isview textslide w-full"
              >
                <h3 className="text-xl md:text-2xl font-light leading-relaxed">
                  From foundational courses to advanced specializations – training the next generation of tech leaders in computer science and design
                </h3>
              </motion.div>
              
              
              
              
            </div>
            
            <div className="col hidden md:block"></div>
            
          
          </div>
        </div>
      </section>

    

      {/* Faculty Section */}
      <div id="faculty" className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-display font-bold mb-6">Our Faculty</h2>
            <div className="h-1 w-24 bg-white/20 mx-auto"></div>
            <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
              Meet our exceptional faculty members who are dedicated to shaping the future of Computer Science & Design education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {facultyMembers.map((faculty, index) => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                      {faculty.image ? (
                        <img 
                          src={faculty.image} 
                          alt={faculty.name}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-4xl font-bold text-white/80">
                            {faculty.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{faculty.name}</h3>
                      <p className="text-lg text-gray-300 mb-4">{faculty.position}</p>
                      <p className="text-gray-400 mb-4">{faculty.education}</p>
                      <p className="text-sm text-gray-400 mb-6">
                        <span className="text-gray-300">Specialization:</span><br/>
                        {faculty.specialization}
                      </p>
                      
                      <div className="flex gap-4">
                        {faculty.email && (
                          <a 
                            href={`mailto:${faculty.email}`}
                            className="text-white/60 hover:text-white transition-colors"
                            title="Email"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                        {faculty.phone && (
                          <a 
                            href={`tel:${faculty.phone}`}
                            className="text-white/60 hover:text-white transition-colors"
                            title="Phone"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <blockquote className="text-gray-300 italic">
                      "Empowering students with the knowledge and skills to shape the future of technology and design."
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div id="recent-events" className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Recent Events</h2>
            <div className="h-1 w-24 bg-blue-500/40 mx-auto mt-4 mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the latest happenings in our department.
            </p>
          </motion.div>
          {eventsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent events found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 md:grid-cols-3"
            >
              {recentEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-xl overflow-hidden"
                >
                  {event.imageBase64 ? (
                    <div className="aspect-video rounded-lg overflow-hidden mb-6">
                      <img
                        src={event.imageBase64}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                      <span className="text-4xl font-bold text-white/30">{event.eventType}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      {event.eventType}
                    </span>
                    {event.date && (
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                  {event.description && (
                    <p className="text-gray-400 mb-4 line-clamp-3">{event.description}</p>
                  )}
                  <div className="flex items-center mt-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {(event.organizer || '').split(' ').map(n => n[0]).join('') || 'E'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{event.organizer || 'CSD Dept.'}</p>
                      <p className="text-xs text-gray-500">{event.venue || 'On Campus'}</p>
                    </div>
                  </div>
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-300 text-sm font-medium border border-blue-500/20"
                    >
                      Register
                      <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/events"
              className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors"
            >
              View All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Latest Achievements Section */}
      <div id="achievements" className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Latest Achievements</h2>
            <div className="h-1 w-24 bg-purple-500/40 mx-auto mt-4 mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Celebrating the success of our students and faculty.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No achievements found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 md:grid-cols-3"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-xl overflow-hidden"
                >
                  {achievement.imageBase64 && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-6">
                      <img
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        src={achievement.imageBase64}
                        alt={achievement.title}
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${achievement.achievementType === 'FACULTY' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {achievement.achievementType === 'STUDENTS' ? 'Student' : 'Faculty'} Achievement
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.date || achievement.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{achievement.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{achievement.description}</p>
                  <div className="flex items-center mt-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {(achievement.studentName || achievement.facultyName || "").split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{achievement.studentName || achievement.facultyName}</p>
                      <p className="text-xs text-gray-500">{achievement.branch || "Computer Science & Design"}</p>
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
            className="text-center mt-10"
          >
            <Link 
              to="/academics/achievements" 
              className="inline-flex items-center text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              View All Achievements
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-display font-bold text-white"
              >
                Ready to shape your future in Computer Science & Design?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="mt-4 text-lg text-white/80"
              >
                Join our department and gain access to state-of-the-art facilities, expert faculty, and industry connections.
              </motion.p>
            </div>
            <div className="mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row lg:justify-end gap-3"
              >
                <a
                  href="https://pestrust.edu.in/pesitm/admissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 text-white font-heading font-bold rounded-md shadow-btn transition-all hover:bg-white/20 hover:-translate-y-1 text-center border border-white/20"
                >
                  Apply Now
                </a>
                <a
                  href="https://pestrust.edu.in/pesitm/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-transparent border-2 border-white/20 text-white font-heading font-medium rounded-md transition-all hover:bg-white/10 text-center"
                >
                  Contact Us
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-black/90 border-t border-white/10 py-10 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-between gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <img src="/icon.png" alt="CSD Logo" className="h-12 w-12 mb-3 rounded-lg shadow-lg" />
            <h3 className="text-xl font-bold text-white mb-1">Computer Science & Design</h3>
            <p className="text-gray-400 text-sm mb-2">PESITM, Shivamogga</p>
            <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
            <Link to="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Events</Link>
            <Link to="/academics/achievements" className="text-gray-400 hover:text-white transition-colors text-sm">Achievements</Link>
            <Link to="/faculty" className="text-gray-400 hover:text-white transition-colors text-sm">Faculty</Link>
            <Link to="/academics/placements" className="text-gray-400 hover:text-white transition-colors text-sm">Placements</Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h4 className="text-white font-semibold mb-2">Connect</h4>
            <div className="flex gap-3">
              <a href="mailto:hodcsd@pestrust.edu.in" className="text-gray-400 hover:text-white transition-colors" title="Email"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></a>
              <a href="https://www.linkedin.com/school/pesitm/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg></a>
              <a href="https://twitter.com/pesitm" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Twitter"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 007.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 