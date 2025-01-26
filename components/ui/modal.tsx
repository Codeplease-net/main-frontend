import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
}

interface WaitingModalProps {
  isOpen: boolean;
  message?: string;
  detailMessage?: string
}

export const WaitingModal: React.FC<WaitingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-out"
      role="dialog"
      aria-live="assertive"
      aria-labelledby="waiting-modal-title"
    >
      <div
        className="bg-white bg-opacity-70 p-8 rounded-2xl shadow-xl max-w-[95%] sm:max-w-md md:max-w-lg flex flex-col items-center space-y-4 transform transition-all duration-500 ease-in-out"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.98)',
        }}
      >
        <div className="animate-spin rounded-full border-t-4 border-indigo-600 w-16 h-16"/>
      </div>
    </div>
  );
};

export const DoneModal: React.FC<ModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-out"
      role="dialog"
      aria-live="assertive"
      aria-labelledby="waiting-modal-title"
    >
        <div
        className="bg-white bg-opacity-70 p-8 rounded-2xl shadow-xl max-w-[95%] sm:max-w-md md:max-w-lg flex flex-col items-center space-y-4 transform transition-all duration-500 ease-in-out"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.98)',
        }}
      >
        <div className="text-center">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500 w-16 h-16 mx-auto"
          >
            <motion.path
              d="M5 12l5 5L20 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>
        </div>
    </div>
  );
};
