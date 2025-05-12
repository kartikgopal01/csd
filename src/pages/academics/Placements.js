import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { motion } from 'framer-motion';

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
      
      // Sort by package (highest first)
      placementsData.sort((a, b) => {
        return (b.package || 0) - (a.package || 0);
      });
      
      setPlacements(placementsData);
      
      // Calculate statistics
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
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Placements
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Explore the career achievements of our students.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-10">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Placements
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {stats.totalPlacements}
                </dd>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Average Package
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  ₹{stats.averagePackage.toFixed(2)} LPA
                </dd>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Highest Package
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  ₹{stats.highestPackage.toFixed(2)} LPA
                </dd>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Companies
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {stats.companies}
                </dd>
              </div>
            </motion.div>
          </dl>
        </div>

        {/* Placements List */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Placement Records</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : placements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No placement records found.</p>
            </div>
          ) : (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package (LPA)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {placements.map((placement) => (
                    <motion.tr
                      key={placement.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {placement.studentImage ? (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={placement.studentImage} alt="" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-700 font-medium">
                                {placement.studentName ? placement.studentName.charAt(0).toUpperCase() : 'S'}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {placement.studentName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {placement.companyLogo ? (
                            <div className="flex-shrink-0 h-8 w-8 mr-3">
                              <img className="h-8 w-8" src={placement.companyLogo} alt="" />
                            </div>
                          ) : null}
                          <div className="text-sm text-gray-900">{placement.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placement.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{placement.package?.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {placement.batch}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Placements; 