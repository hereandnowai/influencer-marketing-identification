
import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import InfluencerCard from '../components/InfluencerCard.tsx';
import { BookmarkIcon } from '../components/Icons.tsx';

const SavedInfluencersPage: React.FC = () => {
  const { languageState, savedInfluencers, removeSavedInfluencer, isInfluencerSaved, addSavedInfluencer } = useAppContext();
  const { t } = languageState;

  const handleRemove = (influencerId: string) => {
    removeSavedInfluencer(influencerId);
  };
  
  const toggleSave = (influencer:any) => { 
      if(isInfluencerSaved(influencer.id)){
          removeSavedInfluencer(influencer.id);
      } else {
          addSavedInfluencer(influencer);
      }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <BookmarkIcon className="h-8 w-8 text-primary dark:text-primary-light mr-3" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light">{t('savedShortlisted')}</h1>
      </div>
      <p className="mb-8 text-neutral-DEFAULT dark:text-neutral-300">{t('savedInfluencersPageDescription')}</p>

      {savedInfluencers.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-neutral-dark rounded-lg shadow">
          <BookmarkIcon className="h-16 w-16 text-neutral-light dark:text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-neutral-dark dark:text-neutral-light font-semibold mb-2">{t('noSavedInfluencersTitle', { default: 'No Saved Influencers Yet' })}</p>
          <p className="text-neutral-DEFAULT dark:text-neutral-300">{t('noSavedInfluencersMessage', { default: 'Start discovering and save influencers to see them here.' })}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedInfluencers.map(influencer => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              onSaveToggle={toggleSave}
              isSaved={true} 
              showSaveButton={false} 
              showRemoveButton={true} 
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInfluencersPage;