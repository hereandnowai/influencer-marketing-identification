
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Influencer, SocialPlatform } from '../types.ts';
import InfluencerCard from '../components/InfluencerCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { AVAILABLE_PLATFORMS, AVAILABLE_CATEGORIES, GEMINI_TEXT_MODEL } from '../constants.ts';
import { MagnifyingGlassIcon } from '../components/Icons.tsx';
import { GoogleGenAI } from '@google/genai';

const mockInfluencers: Influencer[] = [
  { id: '1', name: 'Alice Wonderland', platform: SocialPlatform.Instagram, followers: '1.2M', engagementRate: '3.5%', numericEngagementRate: 3.5, numericFollowers: 1200000, niche: 'Lifestyle', profilePictureUrl: 'https://i.pravatar.cc/300?u=alice', isVerified: true, samplePostIdea: 'My top 5 sustainable living tips!' },
  { id: '2', name: 'Bob The Builder', platform: SocialPlatform.YouTube, followers: '500K', engagementRate: '5.1%', numericEngagementRate: 5.1, numericFollowers: 500000, niche: 'DIY & Crafts', profilePictureUrl: 'https://i.pravatar.cc/300?u=bob', samplePostIdea: 'Building a birdhouse from recycled materials.' },
  { id: '3', name: 'Charlie Chaplin', platform: SocialPlatform.TikTok, followers: '2.5M', engagementRate: '10.2%', numericEngagementRate: 10.2, numericFollowers: 2500000, niche: 'Comedy', profilePictureUrl: 'https://i.pravatar.cc/300?u=charlie', isVerified: true },
  { id: '4', name: 'Diana Prince', platform: SocialPlatform.Twitter, followers: '800K', engagementRate: '2.1%', numericEngagementRate: 2.1, numericFollowers: 800000, niche: 'Activism', profilePictureUrl: 'https://i.pravatar.cc/300?u=diana' },
  { id: '5', name: 'Edward Scissorhands', platform: SocialPlatform.Instagram, followers: '950K', engagementRate: '4.0%', numericEngagementRate: 4.0, numericFollowers: 950000, niche: 'Art & Design', profilePictureUrl: 'https://i.pravatar.cc/300?u=edward', samplePostIdea: 'Creating intricate paper art.' },
];

