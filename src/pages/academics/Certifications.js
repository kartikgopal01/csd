import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import PDFViewer from '../../components/ui/PDFViewer';
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

const Certifications = () => {
  const { type } = useParams();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [activeTab, setActiveTab] = useState(type?.toUpperCase() || 'ALL');

  useEffect(() => {
    fetchCertifications();
  }, [activeTab]);

  useEffect(() => {
    if (type) {
      setActiveTab(type.toUpperCase());
    }
  }, [type]);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      let certificationsQuery;
      
      if (activeTab === 'ALL') {
        certificationsQuery = collection(db, 'certifications');
      } else {
        certificationsQuery = query(
          collection(db, 'certifications'),
          where('certType', '==', activeTab)
        );
      }
      
      const certificationsSnapshot = await getDocs(certificationsQuery);
      const certificationsData = certificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      certificationsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setCertifications(certificationsData);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'NPTEL', label: 'NPTEL' },
    { id: 'UDEMY', label: 'Udemy' },
    { id: 'SPRINGBOOT', label: 'SpringBoot' },
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
          <h1 className="text-5xl font-bold mb-6">Student Certifications</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Showcasing the achievements and skills acquired by our students.
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
            ) : certifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-400">No certifications found for this category.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {certifications.map((cert) => (
                  <motion.div
                    key={cert.id}
                    variants={itemVariants}
                    className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                  >
                    {cert.imageBase64 ? (
                      <div className="aspect-video">
                        <img
                          src={cert.imageBase64}
                          alt={cert.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/30">{cert.certType}</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                          {cert.certType}
                        </span>
                        {cert.date && (
                          <span className="text-xs text-gray-500">
                            {new Date(cert.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3">{cert.title}</h3>
                      
                      <div className="flex items-center mt-6">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {cert.studentName ? cert.studentName.charAt(0).toUpperCase() : 'S'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">{cert.studentName}</p>
                          <p className="text-xs text-gray-500">Computer Science & Design</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedCertification(cert)}
                        className="mt-6 w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        View Certificate
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedCertification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-white/10">
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {selectedCertification.title}
                    </h3>
                    <div className="mt-4 h-[600px] bg-white/5 rounded-lg">
                      <PDFViewer driveLink={selectedCertification.driveLink} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300"
                  onClick={() => setSelectedCertification(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications; 