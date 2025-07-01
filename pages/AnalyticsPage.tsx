
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Influencer, SocialPlatform, AudienceDemographics, EngagementMetrics } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { ArrowLeftIcon, BookmarkIcon, UsersIcon, FireIcon, LocationMarkerIcon, CalendarIcon, TrendingUpIcon, CheckCircleIcon } from '../components/Icons.tsx'; // Added CheckCircleIcon

const mockInfluencerDetails: Record<string, Influencer> = {
  '1': { 
    id: '1', name: 'Alice Wonderland', platform: SocialPlatform.Instagram, followers: '1.2M', engagementRate: '3.5%', niche: 'Lifestyle', 
    profilePictureUrl: 'https://i.pravatar.cc/300?u=alice', isVerified: true,
    bio: 'Exploring the world one adventure at a time. Lover of tea, books, and sustainable fashion. Join my journey! ✨',
    audienceDemographics: {
      ageRange: [{ range: "18-24", percentage: 40 }, { range: "25-34", percentage: 35 }, { range: "35-44", percentage: 15 }],
      genderSplit: [{ gender: "Female", percentage: 70 }, { gender: "Male", percentage: 25 }, { gender: "Other", percentage: 5 }],
      topLocations: [{ location: "New York, USA", percentage: 20 }, { location: "London, UK", percentage: 15 }, { location: "Paris, FR", percentage: 10 }]
    },
    engagementMetrics: { likes: 12000, comments: 350, shares: 150, growthRate: 1.2 },
    contentExamples: [
      { type: 'image', url: 'https://picsum.photos/seed/alice_post1/400/300', caption: 'Beautiful sunset views! #travel'},
      { type: 'video', url: 'https://dummy-video-url.com/alice_video.mp4', caption: 'My morning routine #lifestyle'},
    ]
  },
   '2': { 
    id: '2', name: 'Bob The Builder', platform: SocialPlatform.YouTube, followers: '500K', engagementRate: '5.1%', niche: 'DIY & Crafts', 
    profilePictureUrl: 'https://i.pravatar.cc/300?u=bob',
    bio: 'Can we fix it? Yes we can! Tutorials, tips, and tricks for all your DIY projects. Subscribe for weekly builds!',
    audienceDemographics: {
      ageRange: [{ range: "25-34", percentage: 45 }, { range: "35-44", percentage: 30 }, { range: "45-54", percentage: 15 }],
      genderSplit: [{ gender: "Male", percentage: 65 }, { gender: "Female", percentage: 30 }, { gender: "Other", percentage: 5 }],
      topLocations: [{ location: "California, USA", percentage: 25 }, { location: "Texas, USA", percentage: 18 }, { location: "Ontario, CA", percentage: 12 }]
    },
    engagementMetrics: { likes: 8000, comments: 500, shares: 250, growthRate: 2.5 }
  },
};


