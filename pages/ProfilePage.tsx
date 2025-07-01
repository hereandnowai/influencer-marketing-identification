
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { UserProfile, BrandPreferences, SocialPlatform } from '../types.ts';
import { AVAILABLE_PLATFORMS, AVAILABLE_CATEGORIES } from '../constants.ts';

type UserProfileMultiSelectKeys = 'defaultCategories' | 'defaultPlatforms';
type BrandPreferencesMultiSelectKeys = 'preferredCategories' | 'preferredPlatforms';
type MultiSelectFieldKey = UserProfileMultiSelectKeys | BrandPreferencesMultiSelectKeys;


const ProfilePage: React.FC = () => {
  const { userProfile, setUserProfile, brandPreferences, setBrandPreferences, languageState, addToast } = useAppContext();
  const { t } = languageState;

  const [currentProfile, setCurrentProfile] = useState<UserProfile>(
    userProfile || { brandName: '', targetAudience: '', defaultCategories: [], defaultPlatforms: [] }
  );

  const [currentBrandPreferences, setCurrentBrandPreferences] = useState<BrandPreferences>(
    brandPreferences || { brandName: '', targetAudienceKeywords: [], preferredCategories: [], preferredPlatforms: [] }
  );

  useEffect(() => {
    setCurrentProfile(userProfile || { brandName: '', targetAudience: '', defaultCategories: [], defaultPlatforms: [] });
  }, [userProfile]);

  useEffect(() => {
    setCurrentBrandPreferences(brandPreferences || { brandName: '', targetAudienceKeywords: [], preferredCategories: [], preferredPlatforms: [] });
  }, [brandPreferences]);


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentProfile({ ...currentProfile, [e.target.name]: e.target.value });
  };

  const handleBrandPreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'targetAudienceKeywords') {
      setCurrentBrandPreferences({ ...currentBrandPreferences, targetAudienceKeywords: value.split(',').map(k => k.trim()) });
    } else {
      setCurrentBrandPreferences({ ...currentBrandPreferences, [name]: value });
    }
  };
  
  const handleMultiSelectChange = (field: MultiSelectFieldKey, value: string) => {
    if (field === 'defaultCategories' || field === 'defaultPlatforms') {
        const currentValues = currentProfile[field] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setCurrentProfile({ ...currentProfile, [field]: newValues });
    } else if (field === 'preferredCategories') {
        const currentValues = currentBrandPreferences[field] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setCurrentBrandPreferences({ ...currentBrandPreferences, [field]: newValues });
    } else if (field === 'preferredPlatforms') {
        const platformValue = value as SocialPlatform;
        const currentValues = currentBrandPreferences[field] as SocialPlatform[];
        const newValues = currentValues.includes(platformValue)
            ? currentValues.filter(v => v !== platformValue)
            : [...currentValues, platformValue];
        setCurrentBrandPreferences({ ...currentBrandPreferences, [field]: newValues });
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(currentProfile);
    setBrandPreferences(currentBrandPreferences); // This will trigger toast from AppContext
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light mb-6">{t('profile')}</h1>
      <p className="mb-6 text-neutral-DEFAULT dark:text-neutral-300">{t('profilePageDescription')}</p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-neutral-dark p-6 sm:p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 border-b dark:border-gray-700 pb-2">{t('userProfile')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brandNameUser" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('brandName')}</label>
              <input
                type="text"
                name="brandName"
                id="brandNameUser"
                value={currentProfile.brandName}
                onChange={handleProfileChange}
                className="w-full p-2.5 bg-white text-neutral-dark placeholder-neutral-DEFAULT border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:placeholder-neutral-400 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="targetAudienceUser" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('targetAudience')}</label>
              <textarea
                name="targetAudience"
                id="targetAudienceUser"
                value={currentProfile.targetAudience}
                onChange={handleProfileChange}
                rows={3}
                className="w-full p-2.5 bg-white text-neutral-dark placeholder-neutral-DEFAULT border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:placeholder-neutral-400 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder={t('e.g., age, interests, location', {default: "e.g., age, interests, location"})}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 border-b dark:border-gray-700 pb-2">{t('brandPreferences')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="brandNamePref" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('brandName')}</label>
                <input
                    type="text"
                    name="brandName"
                    id="brandNamePref"
                    value={currentBrandPreferences.brandName}
                    onChange={handleBrandPreferencesChange}
                    className="w-full p-2.5 bg-white text-neutral-dark placeholder-neutral-DEFAULT border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:placeholder-neutral-400 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
            </div>
            <div>
              <label htmlFor="targetAudienceKeywords" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">
                {t('targetAudienceKeywords')} <span className="text-xs text-neutral-DEFAULT dark:text-neutral-300">(comma separated)</span>
              </label>
              <input
                type="text"
                name="targetAudienceKeywords"
                id="targetAudienceKeywords"
                value={currentBrandPreferences.targetAudienceKeywords.join(', ')}
                onChange={handleBrandPreferencesChange}
                className="w-full p-2.5 bg-white text-neutral-dark placeholder-neutral-DEFAULT border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:placeholder-neutral-400 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder={t('e.g., gaming, vegan, sustainable fashion', {default: "e.g., gaming, vegan, sustainable fashion"})}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium text-neutral-dark dark:text-neutral-light mb-2">{t('preferredCategories')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {AVAILABLE_CATEGORIES.map(category => (
                <label key={category} className="flex items-center space-x-2 p-2 border dark:border-gray-600 rounded-md hover:bg-neutral-light dark:hover:bg-neutral-darker cursor-pointer text-neutral-dark dark:text-neutral-light">
                  <input
                    type="checkbox"
                    checked={currentBrandPreferences.preferredCategories.includes(category)}
                    onChange={() => handleMultiSelectChange('preferredCategories', category)}
                    className="form-checkbox h-4 w-4 text-primary focus:ring-primary-dark rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 dark:checked:bg-primary"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium text-neutral-dark dark:text-neutral-light mb-2">{t('preferredPlatforms')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {AVAILABLE_PLATFORMS.map(platform => (
                <label key={platform} className="flex items-center space-x-2 p-2 border dark:border-gray-600 rounded-md hover:bg-neutral-light dark:hover:bg-neutral-darker cursor-pointer text-neutral-dark dark:text-neutral-light">
                  <input
                    type="checkbox"
                    checked={currentBrandPreferences.preferredPlatforms.includes(platform)}
                    onChange={() => handleMultiSelectChange('preferredPlatforms', platform)}
                    className="form-checkbox h-4 w-4 text-primary focus:ring-primary-dark rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 dark:checked:bg-primary"
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white font-medium text-sm rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors"
          >
            {t('savePreferences')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
