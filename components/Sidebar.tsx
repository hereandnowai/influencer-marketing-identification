
import React from 'react';
import { NavLink } from 'react-router-dom';
import { COMPANY_LOGO_URL, MENU_ITEMS } from '../constants.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

const Sidebar: React.FC = () => {
  const { languageState } = useAppContext();
  const { t } = languageState;

  return (
    <div className="w-64 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light flex flex-col h-full print:hidden shadow-lg dark:shadow-gray-700/50 transition-colors duration-300">
      <div className="p-4 flex items-center space-x-2 border-b border-neutral-light dark:border-gray-700">
        <img src={COMPANY_LOGO_URL} alt="Company Logo" className="h-10 w-10 rounded-full" />
        <span className="text-xl font-semibold text-neutral-dark dark:text-neutral-light">Influencer ID</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150
              ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-neutral-DEFAULT dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-gray-700 hover:text-neutral-dark dark:hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.labelKey).toUpperCase()}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-light dark:border-gray-700">
        <p className="text-xs text-neutral-DEFAULT dark:text-neutral-light">
          &copy; {new Date().getFullYear()} HEREANDNOW AI RESEARCH INSTITUTE.
        </p>
         <p className="text-xs text-neutral-DEFAULT dark:text-neutral-light mt-1">
          Developed by RASHINI S [AI Products Engineering Team]
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