const AnalyticsPage: React.FC = () => {
  const { influencerId } = useParams<{ influencerId: string }>();
  const { languageState, savedInfluencers, addSavedInfluencer, removeSavedInfluencer, isInfluencerSaved, addToast } = useAppContext();
  const { t } = languageState;
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (influencerId) {
        const found = savedInfluencers.find(inf => inf.id === influencerId) || mockInfluencerDetails[influencerId];
        if (found) {
            const fullData = { ...mockInfluencerDetails[found.id], ...found }; // Ensure mock details are used as base
            setInfluencer(fullData);
        } else {
            addToast(t('influencerNotFound', {default: 'Influencer not found.'}), 'error');
        }
      } else {
        // This case is handled by the return below, but good for explicit logic
        // addToast(t('noInfluencerSelectedAnalytics', {default: 'No influencer selected for analytics.'}), 'info');
      }
      setIsLoading(false);
    }, 500);
  }, [influencerId, savedInfluencers, t, addToast]);

  const toggleSaveInfluencer = () => {
    if (influencer) {
      if (isInfluencerSaved(influencer.id)) {
        removeSavedInfluencer(influencer.id);
      } else {
        addSavedInfluencer(influencer);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={t('loadingAnalytics', {default: 'Loading analytics...'})} className="mt-20" />;
  }

  if (!influencerId) {
    return (
        <div className="p-4 md:p-6 lg:p-8 text-center">
            <h1 className="text-2xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('analytics')}</h1>
            <p className="text-neutral-DEFAULT dark:text-neutral-300 mb-4">{t('selectInfluencerForAnalytics', {default: 'Please select an influencer to view their detailed analytics.'})}</p>
            <Link to="/discover" className="text-primary dark:text-primary-light hover:underline">{t('discoverInfluencers')}</Link>
        </div>
    );
  }
  
  if (!influencer) {
    return (
      <div className="p-4 md:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('influencerNotFound', {default: 'Influencer Not Found'})}</h1>
        <p className="text-neutral-DEFAULT dark:text-neutral-300 mb-4">{t('couldNotFindInfluencer', {default: 'Sorry, we could not find details for the requested influencer.'})}</p>
        <Link to="/discover" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> {t('backToDiscover', {default: 'Back to Discover'})}
        </Link>
      </div>
    );
  }
  
  const DemographicsChart: React.FC<{ data: { label: string; percentage: number }[]; title: string }> = ({ data, title }) => (
    <div className="mb-4">
      <h4 className="text-md font-semibold text-neutral-dark dark:text-neutral-light mb-2">{title}</h4>
      <div className="space-y-1">
        {data.map(item => (
          <div key={item.label} className="flex items-center">
            <span className="w-24 text-sm text-neutral-DEFAULT dark:text-neutral-300">{item.label}:</span>
            <div className="w-full bg-neutral-light dark:bg-gray-600 rounded-full h-4">
              <div className="bg-primary h-4 rounded-full" style={{ width: `${item.percentage}%` }}></div>
            </div>
            <span className="ml-2 text-sm font-medium text-primary dark:text-primary-light">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Link to="/discover" className="inline-flex items-center text-primary dark:text-primary-light hover:underline mb-6 text-sm">
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        {t('backToDiscover', {default: 'Back to Discover'})}
      </Link>

      <div className="bg-white dark:bg-neutral-dark p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-6 border-b border-neutral-light dark:border-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <img src={influencer.profilePictureUrl || `https://i.pravatar.cc/150?u=${influencer.id}`} alt={influencer.name} className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover mr-4 sm:mr-6 shadow-md" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-dark dark:text-neutral-light flex items-center">
                {influencer.name} 
                {influencer.isVerified && (
                  <span title={t('verified')}>
                    <CheckCircleIcon className="h-6 w-6 text-primary dark:text-primary-light ml-2" />
                  </span>
                )}
              </h1>
              <p className="text-md text-neutral-DEFAULT dark:text-neutral-300">@{influencer.name.toLowerCase().replace(/\s+/g, '')} - {influencer.platform}</p>
              <p className="text-sm text-primary dark:text-primary-light font-medium">{influencer.niche}</p>
            </div>
          </div>
          <button
            onClick={toggleSaveInfluencer}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              isInfluencerSaved(influencer.id) 
                ? 'bg-secondary text-white hover:bg-secondary-dark' 
                : 'bg-neutral-light dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 text-neutral-dark dark:text-neutral-light'
            }`}
          >
            <BookmarkIcon className="h-5 w-5 mr-2" />
            {isInfluencerSaved(influencer.id) ? t('unsaveInfluencer') : t('saveInfluencer')}
          </button>
        </div>

        {influencer.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-dark dark:text-neutral-light mb-2">{t('bio', {default: 'Bio'})}</h3>
            <p className="text-neutral-DEFAULT dark:text-neutral-300 leading-relaxed">{influencer.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('followers'), value: influencer.followers, icon: UsersIcon },
            { label: t('engagementRate'), value: influencer.engagementRate, icon: FireIcon },
            { label: t('avgLikes', {default: 'Avg. Likes'}), value: influencer.engagementMetrics?.likes.toLocaleString() || 'N/A', icon: FireIcon },
            { label: t('growthRate', {default: 'Growth Rate'}), value: `${influencer.engagementMetrics?.growthRate || 0}%`, icon: TrendingUpIcon }
          ].map(metric => (
            <div key={metric.label} className="bg-neutral-light dark:bg-neutral-darker p-4 rounded-lg shadow">
              <div className="flex items-center text-neutral-dark dark:text-neutral-light mb-1">
                <metric.icon className="h-5 w-5 mr-2 text-primary dark:text-primary-light" />
                <h4 className="text-sm font-medium">{metric.label}</h4>
              </div>
              <p className="text-xl font-bold text-neutral-dark dark:text-neutral-light">{metric.value}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {influencer.audienceDemographics && (
            <div className="bg-neutral-light dark:bg-neutral-darker p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('audienceDemographics', {default: 'Audience Demographics'})}</h3>
              <DemographicsChart data={influencer.audienceDemographics.ageRange.map(ar => ({label: ar.range, percentage: ar.percentage}))} title={t('ageRange', {default: 'Age Range'})} />
              <DemographicsChart data={influencer.audienceDemographics.genderSplit.map(gs => ({label: gs.gender, percentage: gs.percentage}))} title={t('genderSplit', {default: 'Gender Split'})} />
               <div>
                  <h4 className="text-md font-semibold text-neutral-dark dark:text-neutral-light mb-2">{t('topLocations', {default: 'Top Locations'})}</h4>
                  <ul className="list-disc list-inside text-sm text-neutral-DEFAULT dark:text-neutral-300">
                    {influencer.audienceDemographics.topLocations.slice(0,3).map(loc => (
                      <li key={loc.location}><LocationMarkerIcon className="inline h-4 w-4 mr-1 text-primary dark:text-primary-light"/>{loc.location} ({loc.percentage}%)</li>
                    ))}
                  </ul>
              </div>
            </div>
          )}

          {influencer.engagementMetrics && (
            <div className="bg-neutral-light dark:bg-neutral-darker p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('engagementQuality', {default: 'Engagement Quality'})}</h3>
              <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300">{t('avgComments', {default: 'Avg. Comments per post:'})} <span className="font-semibold text-neutral-dark dark:text-neutral-light">{influencer.engagementMetrics.comments.toLocaleString()}</span></p>
              <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300">{t('avgShares', {default: 'Avg. Shares per post:'})} <span className="font-semibold text-neutral-dark dark:text-neutral-light">{influencer.engagementMetrics.shares.toLocaleString()}</span></p>
            </div>
          )}
        </div>
        
        {influencer.contentExamples && influencer.contentExamples.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('contentExamples', {default: 'Content Examples'})}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {influencer.contentExamples.map((content, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow bg-white dark:bg-neutral-darker">
                  {content.type === 'image' && <img src={content.url} alt={`Content ${index + 1}`} className="w-full h-40 object-cover" />}
                  {content.type === 'video' && (
                    <div className="w-full h-40 bg-neutral-dark dark:bg-neutral-darker text-white dark:text-neutral-light flex items-center justify-center">
                      <p>{t('videoPlaceholder', {default: 'Video Preview'})}</p>
                    </div>
                  )}
                  {content.caption && <p className="p-2 text-xs bg-white dark:bg-neutral-darker text-neutral-DEFAULT dark:text-neutral-300">{content.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyticsPage;