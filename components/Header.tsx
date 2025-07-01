
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon } from './Icons.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Notification } from '../types.ts';
import { COMPANY_IMAGE_URL } from '../constants.ts'; // Import company image URL
import { Link } from 'react-router-dom'; // Import Link

const Header: React.FC = () => {
  const { notifications, clearNotification, languageState, markNotificationAsRead } = useAppContext();
  const { t } = languageState;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.read) {
        markNotificationAsRead(notif.id);
    }
    // Potentially navigate to a relevant page or open a modal
    console.log("Notification clicked:", notif);
  };

  return (
    <header className="bg-white dark:bg-neutral-dark shadow-sm dark:shadow-gray-700/50 p-4 flex justify-between items-center print:hidden transition-colors duration-300">
      <div>
        <Link to="/home">
          <img 
            src={COMPANY_IMAGE_URL} 
            alt={t('companyName', { default: 'Company Logo' })} 
            className="h-10 w-auto" // Adjusted height, width auto for aspect ratio
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-neutral-DEFAULT dark:text-neutral-light hover:text-primary dark:hover:text-primary-light transition-colors"
            aria-label={t('notifications')}
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-darker rounded-md shadow-lg border border-neutral-light dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-neutral-light dark:border-gray-700">
                <h3 className="text-sm font-semibold text-neutral-dark dark:text-neutral-light">{t('notifications')}</h3>
              </div>
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-neutral-DEFAULT dark:text-neutral-light">{t('noNewNotifications')}</p>
              ) : (
                notifications.map((notif: Notification) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 border-b border-neutral-light dark:border-gray-700 hover:bg-neutral-light dark:hover:bg-gray-700 cursor-pointer ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/30' : 'dark:bg-neutral-darker'}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <p className={`text-sm ${!notif.read ? 'font-semibold': ''} text-neutral-dark dark:text-neutral-light`}>{notif.message}</p>
                    <div className="text-xs text-neutral-DEFAULT dark:text-neutral-light flex justify-between items-center mt-1">
                      <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {!notif.read && <span className="text-primary dark:text-primary-light text-xs font-bold">{t('new', { default: 'New' })}</span>}
                      <button onClick={(e) => { e.stopPropagation(); clearNotification(notif.id);}} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs">{t('dismiss')}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="text-neutral-DEFAULT dark:text-neutral-light hover:text-primary dark:hover:text-primary-light transition-colors"
            aria-label={t('userProfile')}
          >
            <UserCircleIcon className="h-7 w-7" />
          </button>
          {showProfileMenu && (
             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-darker rounded-md shadow-lg border border-neutral-light dark:border-gray-700 z-50">
               <a href="#/profile" className="block px-4 py-2 text-sm text-neutral-dark dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-gray-700">{t('viewProfile')}</a>
               <a href="#/settings" className="block px-4 py-2 text-sm text-neutral-dark dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-gray-700">{t('settings')}</a>
               <div className="border-t border-neutral-light dark:border-gray-700 my-1"></div>
               <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-light dark:hover:bg-gray-700">{t('logout')}</button>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
