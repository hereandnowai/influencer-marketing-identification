
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BrandPreferences, Influencer, Language, Notification, SocialPlatform, Theme, ToastMessage, UserProfile, ChatMessage } from '../types.ts';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  languageState: LanguageState;
  brandPreferences: BrandPreferences;
  setBrandPreferences: (preferences: BrandPreferences) => void;
  savedInfluencers: Influencer[];
  addSavedInfluencer: (influencer: Influencer) => void;
  removeSavedInfluencer: (influencerId: string) => void;
  isInfluencerSaved: (influencerId: string) => boolean;
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  clearNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  apiKeyStatus: 'ok' | 'missing';
  setApiKeyStatus: (status: 'ok' | 'missing') => void; // Kept for internal use by AppProvider if needed, though primarily set on init
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  translationsLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useLocalStorage<Theme>('app-theme', Theme.Light);
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<Language>('app-language', DEFAULT_LANGUAGE);
  const [brandPreferences, setBrandPreferencesState] = useLocalStorage<BrandPreferences>('brand-preferences', {
    brandName: '',
    targetAudienceKeywords: [],
    preferredCategories: [],
    preferredPlatforms: [SocialPlatform.Instagram],
  });
  const [savedInfluencers, setSavedInfluencers] = useLocalStorage<Influencer[]>('saved-influencers', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('app-notifications', []);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [apiKeyStatus, setApiKeyStatus] = useState<'ok' | 'missing'>('missing');
  const [userProfile, setUserProfileState] = useLocalStorage<UserProfile | null>('user-profile', null);

  const [loadedTranslations, setLoadedTranslations] = useState<Partial<Record<Language, Record<string, string>>>>({});
  const [translationsLoading, setTranslationsLoading] = useState(true);

  useEffect(() => {
    if (process.env.API_KEY && process.env.API_KEY !== 'YOUR_GEMINI_API_KEY' && process.env.API_KEY.trim() !== '') {
      setApiKeyStatus('ok');
    } else {
      setApiKeyStatus('missing');
    }
  }, []); // Runs once on app startup


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.Dark) {
      root.classList.add('dark');
      document.body.classList.add('dark-theme-active'); // Helper for global dark theme styles
      document.body.classList.remove('light-theme-active');
    } else {
      root.classList.remove('dark');
      document.body.classList.add('light-theme-active');
      document.body.classList.remove('dark-theme-active');
    }
  }, [theme]);
  
  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    setToasts(prev => [...prev, { id: Date.now().toString(), message, type }]);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const themeName = newTheme === Theme.Dark ? t('darkMode') : t('lightMode');
    addToast(t('themeChangedTo', { theme: themeName }), 'info');
  };
  
  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    const langTranslations = loadedTranslations[currentLanguage];
    const enTranslations = loadedTranslations[Language.EN]; // Fallback to English
    
    let translation = langTranslations?.[key] || enTranslations?.[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
      });
    }
    return translation;
  }, [currentLanguage, loadedTranslations]);

  useEffect(() => {
    const fetchTranslations = async () => {
      setTranslationsLoading(true);
      let initialTranslationsLoaded = false;
      try {
        const enRes = await fetch('../locales/en.json');
        if (!enRes.ok) throw new Error(`Failed to fetch en.json: ${enRes.statusText}`);
        const enData = await enRes.json();
        
        setLoadedTranslations(prev => ({ ...prev, [Language.EN]: enData }));
        initialTranslationsLoaded = true;
        setTranslationsLoading(false); // English loaded, app can render

        // Fetch other languages asynchronously
        const languagesToFetch = [
            { lang: Language.HI, path: '../locales/hi.json' },
            { lang: Language.TA, path: '../locales/ta.json' },
            { lang: Language.FR, path: '../locales/fr.json' },
            { lang: Language.NL, path: '../locales/nl.json' },
            { lang: Language.ES, path: '../locales/es.json' },
        ];

        Promise.all(languagesToFetch.map(async ({ lang, path }) => {
            try {
                const res = await fetch(path);
                if (!res.ok) {
                    console.warn(`Failed to fetch ${path}: ${res.statusText}`);
                    return { lang, data: null };
                }
                return { lang, data: await res.json() };
            } catch (fetchError) {
                console.warn(`Error fetching ${path}:`, fetchError);
                return { lang, data: null };
            }
        })).then(results => {
            const newTranslations = results.reduce((acc, { lang, data }) => {
                if (data) {
                    acc[lang] = data;
                }
                return acc;
            }, {} as Partial<Record<Language, Record<string, string>>>);

            setLoadedTranslations(prev => ({
                ...prev,
                ...newTranslations,
            }));
        }).catch(error => {
          console.warn("Failed to load some additional translations:", error);
        });

      } catch (error) {
        console.error("Failed to load initial English translations:", error);
        // Fallback: use English keys directly if EN load fails
        const fallbackEn: Record<string, string> = {}; // Potentially load from a const if critical
        setLoadedTranslations(prev => ({ ...prev, [Language.EN]: fallbackEn }));
        if (!initialTranslationsLoaded) {
          setTranslationsLoading(false);
        }
      }
    };
    fetchTranslations();
  }, []);


  const setLanguage = useCallback((lang: Language) => {
    const oldLang = currentLanguage;
    setCurrentLanguage(lang);
     // Get language name in its own language if possible, otherwise in English
    const newLangTranslations = loadedTranslations[lang] || loadedTranslations[Language.EN];
    const newLanguageName = newLangTranslations?.[`languageName.${lang}`] || LANGUAGES.find(l => l.code === lang)?.name || lang;

    // Use the t function with the *new* language context for the toast message
    // This requires "languageChangedTo" to be available in the new language's JSON
    const message = (loadedTranslations[lang]?.languageChangedTo || loadedTranslations[Language.EN]?.languageChangedTo || "Language changed to {{languageName}}").replace('{{languageName}}', newLanguageName);
    
    // Ensure toast uses the new language, might need a slight delay or direct t call with new lang
    // For simplicity, this relies on t being updated quickly enough by setCurrentLanguage
    // A more robust way would be to pass the specific translation directly or ensure t updates before addToast
    
    // Check if the language actually changed to avoid toast on initial load with same language
    if (oldLang !== lang) {
      addToast(message, 'info');
    }
  }, [setCurrentLanguage, currentLanguage, loadedTranslations, addToast]); // addToast was missing

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addSavedInfluencer = useCallback((influencer: Influencer) => {
    setSavedInfluencers(prev => {
      if (!prev.find(i => i.id === influencer.id)) {
        addToast(t('influencerSaved', { name: influencer.name }), 'success');
        return [...prev, influencer];
      }
      return prev;
    });
  }, [setSavedInfluencers, addToast, t]);

  const removeSavedInfluencer = useCallback((influencerId: string) => {
    const influencer = savedInfluencers.find(i => i.id === influencerId);
    setSavedInfluencers(prev => prev.filter(i => i.id !== influencerId));
    if (influencer) {
      addToast(t('influencerRemoved', { name: influencer.name }), 'info');
    }
  }, [savedInfluencers, setSavedInfluencers, addToast, t]);

  const isInfluencerSaved = useCallback((influencerId: string) => {
    return savedInfluencers.some(i => i.id === influencerId);
  }, [savedInfluencers]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep last 20
  }, [setNotifications]);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);
  
  const setUserProfile = useCallback((profile: UserProfile | null) => {
    setUserProfileState(profile);
  }, [setUserProfileState]);

  const setBrandPreferences = useCallback((preferences: BrandPreferences) => {
    setBrandPreferencesState(preferences);
     addToast(t('preferencesSaved', { default: 'Preferences saved successfully!' }), 'success');
  }, [setBrandPreferencesState, addToast, t]);


  const contextValue: AppContextType = {
    theme,
    setTheme,
    languageState: { language: currentLanguage, setLanguage, t },
    brandPreferences,
    setBrandPreferences,
    savedInfluencers,
    addSavedInfluencer,
    removeSavedInfluencer,
    isInfluencerSaved,
    notifications,
    addNotification,
    clearNotification,
    markNotificationAsRead,
    clearAllNotifications,
    toasts,
    addToast,
    removeToast,
    apiKeyStatus,
    setApiKeyStatus, 
    userProfile,
    setUserProfile,
    translationsLoading,
  };
  
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};