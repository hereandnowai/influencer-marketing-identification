
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Influencer, SocialPlatform } from '../types.ts';
import InfluencerCard from '../components/InfluencerCard.tsx'; 
import { PlusCircleIcon, TrashIcon } from '../components/Icons.tsx';

const mockInfluencers: Influencer[] = [
  { id: '1', name: 'Alice Wonderland', platform: SocialPlatform.Instagram, followers: '1.2M', numericFollowers: 1200000, engagementRate: '3.5%', numericEngagementRate: 3.5, niche: 'Lifestyle', profilePictureUrl: 'https://i.pravatar.cc/300?u=alice', isVerified: true },
  { id: '2', name: 'Bob The Builder', platform: SocialPlatform.YouTube, followers: '500K', numericFollowers: 500000, engagementRate: '5.1%', numericEngagementRate: 5.1, niche: 'DIY & Crafts', profilePictureUrl: 'https://i.pravatar.cc/300?u=bob' },
  { id: '3', name: 'Charlie Chaplin', platform: SocialPlatform.TikTok, followers: '2.5M', numericFollowers: 2500000, engagementRate: '10.2%', numericEngagementRate: 10.2, niche: 'Comedy', profilePictureUrl: 'https://i.pravatar.cc/300?u=charlie', isVerified: true },
  { id: '4', name: 'Diana Prince', platform: SocialPlatform.Twitter, followers: '800K', numericFollowers: 800000, engagementRate: '2.1%', numericEngagementRate: 2.1, niche: 'Activism', profilePictureUrl: 'https://i.pravatar.cc/300?u=diana' },
];


