import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack, IoSearch, IoEllipsisHorizontal } from 'react-icons/io5';
import { FaHistory } from 'react-icons/fa';
import { useCamera } from '../hooks/useCamera';
import { fadeIn, slideInBottom } from '../utils/animations';

const LensPage = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { isCapturing, takePhoto, selectFromGallery } = useCamera({
    onCapture: (imagePath) => {
      setCapturedImage(imagePath);

      // Simulate processing and navigate to results
      setTimeout(() => {
        navigate('/lens-results', { state: { imageSrc: imagePath } });
      }, 500);
    },
    onError: (error) => {
      console.error('Camera error:', error);
      // Display error message to user
      alert('Failed to access camera. Please check permissions and try again.');
    }
  });

  const goBack = () => {
    navigate(-1);
  };

  const handleCapturePhoto = async () => {
    await takePhoto();
  };

  const handleSelectFromGallery = async () => {
    await selectFromGallery();
  };

  return (
    <motion.div
      className="relative flex min-h-screen flex-col bg-black text-white"
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
          <div className="text-xl font-medium">Google Lens</div>
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

      {/* Camera Viewport */}
      <div className="flex flex-1 items-center justify-center">
        {capturedImage ? (
          <motion.img
            src={capturedImage}
            alt="Captured"
            className="h-full w-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            {/* We don't actually connect to the camera in this browser example */}
            <div className="flex h-full w-full items-center justify-center bg-gray-900">
              <div className="text-center text-lg text-gray-400">
                {isCapturing ? "Capturing..." : "Camera preview"}
              </div>
            </div>

            {/* Selection Frame Lines with animation */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-64 w-64 rounded-lg border-2 border-white"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <motion.div
        className="fixed bottom-0 z-10 w-full bg-black bg-opacity-50 p-4"
        variants={slideInBottom}
      >
        <div className="mb-4 flex items-center justify-center">
          <motion.button
            onClick={handleCapturePhoto}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-transparent"
            disabled={isCapturing}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="h-12 w-12 rounded-full bg-white"
              whileHover={{ scale: 1.05 }}
            />
          </motion.button>
        </div>

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
            onClick={handleSelectFromGallery}
          >
            <span className="text-sm">🎓</span>
            <span className="mt-1 text-xs">Gallery</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LensPage;
