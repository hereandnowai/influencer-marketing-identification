
import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { SparklesIcon, ChartBarIcon, AdjustmentsHorizontalIcon, DocumentTextIcon, TranslateIcon, QuestionMarkCircleIcon, UserCircleIcon, ShieldCheckIcon, MagnifyingGlassIcon } from '../components/Icons.tsx';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleKey: string;
  descriptionKey: string;
  color: string; // Tailwind color class for icon and accent
  linkTo?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, titleKey, descriptionKey, color, linkTo }) => {
  const { languageState } = useAppContext();
  const { t } = languageState;

  const cardContent = (
    <>
      <div className={`p-3 rounded-full ${color} inline-block mb-4`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-2">{t(titleKey)}</h3>
      <p className="text-neutral-DEFAULT dark:text-neutral-300 text-sm leading-relaxed">{t(descriptionKey)}</p>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
      {cardContent}
    </div>
  );
};


const HomePage: React.FC = () => {
  const { languageState } = useAppContext();
  const { t } = languageState;

  const features: FeatureCardProps[] = [
    { icon: MagnifyingGlassIcon, titleKey: 'featureAIDiscoveryTitle', descriptionKey: 'featureAIDiscoveryDesc', color: 'bg-primary', linkTo: '/discover' },
    { icon: ChartBarIcon, titleKey: 'featureAnalyticsTitle', descriptionKey: 'featureAnalyticsDesc', color: 'bg-secondary', linkTo: '/analytics' },
    { icon: AdjustmentsHorizontalIcon, titleKey: 'featureCompareTitle', descriptionKey: 'featureCompareDesc', color: 'bg-green-500', linkTo: '/compare' },
    { icon: DocumentTextIcon, titleKey: 'featureReportsTitle', descriptionKey: 'featureReportsDesc', color: 'bg-yellow-500', linkTo: '/reports' },
    { icon: TranslateIcon, titleKey: 'featureMultiLanguageTitle', descriptionKey: 'featureMultiLanguageDesc', color: 'bg-purple-500', linkTo: '/settings' },
    { icon: QuestionMarkCircleIcon, titleKey: 'featureAIAssistantTitle', descriptionKey: 'featureAIAssistantDesc', color: 'bg-teal-500', linkTo: '/help' },
    { icon: UserCircleIcon, titleKey: 'featureProfileManagementTitle', descriptionKey: 'featureProfileManagementDesc', color: 'bg-indigo-500', linkTo: '/profile' },
    { icon: ShieldCheckIcon, titleKey: 'featureSecureReliableTitle', descriptionKey: 'featureSecureReliableDesc', color: 'bg-pink-500' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="text-center mb-12">
        <SparklesIcon className="h-16 w-16 text-primary dark:text-primary-light mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark dark:text-neutral-light mb-3">
          {t('homePageTitle')}
        </h1>
        <p className="text-lg text-neutral-DEFAULT dark:text-neutral-300 max-w-2xl mx-auto">
          {t('homePageDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map(feature => (
          <FeatureCard key={feature.titleKey} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;