const ComparePage: React.FC = () => {
  const { languageState, savedInfluencers, addToast } = useAppContext();
  const { t } = languageState;
  const [influencersToCompare, setInfluencersToCompare] = useState<Influencer[]>([]);
  const [selectableInfluencers, setSelectableInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    const combined = [...mockInfluencers, ...savedInfluencers];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    setSelectableInfluencers(unique);
  }, [savedInfluencers]);

  const addInfluencerToCompare = (influencer: Influencer) => {
    if (influencersToCompare.length < 4 && !influencersToCompare.find(i => i.id === influencer.id)) {
      setInfluencersToCompare([...influencersToCompare, influencer]);
    } else if (influencersToCompare.length >= 4) {
        addToast(t('compareLimitReached', {default: 'Maximum of 4 influencers can be compared.'}), 'warning');
    }
  };

  const removeInfluencerFromCompare = (influencerId: string) => {
    setInfluencersToCompare(influencersToCompare.filter(i => i.id !== influencerId));
  };
  
  const getNumericFollowers = (followers: string): number => {
    const value = parseFloat(followers);
    if (followers.toUpperCase().includes('M')) return value * 1000000;
    if (followers.toUpperCase().includes('K')) return value * 1000;
    return value;
  };
  
  const getNumericEngagementRate = (rate: string): number => {
      return parseFloat(rate.replace('%', ''));
  };

  const ComparisonTable: React.FC = () => {
    if (influencersToCompare.length === 0) {
      return <p className="text-neutral-DEFAULT dark:text-neutral-300 text-center py-4">{t('addInfluencersToCompare', {default: 'Add influencers to start comparison.'})}</p>;
    }

    const metrics = [
      { key: 'profilePictureUrl', label: t('profilePicture', {default: 'Profile Picture'}) },
      { key: 'name', label: t('name', {default: 'Name'}) },
      { key: 'platform', label: t('platform') },
      { key: 'followers', label: t('followers') },
      { key: 'engagementRate', label: t('engagementRate') },
      { key: 'niche', label: t('niche') },
    ];

    return (
      <div className="overflow-x-auto bg-white dark:bg-neutral-dark shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-neutral-light dark:divide-gray-700">
          <thead className="bg-neutral-light/50 dark:bg-neutral-darker">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-dark dark:text-neutral-light uppercase tracking-wider">{t('metric', {default: 'Metric'})}</th>
              {influencersToCompare.map(inf => (
                <th key={inf.id} className="px-4 py-3 text-left text-xs font-semibold text-neutral-dark dark:text-neutral-light uppercase tracking-wider truncate max-w-[150px]">
                  {inf.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-dark divide-y divide-neutral-light dark:divide-gray-700">
            {metrics.map(metric => (
              <tr key={metric.key} className="dark:text-neutral-light">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-dark dark:text-neutral-light">{metric.label}</td>
                {influencersToCompare.map(inf => {
                  const value = inf[metric.key as keyof Influencer];
                  let displayValue: React.ReactNode = typeof value === 'string' || typeof value === 'number' ? value : '';
                  
                  if (metric.key === 'profilePictureUrl') {
                    displayValue = <img src={inf.profilePictureUrl || `https://i.pravatar.cc/50?u=${inf.id}`} alt={inf.name} className="h-12 w-12 rounded-full object-cover mx-auto"/>;
                  }
                  
                  let cellClass = "px-4 py-3 whitespace-nowrap text-sm text-neutral-DEFAULT dark:text-neutral-300";
                  if (metric.key === 'followers') {
                     const numericVal = inf.numericFollowers || getNumericFollowers(inf.followers);
                     const allFollowers = influencersToCompare.map(i => i.numericFollowers || getNumericFollowers(i.followers));
                     if (numericVal === Math.max(...allFollowers) && influencersToCompare.length > 1) {
                        cellClass += " bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold";
                     }
                  }
                  if (metric.key === 'engagementRate') {
                    const numericVal = inf.numericEngagementRate || getNumericEngagementRate(inf.engagementRate);
                    const allRates = influencersToCompare.map(i => i.numericEngagementRate || getNumericEngagementRate(i.engagementRate));
                    if (numericVal === Math.max(...allRates) && influencersToCompare.length > 1) {
                        cellClass += " bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold";
                    }
                  }

                  return (
                    <td key={`${inf.id}-${metric.key}`} className={cellClass}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
             <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-dark dark:text-neutral-light"></td>
                {influencersToCompare.map(inf => (
                    <td key={`remove-${inf.id}`} className="px-4 py-3 text-center">
                        <button 
                            onClick={() => removeInfluencerFromCompare(inf.id)}
                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                            title={t('removeFromComparison', {default: 'Remove from comparison'})}
                        >
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light mb-6">{t('compare')}</h1>
      <p className="mb-6 text-neutral-DEFAULT dark:text-neutral-300">{t('comparePageDescription')}</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-3">{t('selectInfluencers', {default: 'Select Influencers to Compare (up to 4)'})}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-neutral-dark rounded-lg shadow max-h-96 overflow-y-auto">
          {selectableInfluencers.filter(sInf => !influencersToCompare.find(cInf => cInf.id === sInf.id)).length === 0 && (
            <p className="text-neutral-DEFAULT dark:text-neutral-300 col-span-full text-center py-4">{t('allSelectableComparedOrNone', {default: 'All available influencers are selected or no influencers to select.'})}</p>
          )}
          {selectableInfluencers
            .filter(sInf => !influencersToCompare.find(cInf => cInf.id === sInf.id))
            .map(influencer => (
            <div key={influencer.id} className="border dark:border-gray-700 p-3 rounded-md shadow-sm bg-neutral-light/30 dark:bg-neutral-darker hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-2">
                    <img src={influencer.profilePictureUrl || `https://i.pravatar.cc/40?u=${influencer.id}`} alt={influencer.name} className="h-10 w-10 rounded-full object-cover"/>
                    <div>
                        <p className="text-sm font-semibold text-neutral-dark dark:text-neutral-light truncate" title={influencer.name}>{influencer.name}</p>
                        <p className="text-xs text-neutral-DEFAULT dark:text-neutral-300">{influencer.platform} - {influencer.followers}</p>
                    </div>
                </div>
              <button
                onClick={() => addInfluencerToCompare(influencer)}
                disabled={influencersToCompare.length >=4}
                className="w-full flex items-center justify-center text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <PlusCircleIcon className="w-4 h-4 mr-1" /> {t('addForCompare', {default: 'Add to Compare'})}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <ComparisonTable />

    </div>
  );
};

export default ComparePage;