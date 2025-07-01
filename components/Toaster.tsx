
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { ToastMessage } from '../types.ts';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from './Icons.tsx';

const ToastIcons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />,
  error: <XCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />,
  info: <InformationCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
  warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />,
};

const Toast: React.FC<{ message: ToastMessage; onDismiss: (id: string) => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  return (
    <div
      className={`max-w-sm w-full bg-white dark:bg-neutral-darker shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-gray-700 ring-opacity-5 dark:ring-opacity-80 overflow-hidden mb-2 transform transition-all duration-300 ease-in-out animate-toast-in`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{ToastIcons[message.type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-neutral-dark dark:text-neutral-light">{message.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(message.id)}
              className="bg-transparent dark:bg-transparent rounded-md inline-flex text-neutral-DEFAULT dark:text-neutral-300 hover:text-neutral-dark dark:hover:text-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-darker focus:ring-primary"
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-toast-in { animation: toast-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useAppContext();

  if (!toasts.length) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-[100]"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};