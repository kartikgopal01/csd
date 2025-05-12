import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Department Achievements
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Showcasing the accomplishments of our students and faculty.
          </p>
        </motion.div>

        <div className="mt-10">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No achievements found for this category.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{achievement.studentName || achievement.facultyName}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {achievement.achievementType}
                          </span>
                          {achievement.date && (
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {achievement.description && (
                        <div className="mt-4">
                          <p className="text-gray-600">{achievement.description}</p>
                        </div>
                      )}
                      
                      {achievement.imageBase64 && (
                        <div className="mt-4">
                          <img 
                            src={achievement.imageBase64} 
                            alt={achievement.title}
                            className="max-h-64 rounded-lg mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 