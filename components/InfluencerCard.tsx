
import React from 'react';
import { Influencer, SocialPlatform } from '../types.ts';
import { BookmarkIcon, CheckCircleIcon, TrashIcon } from './Icons.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Link } from 'react-router-dom';

interface InfluencerCardProps {
  influencer: Influencer;
  onSaveToggle?: (influencer: Influencer) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
  showRemoveButton?: boolean; // For saved list
  onRemove?: (influencerId: string) => void; // For saved list
}

const PlatformIcon: React.FC<{ platform: SocialPlatform }> = ({ platform }) => {
  let iconClass = "h-5 w-5 ";
  switch (platform) {
    case SocialPlatform.Instagram: iconClass += "text-pink-500"; break;
    case SocialPlatform.TikTok: iconClass += "text-black dark:text-white"; break; 
    case SocialPlatform.YouTube: iconClass += "text-red-600"; break;
    case SocialPlatform.Twitter: iconClass += "text-blue-400"; break;
    case SocialPlatform.Facebook: iconClass += "text-blue-600"; break;
    default: iconClass += "text-gray-500 dark:text-gray-400";
  }
  // Simplified platform display as single character for brevity in some contexts.
  // Full name is better for accessibility if space allows (e.g., via title attribute).
  let platformInitial = platform.charAt(0);
   if (platform === SocialPlatform.YouTube) platformInitial = 'Y';
   if (platform === SocialPlatform.TikTok) platformInitial = 'T';

  return <span className={iconClass} title={platform}>{platformInitial}</span>;
};


const InfluencerCard: React.FC<InfluencerCardProps> = ({
  influencer,
  onSaveToggle,
  isSaved,
  showSaveButton = true,
  showRemoveButton = false,
  onRemove
}) => {
  const { languageState } = useAppContext();
  const { t } = languageState;

  return (
    <div className="bg-white dark:bg-neutral-dark shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div className="relative">
        <img
          src={influencer.profilePictureUrl || `https://picsum.photos/seed/${influencer.id}/400/200`}
          alt={influencer.name}
          className="w-full h-40 object-cover"
        />
        {influencer.isVerified && (
          <span title={t('verified')}>
            <CheckCircleIcon className="absolute top-2 right-2 h-6 w-6 text-blue-500 bg-white dark:bg-neutral-light rounded-full p-0.5" />
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light truncate" title={influencer.name}>
            {influencer.name}
          </h3>
          <PlatformIcon platform={influencer.platform} />
        </div>
        <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300 mb-1">
          <span className="font-medium">{t('followers')}:</span> {influencer.followers}
        </p>
        <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300 mb-1">
          <span className="font-medium">{t('engagementRate')}:</span> {influencer.engagementRate}
        </p>
        <p className="text-sm text-neutral-DEFAULT dark:text-neutral-300 mb-3">
          <span className="font-medium">{t('niche')}:</span> {influencer.niche}
        </p>
        
        {influencer.samplePostIdea && (
             <p className="text-xs text-neutral-DEFAULT dark:text-neutral-300 bg-neutral-light dark:bg-neutral-darker p-2 rounded-md mb-3 italic">
             <strong>{t('aiIdea')}:</strong> {influencer.samplePostIdea}
           </p>
        )}

        <div className="flex items-center justify-between space-x-2">
          <Link
            to={`/analytics/${influencer.id}`}
            className="flex-grow text-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {t('viewDetails')}
          </Link>
          {showSaveButton && onSaveToggle && (
            <button
              onClick={() => onSaveToggle(influencer)}
              title={isSaved ? t('unsaveInfluencer') : t('saveInfluencer')}
              className={`p-2 rounded-md transition-colors ${
                isSaved ? 'bg-secondary text-white hover:bg-secondary-dark' : 'bg-neutral-light dark:bg-gray-700 text-neutral-dark dark:text-neutral-light hover:bg-slate-300 dark:hover:bg-gray-600'
              }`}
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
          )}
          {showRemoveButton && onRemove && (
             <button
             onClick={() => onRemove(influencer.id)}
             title={t('removeInfluencer')}
             className="p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
           >
             <TrashIcon className="h-5 w-5" />
           </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerCard;