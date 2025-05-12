import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import PDFViewer from '../../components/ui/PDFViewer';
import { motion } from 'framer-motion';

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
      
      // Sort by publication date (newest first)
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
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Research Papers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Explore the research contributions from our department.
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
            ) : researchPapers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No research papers found for this category.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {researchPapers.map((paper) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900">{paper.title}</h3>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {paper.authorType}
                        </span>
                        
                        {paper.publicationDate && (
                          <span className="text-sm text-gray-500">
                            Published: {new Date(paper.publicationDate).toLocaleDateString()}
                          </span>
                        )}
                        
                        {paper.journal && (
                          <span className="text-sm text-gray-500">
                            Journal: {paper.journal}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Authors:</span> {paper.authors}
                        </p>
                      </div>
                      
                      {paper.abstract && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900">Abstract</h4>
                          <p className="mt-1 text-sm text-gray-600">{paper.abstract}</p>
                        </div>
                      )}
                      
                      <div className="mt-6 flex items-center justify-between">
                        {paper.pdfLink && (
                          <button
                            onClick={() => setSelectedPaper(paper)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            View Paper
                          </button>
                        )}
                        
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            DOI: {paper.doi}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedPaper.title}
                    </h3>
                    <div className="mt-4 h-[600px]">
                      <PDFViewer driveLink={selectedPaper.pdfLink} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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