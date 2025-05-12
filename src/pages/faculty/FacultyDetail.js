import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { motion } from 'framer-motion';

const FacultyDetail = () => {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [publications, setPublications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Faculty Not Found</h2>
          <p className="text-gray-400">The faculty member you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 lg:order-1">
              <h1 className="text-5xl font-bold mb-6">{faculty.name}</h1>
              <p className="text-2xl text-gray-300 mb-8">{faculty.position}</p>
              <div className="space-y-4 text-gray-300">
                <p><span className="text-white font-medium">Education:</span> {faculty.education}</p>
                <p><span className="text-white font-medium">Specialization:</span> {faculty.specialization}</p>
                {faculty.experience && (
                  <p><span className="text-white font-medium">Experience:</span> {faculty.experience}</p>
                )}
              </div>
              
              <div className="mt-8 flex gap-6">
                {faculty.email && (
                  <a 
                    href={`mailto:${faculty.email}`}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                )}
                {faculty.phone && (
                  <a 
                    href={`tel:${faculty.phone}`}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </a>
                )}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden">
                {faculty.image ? (
                  <img 
                    src={faculty.image} 
                    alt={faculty.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-8xl font-bold text-white/80">
                      {faculty.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
            </div>
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
            <blockquote className="text-3xl font-light italic text-gray-300">
              "{faculty.quote}"
            </blockquote>
          </motion.div>
        )}

        {/* Publications Section */}
        {publications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold mb-12">Research Publications</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {publications.map((pub, index) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4">{pub.title}</h3>
                  <p className="text-gray-400 mb-4">{pub.description}</p>
                  {pub.date && (
                    <p className="text-sm text-gray-500">
                      Published: {new Date(pub.date).toLocaleDateString()}
                    </p>
                  )}
                  {pub.link && (
                    <a 
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-white/60 hover:text-white transition-colors"
                    >
                      Read Publication →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-12">Achievements</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4">{achievement.title}</h3>
                  <p className="text-gray-400 mb-4">{achievement.description}</p>
                  {achievement.date && (
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FacultyDetail; 