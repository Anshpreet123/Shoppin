import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMicrophone, FaCamera } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { FaFlask, FaLanguage, FaGraduationCap, FaMusic, FaHistory } from 'react-icons/fa';
import AccountMenu from '../components/common/AccountMenu';
import { useSearchHistory } from '../contexts/SearchHistoryContext';
import {
  fadeIn,
  slideInBottom,
  staggerContainer,
  scaleUp
} from '../utils/animations';
import '../index.css';

// Static data for quick actions and navigation items
const quickActionItems = [
  { id: 'images', icon: <FaCamera size={20} className="text-yellow-400" />, label: "Images" },
  { id: 'translate', icon: <FaLanguage size={20} className="text-blue-400" />, label: "Translate" },
  { id: 'learn', icon: <FaGraduationCap size={20} className="text-green-400" />, label: "Learn" },
  { id: 'music', icon: <FaMusic size={20} className="text-red-400" />, label: "Music" }
];

const navigationItems = [
  { id: 'home', emoji: "🏠", label: "Home", active: true },
  { id: 'discover', emoji: "🕒", label: "Discover", active: false },
  { id: 'updates', emoji: "🔔", label: "Updates", active: false },
  { id: 'menu', emoji: "≡", label: "Menu", active: false }
];

// Define animation variants directly in the component
const listVariants = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  hidden: { opacity: 0 },
};

const itemVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { searchHistory } = useSearchHistory();

  const handleSearchFocus = () => {
    navigate('/search');
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the search bar click from triggering
    navigate('/lens');
  };

  const handleMicrophoneClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the search bar click from triggering
    navigate('/search');
  };

  // Get the most recent search for displaying in the search bar
  const recentSearch = searchHistory.length > 0 ? searchHistory[0].text : '';

  // Navigate to search results with a specific query
  const handleHistoryClick = (query: string) => {
    navigate('/search', { state: { initialQuery: query } });
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-[#202124] text-white"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
    >
      {/* Status Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="text-lg font-semibold">18:24</div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#9aa0a6]" />
          <div className="text-[#9aa0a6]">
            <IoSearch size={20} />
          </div>
          <div className="text-[#9aa0a6]">41%</div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-4"
        variants={fadeIn}
      >
        <div className="text-blue-400">
          <FaFlask size={24} />
        </div>
        <div className="flex items-center gap-4 rounded-full bg-[#303134] px-4 py-2">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
               alt="Google" className="h-6" />
          <div className="text-[#9aa0a6]">Search</div>
        </div>
        <AccountMenu />
      </motion.div>

      {/* Main Content */}
      <div className="mt-4 flex flex-1 flex-col items-center">
        <motion.div
          className="mb-8 text-center"
          variants={scaleUp}
        >
          <motion.img
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
            alt="Google"
            className="mx-auto h-16"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="relative mb-6 w-full max-w-md px-4"
          variants={scaleUp}
        >
          <motion.div
            className="flex items-center rounded-full bg-[#303134] px-4 py-3"
            onClick={handleSearchFocus}
            whileHover={{ scale: 1.02, boxShadow: "0px 4px 8px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <IoSearch size={20} className="mr-2 text-[#9aa0a6]" />
            <div className="flex-1 text-[#9aa0a6]">
              {recentSearch ? recentSearch : "Search"}
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleMicrophoneClick}
              >
                <FaMicrophone
                  size={18}
                  className="cursor-pointer text-[#8ab4f8]"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCameraClick}
              >
                <FaCamera
                  size={18}
                  className="cursor-pointer text-[#8ab4f8]"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Action Icons */}
        <motion.div
          className="mb-8 flex w-full max-w-md justify-around px-4"
          variants={staggerContainer}
        >
          {quickActionItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex flex-col items-center"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.2 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }
                }
              }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mb-2 rounded-full bg-[#5f6368] p-3">
                {item.icon}
              </div>
              <span className="text-xs text-[#9aa0a6]">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          className="mb-4 grid w-full max-w-md grid-cols-2 gap-4 px-4"
          variants={slideInBottom}
        >
          <motion.div
            className="rounded-xl bg-[#303134] p-4"
            whileHover={{ y: -5, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" }}
          >
            <div className="text-sm text-[#9aa0a6]">Gurugram</div>
            <div className="flex items-end justify-between">
              <div className="text-4xl">30°</div>
              <div className="text-[#9aa0a6]">🌙</div>
            </div>
          </motion.div>
          <motion.div
            className="rounded-xl bg-[#303134] p-4"
            whileHover={{ y: -5, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" }}
          >
            <div className="text-sm text-[#9aa0a6]">Air quality · 170</div>
            <div className="flex items-end justify-between">
              <div className="text-lg">Moderate</div>
              <div className="rounded-full bg-yellow-400 p-2 text-xs">≋</div>
            </div>
          </motion.div>
        </motion.div>

        {/* News Card */}
        <motion.div
          className="w-full max-w-md px-4 mb-6"
          variants={slideInBottom}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div
            className="overflow-hidden rounded-xl bg-[#303134]"
            whileHover={{ y: -5, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" }}
          >
            <motion.div
              className="h-48 bg-gray-700"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="p-4">
              <h3 className="text-lg">This superstar was Ratan Tata's closest friend, shared same room, went for picnics, listened songs together...</h3>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Search Feed */}
        <motion.div
          className="w-full max-w-md px-4 mb-6"
          variants={slideInBottom}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[#9aa0a6] font-medium">Recent searches</div>
            <motion.button 
              className="text-xs text-[#8ab4f8]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
            >
              VIEW ALL
            </motion.button>
          </div>

          <motion.div
            className="space-y-2"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {searchHistory.length > 0 ? (
              searchHistory.slice(0, 4).map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#303134] cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ y: -3, boxShadow: "0px 3px 8px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHistoryClick(item.text)}
                >
                  <div className="text-[#9aa0a6]">
                    {item.type === "image" ? (
                      <FaCamera size={16} />
                    ) : (
                      <FaHistory size={16} />
                    )}
                  </div>
                  <div className="text-white flex-1 truncate">{item.text}</div>
                  <div className="text-[#8ab4f8]">
                    <IoSearch size={16} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-[#9aa0a6] py-4 bg-[#303134] rounded-lg">
                No recent searches
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        className="mt-auto flex justify-around border-t border-[#3c4043] bg-[#202124] p-4"
        variants={slideInBottom}
      >
        {navigationItems.map((item) => (
          <motion.div
            key={item.id}
            className={`flex flex-col items-center ${item.active ? 'text-blue-400' : 'text-[#9aa0a6]'}`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div>{item.emoji}</div>
            <span className="text-xs">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;