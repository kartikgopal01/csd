import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Animation variants
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FacultyDetail = () => {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [publications, setPublications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      try {
        // Fetch faculty details
        const facultyRef = doc(db, 'faculty', id);
        const facultySnap = await getDoc(facultyRef);
        
        if (facultySnap.exists()) {
          setFaculty({ id: facultySnap.id, ...facultySnap.data() });
          
          // Fetch faculty publications
          const publicationsQuery = query(
            collection(db, 'research'),
            where('facultyId', '==', id)
          );
          const publicationsSnap = await getDocs(publicationsQuery);
          const publicationsData = publicationsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPublications(publicationsData);

          // Fetch faculty achievements
          const achievementsQuery = query(
            collection(db, 'achievements'),
            where('facultyId', '==', id)
          );
          const achievementsSnap = await getDocs(achievementsQuery);
          const achievementsData = achievementsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAchievements(achievementsData);
        }
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacultyData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLight 
          ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
          : 'bg-[#030014] bg-grid-pattern'
      }`}>
        <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${
          isLight ? 'border-violet-600' : 'border-violet-400'
        }`}></div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLight 
          ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
          : 'bg-[#030014] bg-grid-pattern'
      }`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>Faculty Not Found</h2>
          <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
            The faculty member you're looking for doesn't exist.
          </p>
          <Link
            to="/faculty"
            className={`inline-flex items-center gap-2 mt-6 ${
              isLight
                ? 'text-violet-600 hover:text-violet-700'
                : 'text-violet-400 hover:text-violet-300'
            } font-medium transition-colors`}
          >
            ← Back to Faculty
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-24 ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 text-gray-900' 
        : 'bg-[#030014] bg-grid-pattern text-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            to="/faculty"
            className={`inline-flex items-center gap-2 ${
              isLight
                ? 'text-violet-600 hover:text-violet-700'
                : 'text-violet-400 hover:text-violet-300'
            } font-medium transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Faculty
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="mb-24">
          <motion.div
            variants={fadeInUpVariant}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 lg:order-1">
              <h1 className={`text-5xl font-bold mb-6 ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>{faculty.name}</h1>
              
              <p className={`text-2xl mb-8 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                {faculty.position}
              </p>
              
              <div className={`space-y-4 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                {faculty.education && (
                  <p><span className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>Education:</span> {faculty.education}</p>
                )}
                {faculty.specialization && (
                  <p><span className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>Specialization:</span> {faculty.specialization}</p>
                )}
                {faculty.experience && (
                  <p><span className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>Experience:</span> {faculty.experience}</p>
                )}
              </div>
              
              <div className="mt-8 flex gap-6">
                {faculty.email && (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`mailto:${faculty.email}`}
                    className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors ${
                      isLight 
                        ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' 
                        : 'bg-violet-900/30 text-violet-300 hover:bg-violet-800/30 border border-violet-800/50'
                    }`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </motion.a>
                )}
                {faculty.phone && (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`tel:${faculty.phone}`}
                    className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors ${
                      isLight 
                        ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' 
                        : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/30 border border-cyan-800/50'
                    }`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </motion.a>
                )}
              </div>
            </div>
            
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className={`aspect-square rounded-2xl overflow-hidden shadow-xl ${
                isLight ? 'shadow-violet-200/50' : 'shadow-violet-900/30'
              }`}>
                {faculty.imageBase64 ? (
                  <img 
                    src={faculty.imageBase64} 
                    alt={faculty.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    isLight 
                      ? 'bg-gradient-to-br from-violet-100 to-cyan-100' 
                      : 'bg-gradient-to-br from-violet-900/50 to-cyan-900/50'
                  }`}>
                    <span className={`text-8xl font-bold ${
                      isLight ? 'text-violet-400' : 'text-white/80'
                    }`}>
                      {faculty.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quote Section */}
        {faculty.quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-24 text-center"
          >
            <div className={`px-8 py-12 rounded-2xl relative ${
              isLight 
                ? 'bg-white/60 backdrop-blur-sm shadow-xl shadow-violet-100/30' 
                : 'bg-white/5 backdrop-blur-lg border border-white/10'
            }`}>
              <div className="absolute top-6 left-10 text-6xl opacity-30">
                <span className={isLight ? 'text-violet-300' : 'text-violet-600'}>❝</span>
              </div>
              <blockquote className={`text-3xl font-light italic z-10 relative ${
                isLight ? 'text-gray-700' : 'text-gray-300'
              }`}>
                "{faculty.quote}"
              </blockquote>
              <div className="absolute bottom-6 right-10 text-6xl opacity-30">
                <span className={isLight ? 'text-violet-300' : 'text-violet-600'}>❞</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Publications Section */}
        {publications.length > 0 && (
          <motion.div
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className={`text-3xl font-bold mb-12 ${
              isLight 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>Research Publications</h2>
            
            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {publications.map((pub, index) => (
                <motion.div
                  key={pub.id}
                  variants={fadeInUpVariant}
                  className={`rounded-xl p-6 transition-all duration-300 h-full ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isLight ? 'text-violet-800' : 'text-violet-300'
                  }`}>{pub.title}</h3>
                  
                  <p className={`mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{pub.description}</p>
                  
                  {pub.date && (
                    <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                      Published: {new Date(pub.date).toLocaleDateString()}
                    </p>
                  )}
                  
                  {pub.link && (
                    <a 
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block mt-4 ${
                        isLight 
                          ? 'text-violet-600 hover:text-violet-700' 
                          : 'text-violet-400 hover:text-violet-300'
                      } transition-colors`}
                    >
                      Read Publication →
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <motion.div
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl font-bold mb-12 ${
              isLight 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>Achievements</h2>
            
            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  variants={fadeInUpVariant}
                  className={`rounded-xl p-6 transition-all duration-300 h-full ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isLight ? 'text-cyan-800' : 'text-cyan-300'
                  }`}>{achievement.title}</h3>
                  
                  <p className={`mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{achievement.description}</p>
                  
                  {achievement.date && (
                    <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
      
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

export default FacultyDetail; 