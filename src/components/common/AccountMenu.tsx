import { useState } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {
  FaCog, FaUserCircle, FaLock, FaSearch,
  FaShieldAlt, FaStar, FaKey, FaUserAlt
} from 'react-icons/fa';

const AccountMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5f6368] text-xl text-white"
        onClick={toggleMenu}
      >
        A
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-lg bg-[#303134] shadow-lg">
          <div className="flex items-center justify-between border-b border-[#3c4043] p-4">
            <div className="text-xl">Google</div>
            <button onClick={toggleMenu}>
              <IoChevronUp size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 border-b border-[#3c4043] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5f6368] text-xl text-white">
              A
            </div>
            <div className="flex-1">
              <div className="text-sm opacity-0">•••••</div>
              <div className="text-xs opacity-0">•••••@gmail.com</div>
            </div>
            <IoChevronDown size={20} className="text-[#9aa0a6]" />
          </div>

          <div className="border-b border-[#3c4043] p-4">
            <button className="w-full rounded-full border border-[#5f6368] py-2 text-center">
              Manage your Google Account
            </button>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaUserAlt size={20} />
              </div>
              <div>Turn on Incognito</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <div className="text-[#9aa0a6]">
                  <FaSearch size={20} />
                </div>
                <div>Search history</div>
              </div>
              <div className="text-xs text-[#9aa0a6]">Saving</div>
            </div>
            <div className="border-t border-[#3c4043] px-8 py-2 text-sm text-[#8ab4f8]">
              Delete last 15 mins
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaShieldAlt size={20} />
              </div>
              <div>SafeSearch</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaStar size={20} />
              </div>
              <div>Interests</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaKey size={20} />
              </div>
              <div>Passwords</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaUserCircle size={20} />
              </div>
              <div>Your profile</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaUserCircle size={20} />
              </div>
              <div>Search personalisation</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaCog size={20} />
              </div>
              <div>Settings</div>
            </div>
          </div>

          <div className="border-b border-[#3c4043]">
            <div className="flex items-center gap-4 p-4">
              <div className="text-[#9aa0a6]">
                <FaLock size={20} />
              </div>
              <div>Help and feedback</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 p-4 text-sm text-[#9aa0a6]">
            <div>Privacy Policy</div>
            <div>•</div>
            <div>Terms of Service</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
