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

const Research = () => {
  const { type } = useParams();
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [activeTab, setActiveTab] = useState(type?.toUpperCase() || 'ALL');

  useEffect(() => {
    fetchResearchPapers();
  }, [activeTab]);

  useEffect(() => {
    if (type) {
      setActiveTab(type.toUpperCase());
    }
  }, [type]);

  const fetchResearchPapers = async () => {
    setLoading(true);
    try {
      let researchQuery;
      
      if (activeTab === 'ALL') {
        researchQuery = collection(db, 'research');
      } else {
        researchQuery = query(
          collection(db, 'research'),
          where('authorType', '==', activeTab)
        );
      }
      
      const researchSnapshot = await getDocs(researchQuery);
      const researchData = researchSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      researchData.sort((a, b) => {
        return new Date(b.publicationDate || b.timestamp) - new Date(a.publicationDate || a.timestamp);
      });
      
      setResearchPapers(researchData);
    } catch (error) {
      console.error('Error fetching research papers:', error);
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
          <h1 className="text-5xl font-bold mb-6">Research Papers</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore the research contributions from our department.
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
            ) : researchPapers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-400">No research papers found for this category.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 md:grid-cols-2"
              >
                {researchPapers.map((paper) => (
                  <motion.div
                    key={paper.id}
                    variants={itemVariants}
                    className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        paper.authorType === 'FACULTY' 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {paper.authorType}
                      </span>
                      {paper.publicationDate && (
                        <span className="text-xs text-gray-500">
                          {new Date(paper.publicationDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{paper.title}</h3>
                    
                    <div className="flex items-center mt-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {paper.authors ? paper.authors.split(',')[0].charAt(0).toUpperCase() : 'R'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{paper.authors}</p>
                        {paper.journal && (
                          <p className="text-xs text-gray-500">{paper.journal}</p>
                        )}
                      </div>
                    </div>

                    {paper.abstract && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-400 line-clamp-3">{paper.abstract}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {paper.pdfLink && (
                        <button
                          onClick={() => setSelectedPaper(paper)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          View Paper
                        </button>
                      )}
                      
                      {paper.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          DOI: {paper.doi}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPaper && (
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
                      {selectedPaper.title}
                    </h3>
                    <div className="mt-4 h-[600px] bg-white/5 rounded-lg">
                      <PDFViewer driveLink={selectedPaper.pdfLink} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300"
                  onClick={() => setSelectedPaper(null)}
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

export default Research; 