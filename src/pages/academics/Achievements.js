import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const Achievements = () => {
  const { type } = useParams();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(type?.toUpperCase() || 'ALL');

  useEffect(() => {
    fetchAchievements();
  }, [activeTab]);

  useEffect(() => {
    if (type) {
      setActiveTab(type.toUpperCase());
    }
  }, [type]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      let achievementsQuery;
      
      if (activeTab === 'ALL') {
        achievementsQuery = collection(db, 'achievements');
      } else {
        achievementsQuery = query(
          collection(db, 'achievements'),
          where('achievementType', '==', activeTab)
        );
      }
      
      const achievementsSnapshot = await getDocs(achievementsQuery);
      const achievementsData = achievementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date (newest first)
      achievementsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'STUDENTS', label: 'Students' },
    { id: 'FACULTY', label: 'Faculty' },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6">Department Achievements</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Showcasing the accomplishments of our students and faculty.
          </p>
        </motion.div>

        <div className="mt-16">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-12"
          >
            <nav className="flex space-x-2 p-1 bg-white/5 backdrop-blur-lg rounded-lg" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300
                    ${activeTab === tab.id
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Content */}
          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : achievements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-400">No achievements found for this category.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    variants={itemVariants}
                    className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    {achievement.imageBase64 && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-6">
                        <img 
                          src={achievement.imageBase64} 
                          alt={achievement.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        achievement.achievementType === 'FACULTY' 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {achievement.achievementType}
                      </span>
                      {achievement.date && (
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{achievement.title}</h3>
                    
                    {achievement.description && (
                      <p className="text-gray-400 mb-4 line-clamp-3">{achievement.description}</p>
                    )}
                    
                    <div className="flex items-center mt-6">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {(achievement.studentName || achievement.facultyName || "").split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          {achievement.studentName || achievement.facultyName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {achievement.branch || "Computer Science & Design"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 