const DiscoverPage: React.FC = () => {
  const { languageState, addToast, brandPreferences, savedInfluencers, addSavedInfluencer, removeSavedInfluencer, isInfluencerSaved, apiKeyStatus } = useAppContext();
  const { t } = languageState;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [results, setResults] = useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);

  useEffect(() => {
    if (brandPreferences) {
      setSearchTerm(brandPreferences.targetAudienceKeywords.join(', '));
      setSelectedPlatform(brandPreferences.preferredPlatforms[0] || '');
      setSelectedCategory(brandPreferences.preferredCategories[0] || '');
    }
  }, [brandPreferences]);


  const handleSearch = async () => {
    setIsLoading(true);
    setResults([]); 

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (useAI && apiKeyStatus === 'ok' && process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Find influencers for a brand targeting '${searchTerm || 'general audience'}' interested in '${selectedCategory || 'any category'}' on '${selectedPlatform || 'any platform'}'. Suggest 3-5 influencers with name, platform (from Instagram, YouTube, TikTok, Twitter, Facebook), follower count (e.g., "100K", "1.5M"), engagement rate (e.g., "2.5%"), primary niche, and a creative post idea for the brand.
The output MUST be a valid JSON array. All string values within the JSON objects, especially for 'niche' and 'samplePostIdea', must be properly escaped (e.g., quotes as \\", newlines as \\n).
The JSON array should follow this structure: [{"id": "unique_id_string", "name": "Influencer Name", "platform": "PlatformName", "followers": "FollowerCountString", "engagementRate": "EngagementRateString", "niche": "Niche description as a JSON-safe string", "profilePictureUrl": "https://i.pravatar.cc/300?u=unique_influencer_slug", "samplePostIdea": "A creative post idea as a JSON-safe string", "isVerified": true_or_false}]`;
        
        const response = await ai.models.generateContent({
          model: GEMINI_TEXT_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { responseMimeType: "application/json" }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }
        
        const aiResults = JSON.parse(jsonStr) as Influencer[];
        setResults(aiResults.map(inf => ({...inf, id: inf.id || Math.random().toString(36).substr(2,9) })));
        addToast(t('aiSuggestionsLoaded', {default: 'AI suggestions loaded!'}), 'success');

      } catch (error) {
        console.error("AI search failed:", error);
        addToast(t('aiSearchFailed', { default: 'AI search failed. Using mock data.'}), 'error');
        setResults(mockInfluencers.filter(inf => 
          inf.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedPlatform ? inf.platform === selectedPlatform : true) &&
          (selectedCategory ? inf.niche.toLowerCase().includes(selectedCategory.toLowerCase()) : true)
        ));
      }
    } else {
      const filteredResults = mockInfluencers.filter(inf => 
        inf.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedPlatform ? inf.platform === selectedPlatform : true) &&
        (selectedCategory ? inf.niche.toLowerCase().includes(selectedCategory.toLowerCase()) : true)
      );
      setResults(filteredResults);
       if (useAI && apiKeyStatus !== 'ok') {
        addToast(t('apiKeyMissingAI', { default: 'API key is missing or invalid. AI search disabled. Using mock data.' }), 'warning');
      }
    }
    setIsLoading(false);
  };
  
  const toggleSaveInfluencer = (influencer: Influencer) => {
    if (isInfluencerSaved(influencer.id)) {
      removeSavedInfluencer(influencer.id);
    } else {
      addSavedInfluencer(influencer);
    }
  };


  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light mb-6">{t('discoverInfluencers')}</h1>
      <p className="mb-6 text-neutral-DEFAULT dark:text-neutral-300">{t('discoverPageDescription')}</p>

      <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('search')}</label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('influencerName') + ", " + t('targetAudienceKeywords')}
              className="w-full p-2.5 bg-white text-neutral-dark placeholder-neutral-DEFAULT border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:placeholder-neutral-400 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('platform')}</label>
            <select
              id="platform"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform | '')}
              className="w-full p-2.5 bg-white text-neutral-dark border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">{t('allPlatforms', {default: 'All Platforms'})}</option>
              {AVAILABLE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('category')}</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 bg-white text-neutral-dark border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">{t('allCategories', {default: 'All Categories'})}</option>
              {AVAILABLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-2.5 bg-primary text-white font-medium text-sm rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              {isLoading ? t('searching', {default: 'Searching...'}) : t('search')}
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary focus:ring-primary-dark rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 dark:checked:bg-primary"
                disabled={apiKeyStatus !== 'ok'}
            />
            <label htmlFor="useAI" className="text-sm text-neutral-dark dark:text-neutral-light">
                {t('useAISearch', { default: 'Use AI Powered Search' })}
                 {apiKeyStatus !== 'ok' && <span className="text-xs text-red-500 dark:text-red-400"> ({t('apiKeyNeeded', {default: 'API Key needed'})})</span>}
            </label>
        </div>
      </div>

      {isLoading && <LoadingSpinner text={t('loadingInfluencers', { default: 'Loading influencers...'})} className="my-8" />}
      
      {!isLoading && results.length === 0 && (
        <p className="text-center text-neutral-DEFAULT dark:text-neutral-300 py-8">{t('noInfluencersFound', { default: 'No influencers found matching your criteria. Try broadening your search or using AI suggestions!' })}</p>
      )}

      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(influencer => (
            <InfluencerCard 
              key={influencer.id} 
              influencer={influencer}
              onSaveToggle={toggleSaveInfluencer}
              isSaved={isInfluencerSaved(influencer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
