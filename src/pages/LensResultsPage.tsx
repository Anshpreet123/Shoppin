import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack, IoSearch, IoEllipsisHorizontal } from 'react-icons/io5';
import { FaCamera, FaHistory } from 'react-icons/fa';
import { fadeIn, slideInBottom } from '../utils/animations';

// Simulate image search API configuration (replace with your actual API)
const IMAGE_SEARCH_API_KEY = "AIzaSyAeciSpGhvqrxPyRsfWjOplaI_agYuW6bA";
const IMAGE_SEARCH_ENGINE_ID = "91cdf4094c3794cc4";

// Define list animation variants
const listVariants = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  hidden: { opacity: 0 },
};

// Define item animation variants
const itemVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

const LensResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.imageSrc || '';
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchData, setSearchData] = useState<any>(null);
  const [visualMatches, setVisualMatches] = useState<any[]>([]);
  const [textResults, setTextResults] = useState<any[]>([]);

  useEffect(() => {
    // Perform image search when component mounts and imageSrc is available
    if (imageSrc) {
      performImageSearch(imageSrc);
    } else {
      setIsSearching(false);
      console.error("No image source provided");
    }
  }, [imageSrc]);

  const performImageSearch = async (imageSource: string) => {
    setIsSearching(true);
    
    // In a real implementation, you would:
    // 1. Upload the image to your server or directly to Google Cloud Vision API
    // 2. Process the image to extract labels/text
    // 3. Use those labels to perform a search
    
    // For demo purposes, we'll simulate this process
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate image analysis (in reality, use Google Cloud Vision or similar)
      const simulatedLabels = ['nature', 'landscape', 'mountain', 'scenic'];
      
      // Simulate search based on extracted labels
      await performTextSearch(simulatedLabels.join(' '));
      
      // Simulate visual matches (similar images)
      setVisualMatches([
        {
          id: 'vm1',
          imageUrl: 'https://source.unsplash.com/random/300x200?nature',
          title: 'Similar mountain landscape'
        },
        {
          id: 'vm2',
          imageUrl: 'https://source.unsplash.com/random/300x200?mountain',
          title: 'Mountain view at sunset'
        },
        {
          id: 'vm3',
          imageUrl: 'https://source.unsplash.com/random/300x200?landscape',
          title: 'Alpine landscape'
        }
      ]);
      
    } catch (error) {
      console.error('Image search error:', error);
      setSearchResults([]);
      setSearchData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const performTextSearch = async (query: string) => {
    try {
      // Log the search query
      console.log(`Searching for image content: "${query}"`);

      // Check API configuration
      if (IMAGE_SEARCH_API_KEY === "AIzaSyAeciSpGhvqrxPyRsfWjOplaI_agYuW6bA" || 
          IMAGE_SEARCH_ENGINE_ID === "91cdf4094c3794cc4") {
        console.error("ERROR: Please replace placeholder API Key and Search Engine ID.");
        return;
      }

      // Perform search with Google Custom Search API
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${IMAGE_SEARCH_API_KEY}&cx=${IMAGE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        console.error("Search API Error:", data);
        throw new Error(data.error?.message || "Search request failed");
      }

      setSearchData(data);
      setSearchResults(data.items || []);
      
      // Separate text search results
      setTextResults(data.items || []);

    } catch (error) {
      console.error("Text search error:", error);
      setSearchResults([]);
      setSearchData(null);
      setTextResults([]);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-black text-white"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
    >
      {/* Header */}
      <motion.div
        className="fixed top-0 z-10 flex w-full items-center justify-between bg-black bg-opacity-50 p-4"
        variants={fadeIn}
      >
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4 rounded-full p-2 hover:bg-gray-800">
            <IoArrowBack size={24} />
          </button>
          <div className="text-xl font-medium">Google Lens Results</div>
        </div>
        <div className="flex items-center">
          <button className="rounded-full p-2 hover:bg-gray-800">
            <FaHistory size={20} />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-800">
            <IoEllipsisHorizontal size={20} />
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-16 pb-16">
        {isSearching ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-xl">Analyzing image...</div>
              <motion.div
                className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Image that was analyzed */}
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={imageSrc} 
                alt="Analyzed" 
                className="w-full object-cover h-48" 
              />
            </div>

            {/* Visual Matches Section */}
            {visualMatches.length > 0 && (
              <motion.div
                className="mb-8"
                variants={slideInBottom}
              >
                <h2 className="mb-3 text-lg font-medium">Visual matches</h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {visualMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      className="flex-shrink-0 w-48 rounded-lg overflow-hidden bg-gray-800"
                      whileHover={{ scale: 1.03 }}
                      variants={itemVariants}
                    >
                      <img 
                        src={match.imageUrl} 
                        alt={match.title} 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="p-2">
                        <div className="text-sm">{match.title}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search Results Section */}
            {textResults.length > 0 ? (
              <motion.div 
                variants={listVariants}
              >
                <h2 className="mb-3 text-lg font-medium">Search results</h2>
                {searchData?.searchInformation && (
                  <div className="text-sm mb-4 text-gray-400">
                    About {searchData.searchInformation.formattedTotalResults}{" "}
                    results ({searchData.searchInformation.formattedSearchTime}{" "}
                    seconds)
                  </div>
                )}

                {/* Map through results and animate each item */}
                {textResults.map((result) => (
                  <motion.div
                    key={result.cacheId || result.link}
                    className="bg-gray-800 rounded-lg p-4 mb-4 hover:bg-gray-700 transition-colors"
                    variants={itemVariants}
                  >
                    {/* URL */}
                    <div className="text-sm mb-1 text-gray-300 truncate">
                      {result.displayLink}
                    </div>

                    {/* Title */}
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-lg font-medium block mb-2 text-blue-400"
                      dangerouslySetInnerHTML={{ __html: result.htmlTitle }}
                    />

                    {/* Snippet */}
                    <div
                      className="text-sm leading-relaxed text-gray-200"
                      dangerouslySetInnerHTML={{ __html: result.htmlSnippet }}
                    />

                    {/* Image if available */}
                    {result.pagemap?.cse_image?.[0]?.src && (
                      <div className="mt-3">
                        <img
                          src={result.pagemap.cse_image[0].src}
                          alt=""
                          className="rounded-lg max-h-48 object-cover w-full"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No search results found for this image
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <motion.div
        className="fixed bottom-0 z-10 w-full bg-black bg-opacity-50 p-4"
        variants={slideInBottom}
      >
        <div className="flex justify-around">
          <motion.button
            className="flex flex-col items-center px-4 py-2 text-blue-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoSearch size={24} />
            <span className="mt-1 text-xs">Search</span>
          </motion.button>
          <motion.button
            className="flex flex-col items-center px-4 py-2 text-white opacity-70"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">ᴀА</span>
            <span className="mt-1 text-xs">Translate</span>
          </motion.button>
          <motion.button
            className="flex flex-col items-center px-4 py-2 text-white opacity-70"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
          >
            <FaCamera size={20} />
            <span className="mt-1 text-xs">Retake</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LensResultsPage;