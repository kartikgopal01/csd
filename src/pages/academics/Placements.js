import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
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

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlacements: 0,
    averagePackage: 0,
    highestPackage: 0,
    companies: 0
  });

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const placementsCollection = collection(db, 'placements');
      const placementsSnapshot = await getDocs(placementsCollection);
      const placementsData = placementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      placementsData.sort((a, b) => {
        return (b.package || 0) - (a.package || 0);
      });
      
      setPlacements(placementsData);
      
      if (placementsData.length > 0) {
        const totalPlacements = placementsData.length;
        const totalPackage = placementsData.reduce((sum, placement) => sum + (placement.package || 0), 0);
        const averagePackage = totalPackage / totalPlacements;
        const highestPackage = Math.max(...placementsData.map(placement => placement.package || 0));
        const uniqueCompanies = new Set(placementsData.map(placement => placement.company)).size;
        
        setStats({
          totalPlacements,
          averagePackage,
          highestPackage,
          companies: uniqueCompanies
        });
      }
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6">Placements</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore the career achievements of our students.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16"
        >
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              variants={itemVariants}
              className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <dt className="text-sm font-medium text-gray-400">
                Total Placements
              </dt>
              <dd className="mt-2 text-4xl font-bold text-white">
                {stats.totalPlacements}
              </dd>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <dt className="text-sm font-medium text-gray-400">
                Average Package
              </dt>
              <dd className="mt-2 text-4xl font-bold text-white">
                ₹{stats.averagePackage.toFixed(2)} <span className="text-lg">LPA</span>
              </dd>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <dt className="text-sm font-medium text-gray-400">
                Highest Package
              </dt>
              <dd className="mt-2 text-4xl font-bold text-white">
                ₹{stats.highestPackage.toFixed(2)} <span className="text-lg">LPA</span>
              </dd>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <dt className="text-sm font-medium text-gray-400">
                Companies
              </dt>
              <dd className="mt-2 text-4xl font-bold text-white">
                {stats.companies}
              </dd>
            </motion.div>
          </dl>
        </motion.div>

        {/* Placements List */}
        <div className="mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-8"
          >
            Placement Records
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : placements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <p className="text-gray-400">No placement records found.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Package (LPA)
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Batch
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {placements.map((placement, index) => (
                      <motion.tr
                        key={placement.id}
                        variants={itemVariants}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {placement.studentImage ? (
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={placement.studentImage} 
                                  alt="" 
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {placement.studentName ? placement.studentName.charAt(0).toUpperCase() : 'S'}
                                </span>
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {placement.studentName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {placement.companyLogo ? (
                              <div className="flex-shrink-0 h-8 w-8 mr-3">
                                <img 
                                  className="h-8 w-8 object-contain" 
                                  src={placement.companyLogo} 
                                  alt="" 
                                />
                              </div>
                            ) : null}
                            <div className="text-sm text-white">{placement.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{placement.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">₹{placement.package?.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {placement.batch}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Placements; 