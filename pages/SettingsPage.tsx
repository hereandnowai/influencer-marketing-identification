
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Language, Theme } from '../types.ts';
import { LANGUAGES } from '../constants.ts';
import { CogIcon, SunIcon, MoonIcon, ShieldCheckIcon, TranslateIcon } from '../components/Icons.tsx';

const SettingsPage: React.FC = () => {
  const { theme, setTheme, languageState, apiKeyStatus, addToast } = useAppContext(); // Added addToast
  const { language, setLanguage, t } = languageState;
  const [apiKeyDisplay, setApiKeyDisplay] = useState('');

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme); // AppContext's setTheme will now handle the toast
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language); // AppContext's setLanguage will now handle the toast
  };
  
  useEffect(() => {
    if (apiKeyStatus === 'ok' && process.env.API_KEY && process.env.API_KEY !== 'YOUR_GEMINI_API_KEY' && process.env.API_KEY.trim() !== '') {
        const key = process.env.API_KEY;
        if (key.length > 8) {
            setApiKeyDisplay(`${key.substring(0, 4)}...${key.substring(key.length - 4)}`);
        } else {
            setApiKeyDisplay("********"); 
        }
    } else {
        setApiKeyDisplay('');
    }
  }, [apiKeyStatus]);


  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <CogIcon className="h-8 w-8 text-primary dark:text-primary-light mr-3" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light">{t('settings')}</h1>
      </div>
      <p className="mb-8 text-neutral-DEFAULT dark:text-neutral-300">{t('settingsPageDescription')}</p>

      <div className="space-y-8">
        <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 flex items-center">
            {theme === Theme.Light ? <SunIcon className="h-6 w-6 mr-2 text-yellow-500" /> : <MoonIcon className="h-6 w-6 mr-2 text-indigo-400" />}
            {t('theme')}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => handleThemeChange(Theme.Light)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                theme === Theme.Light 
                ? 'bg-primary text-white border-primary' 
                : 'bg-neutral-light dark:bg-gray-700 text-neutral-dark dark:text-neutral-light hover:bg-slate-200 dark:hover:bg-gray-600 border-neutral-light dark:border-gray-600'
              }`}
            >
              <SunIcon className="inline h-4 w-4 mr-1.5 align-text-bottom"/> {t('lightMode', {default: 'Light'})}
            </button>
            <button
              onClick={() => handleThemeChange(Theme.Dark)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                theme === Theme.Dark 
                ? 'bg-primary text-white border-primary' 
                : 'bg-neutral-light dark:bg-gray-700 text-neutral-dark dark:text-neutral-light hover:bg-slate-200 dark:hover:bg-gray-600 border-neutral-light dark:border-gray-600'
              }`}
            >
              <MoonIcon className="inline h-4 w-4 mr-1.5 align-text-bottom"/> {t('darkMode', {default: 'Dark'})}
            </button>
          </div>
           <p className="text-xs text-neutral-DEFAULT dark:text-neutral-300 mt-2">{t('themeChangeNote', {default: 'Theme changes are cosmetic and apply locally.'})}</p>
        </div>

        <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 flex items-center">
            <TranslateIcon className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
            {t('language')}
          </h2>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full md:w-1/2 p-2.5 bg-white text-neutral-dark border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
             {t('apiKeyStatusTitle', {default: 'Gemini API Key Status'})}
          </h2>
          <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300 mb-1">
            {t('apiKeyManagedExternally', { default: "The API key is managed via the environment variable `process.env.API_KEY`."})}
          </p>
          <div className={`p-3 rounded-md text-sm ${apiKeyStatus === 'ok' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
            {apiKeyStatus === 'ok' 
              ? t('apiKeyStatusOK', { default: 'API Key is configured and active.' })
              : t('apiKeyStatusMissing', { default: 'API Key is missing or invalid. AI features may be limited.' })
            }
          </div>
           {apiKeyStatus === 'ok' && apiKeyDisplay && (
            <p className="text-xs text-neutral-DEFAULT dark:text-neutral-300 mt-2">
              {t('currentKeyDisplay', {default: 'Detected Key:'})} <span className="font-mono">{apiKeyDisplay}</span>
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 mr-2 text-red-600 dark:text-red-400" />
            {t('privacySettings')}
          </h2>
          <h3 className="text-md font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('dataUsageDisclaimer')}</h3>
          <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300 mb-4">
            {t('disclaimerContent')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
