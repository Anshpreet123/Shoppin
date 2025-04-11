import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBack, IoSearch, IoMic } from "react-icons/io5";
import { FaCamera, FaHistory } from "react-icons/fa";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSearchHistory } from "../contexts/SearchHistoryContext";
import { fadeIn, slideInBottom } from "../utils/animations";

// Google Custom Search API configuration
const GOOGLE_API_KEY = "AIzaSyAeciSpGhvqrxPyRsfWjOplaI_agYuW6bA";
const SEARCH_ENGINE_ID: string = "91cdf4094c3794cc4";

// ---------------

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

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState<any>(null); // Keep track of the full response
  const { searchHistory, addSearchItem, isIncognito, setIsIncognito } =
    useSearchHistory();

  const { isListening, transcript, startListening, stopListening } =
    useSpeechRecognition({
      onResult: (text) => {
        setSearchQuery(text);
      },
      onEnd: () => {
        // Automatically search when voice input ends *if* there's a transcript
        if (transcript && searchQuery === transcript) {
          // Check if query matches transcript to avoid duplicate searches
          const syntheticEvent = { preventDefault: () => {} } as FormEvent;
          handleSearch(syntheticEvent);
        }
      },
    });

  // Effect to update query from transcript *while* listening
  useEffect(() => {
    if (isListening && transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript, isListening]);

  const performSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    console.log(`Searching for: "${trimmedQuery}"`); // Log query
    setIsSearching(true);
    setSearchResults([]); // Clear previous results immediately
    setSearchData(null);

    // --- Check API Key and Engine ID ---
    if (
      (GOOGLE_API_KEY as string) === "YOUR_ACTUAL_GOOGLE_API_KEY" ||
      SEARCH_ENGINE_ID === "YOUR_ACTUAL_SEARCH_ENGINE_ID"
    ) {
      console.error(
        "ERROR: Please replace placeholder API Key and Search Engine ID."
      );
      alert("Search configuration is missing. Please check console.");
      setIsSearching(false);
      return;
    }
    // ------------------------------------

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(trimmedQuery)}`
      );

      const data = await response.json();
      console.log("API Response:", data); // Log the full response

      if (!response.ok) {
        console.error("Search API Error:", data);
        throw new Error(data.error?.message || "Search request failed");
      }

      setSearchData(data); // Store the whole response
      setSearchResults(data.items || []); // Update results (use empty array if no items)

      // Add to search history only if not incognito and the search was successful
      if (!isIncognito) {
        addSearchItem(trimmedQuery, "text");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]); // Ensure results are empty on error
      setSearchData(null);
      // Optionally show an error message to the user here
      alert(
        `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Prevent search if listening just stopped and triggered onEnd search
    if (!isListening) {
      performSearch(searchQuery);
    }
  };

  // Function to handle clicking on a search history item
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // --- (Keep handleKeyPress, goBack, handleCameraClick, handleMicrophoneClick, toggleIncognito as they are) ---
  const handleKeyPress = (key: string) => {
    if (key === "⇧") {
      setIsShiftPressed(!isShiftPressed);
      return;
    }
    if (key === "⌫") {
      setSearchQuery((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "space") {
      setSearchQuery((prev) => prev + " ");
      return;
    }
    if (key === "123") {
      // TODO: Implement number keyboard
      console.log("Number keyboard not implemented");
      return;
    }
    if (key === "😊") {
      // TODO: Implement emoji keyboard
      console.log("Emoji keyboard not implemented");
      return;
    }
    if (key === "search") {
      performSearch(searchQuery);
      return;
    }

    const char = isShiftPressed ? key.toUpperCase() : key.toLowerCase();
    setSearchQuery((prev) => prev + char);
    // Reset shift after typing a character
    if (isShiftPressed) {
      setIsShiftPressed(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleCameraClick = () => {
    navigate("/lens");
  };

  const handleMicrophoneClick = () => {
    if (isListening) {
      stopListening();
      // `onEnd` will handle the search if needed
    } else {
      setSearchQuery(""); // Clear query before starting listening
      startListening();
    }
  };

  const toggleIncognito = () => {
    setIsIncognito(!isIncognito);
  };

  return (
    // Main container with overall fade-in
    <motion.div
      className="flex min-h-screen flex-col bg-[#202124] text-white" // Removed [&_*]:text-white for simpler specificity
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn} // Use your defined fadeIn animation
    >
      {/* Status Bar (Simplified - styling fine) */}
      <div className="flex items-center justify-between p-4 text-white">
        {/* ... status bar content ... */}
        <div className="text-lg font-semibold">18:34</div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#9aa0a6]" />
          <div>{/* Wifi or other icons can go here */}</div>
          <div>38%</div> {/* Battery */}
        </div>
      </div>

      {/* Search Bar (Sticky - styling fine) */}
      <div className="sticky top-0 z-10 p-4 bg-[#202124]">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 rounded-full bg-[#303134] px-4 py-2"
        >
          <button type="button" onClick={goBack} className="text-white">
            <IoArrowBack size={20} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or type URL"
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-400"
            autoFocus
          />
          {isListening ? (
            <div className="flex items-center gap-1">
              {" "}
              {/* Reduced gap for pulse */}
              {/* Simple pulsing dot for listening */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-4 w-4 rounded-full bg-[#8ab4f8]"
              />
            </div>
          ) : (
            <>
              <motion.button
                type="button"
                onClick={handleMicrophoneClick}
                whileTap={{ scale: 0.9 }}
                className="text-white"
              >
                <IoMic size={20} />
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCameraClick}
                whileTap={{ scale: 0.9 }}
                className="text-white"
              >
                <FaCamera size={20} />
              </motion.button>
            </>
          )}
        </form>
      </div>

      {/* Main Content Area */}
      {/* Ensure enough padding-bottom to avoid overlap with fixed keyboard/nav */}
      <div className="flex-1 overflow-y-auto pb-[260px] relative z-0">
        {" "}
        {/* Increased padding bottom slightly */}
        {isSearching ? (
          <div className="flex h-full items-center justify-center p-10">
            <div className="text-center text-gray-400">Searching...</div>
          </div>
        ) : searchResults.length > 0 ? (
          // Animate the list container
          <motion.div
            className="p-4 space-y-4" // Reduced space slightly
            variants={listVariants}
            initial="hidden"
            animate="visible" // Trigger children stagger
          >
            {/* Search Info */}
            {searchData?.searchInformation && (
              <div className="text-sm mb-4 text-gray-400">
                About {searchData.searchInformation.formattedTotalResults}{" "}
                results ({searchData.searchInformation.formattedSearchTime}{" "}
                seconds)
              </div>
            )}

            {/* Map through results and animate each item */}
            {searchResults.map((result) => (
              <motion.div
                key={result.cacheId || result.link} // Use cacheId as fallback key
                className="bg-[#303134] rounded-lg p-4 hover:bg-[#3c4043] transition-colors"
                variants={itemVariants} // Use item variants for individual animation
              >
                {/* URL */}
                <div className="text-sm mb-1 text-gray-300 truncate">
                  {" "}
                  {/* Use lighter gray, truncate long links */}
                  {result.displayLink}
                </div>

                {/* Title - Make sure text color is visible */}
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-lg font-medium block mb-2 text-[#8ab4f8]" // Ensure this color is visible
                  dangerouslySetInnerHTML={{ __html: result.htmlTitle }}
                />

                {/* Snippet - Make sure text color is visible */}
                <div
                  className="text-sm leading-relaxed text-gray-200" // Ensure this color is visible
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
                {/* Refined metadata display */}
                {result.pagemap?.metatags?.[0] && (
                  <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                    {result.pagemap.metatags[0]["og:type"] && (
                      <span className="bg-[#5f6368] px-1.5 py-0.5 rounded text-xs">
                        {result.pagemap.metatags[0]["og:type"]}
                      </span>
                    )}
                    {result.pagemap.metatags[0]["article:published_time"] && (
                      <span>
                        {new Date(
                          result.pagemap.metatags[0]["article:published_time"]
                        ).toLocaleDateString()}
                      </span>
                    )}
                    {result.pagemap.metatags[0]["og:site_name"] &&
                      !result.pagemap.metatags[0]["og:type"] && (
                        <span>
                          {result.pagemap.metatags[0]["og:site_name"]}
                        </span> // Show site name if type is missing
                      )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Recent Searches - Only show when not searching and no results */
          <motion.div
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-300">
                Recent searches
              </div>
              {/* Optional: Link to a history management page */}
              {/* <button className="text-xs font-medium text-[#8ab4f8] hover:underline">MANAGE HISTORY</button> */}
            </div>

            <motion.div
              className="space-y-3" // Adjust spacing
              variants={listVariants} // Use list variants here too
              initial="hidden"
              animate="visible"
            >
              {searchHistory.length > 0 ? (
                // Slice to show only recent ones if list gets long
                searchHistory.slice(0, 5).map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-[#303134] cursor-pointer"
                    variants={itemVariants} // Use item variants
                    whileHover={{ x: 3 }}
                    onClick={() => handleHistoryClick(item.text)} // Add click handler
                  >
                    <div className="text-gray-400">
                      {item.type === "image" ? (
                        <FaCamera size={16} />
                      ) : (
                        <FaHistory size={16} />
                      )}
                    </div>
                    {/* Removed the rotated search icon as it might be confusing */}
                    <div className="text-gray-200 flex-1 truncate">
                      {item.text}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400 pt-5">
                  {isIncognito
                    ? "Search history is off in Incognito mode"
                    : "No recent searches"}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#202124] z-20">
        {" "}
        {/* Ensure higher z-index */}
        {/* Incognito Toggle */}
        <motion.div
          className="p-4 border-t border-[#3c4043]"
          variants={slideInBottom} // Assuming slideInBottom is defined correctly
        >
          <div className="flex items-center justify-between">
            {" "}
            {/* Use justify-between */}
            <div className="text-sm text-gray-300">Incognito mode</div>
            <motion.button
              onClick={toggleIncognito}
              className={`relative h-6 w-11 rounded-full ${isIncognito ? "bg-[#8ab4f8]" : "bg-[#5f6368]"} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#202124] focus:ring-[#8ab4f8]`}
              whileTap={{ scale: 0.95 }}
              aria-pressed={isIncognito} // Accessibility
            >
              <span className="sr-only">Toggle Incognito Mode</span>{" "}
              {/* Accessibility */}
              <motion.div
                className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-md" // Style the knob
                animate={{ x: isIncognito ? "20px" : "0px" }} // Animate position based on state
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>
        {/* Keyboard */}
        <motion.div
          className="border-t border-[#3c4043] bg-[#303134] p-1"
          variants={slideInBottom} // Assuming slideInBottom is defined correctly
        >
          {/* Keyboard Rows... (Keep the structure, ensure text is white) */}
          {/* Example for one row */}
          <div className="grid grid-cols-10 gap-1 text-white">
            {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((key) => (
              <motion.button // Use button for accessibility
                key={key}
                className="rounded bg-[#5f6368] p-2 text-center font-medium text-sm sm:text-base" // Responsive text size
                whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }} // Subtle hover
                whileTap={{
                  scale: 0.95,
                  backgroundColor: "#8ab4f8",
                  color: "#202124",
                }} // Tap feedback
                onClick={() => handleKeyPress(key)}
              >
                {isShiftPressed ? key.toUpperCase() : key}
              </motion.button>
            ))}
          </div>
          {/* ... other keyboard rows (a, s, d... z, x, c...) ... */}
          <div className="mt-1 grid grid-cols-9 gap-1 text-white">
            {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((key) => (
              <motion.button
                key={key}
                className="rounded bg-[#5f6368] p-2 text-center font-medium text-sm sm:text-base"
                whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }}
                whileTap={{
                  scale: 0.95,
                  backgroundColor: "#8ab4f8",
                  color: "#202124",
                }}
                onClick={() => handleKeyPress(key)}
              >
                {isShiftPressed ? key.toUpperCase() : key}
              </motion.button>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-9 gap-1 text-white">
            <motion.button
              className={`rounded p-2 text-center font-bold ${isShiftPressed ? "bg-[#8ab4f8] text-[#202124]" : "bg-[#5f6368]"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress("⇧")}
              aria-pressed={isShiftPressed} // Accessibility
            >
              ⇧
            </motion.button>
            {["z", "x", "c", "v", "b", "n", "m"].map((key) => (
              <motion.button
                key={key}
                className="rounded bg-[#5f6368] p-2 text-center font-medium text-sm sm:text-base"
                whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }}
                whileTap={{
                  scale: 0.95,
                  backgroundColor: "#8ab4f8",
                  color: "#202124",
                }}
                onClick={() => handleKeyPress(key)}
              >
                {isShiftPressed ? key.toUpperCase() : key}
              </motion.button>
            ))}
            <motion.button
              className="rounded bg-[#5f6368] p-2 text-center flex items-center justify-center"
              whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress("⌫")}
              aria-label="Backspace" // Accessibility
            >
              ⌫
            </motion.button>
          </div>
          <div className="mt-1 grid grid-cols-4 gap-1 text-white">
            <motion.button
              className="rounded bg-[#5f6368] p-2 text-center text-sm"
              whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress("123")}
            >
              123
            </motion.button>
            <motion.button
              className="rounded bg-[#5f6368] p-2 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress("😊")}
              aria-label="Emoji keyboard"
            >
              😊
            </motion.button>
            <motion.button
              className="rounded bg-[#5f6368] p-2 text-center col-span-1" // Adjusted span if needed
              whileHover={{ scale: 1.05, backgroundColor: "#7a7f83" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress("space")}
            >
              space
            </motion.button>
            <motion.button
              className="rounded bg-[#8ab4f8] p-2 text-center text-[#202124] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress("search")}
              aria-label="Search"
            >
              <IoSearch size={20} />
            </motion.button>
          </div>
        </motion.div>
        {/* Bottom Navigation (Simplified Example - Styling looks okay) */}
        <div className="flex items-center justify-around border-t border-[#3c4043] bg-[#202124] p-2 h-[50px]">
          {" "}
          {/* Center align items */}
          {/* Example items - adjust as needed */}
          <button className="p-2 text-gray-400 hover:text-white">
            <IoSearch size={22} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <FaHistory size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <FaCamera size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResultsPage;
