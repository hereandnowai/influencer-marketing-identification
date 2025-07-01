
import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { ChartBarIcon, UsersIcon, TrendingUpIcon, FireIcon, AppHomeIcon, BookmarkIcon, DocumentTextIcon, MagnifyingGlassIcon, ArrowPathIcon } from '../components/Icons.tsx'; 
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { languageState } = useAppContext();
  const { t } = languageState;

  const summaryData = [
    { title: t('totalInfluencersTracked', { default: "Total Influencers Tracked" }), value: "1,250", icon: UsersIcon, color: "bg-blue-500", textColor: "text-white" },
    { title: t('averageEngagementRate', { default: "Average Engagement Rate" }), value: "3.5%", icon: TrendingUpIcon, color: "bg-green-500", textColor: "text-white" },
    { title: t('campaignsActive', { default: "Campaigns Active" }), value: "12", icon: ChartBarIcon, color: "bg-yellow-500", textColor: "text-neutral-800" }, // Keep dark text on yellow
  ];

  const performanceHighlightsData = [
    { title: t('topPerformingNiche', { default: "Top Performing Niche" }), value: "Tech Gadgets", icon: FireIcon, color: "text-red-500 dark:text-red-400" },
    { title: t('mostEngagingPlatform', { default: "Most Engaging Platform" }), value: "TikTok", icon: AppHomeIcon, color: "text-purple-500 dark:text-purple-400" },
    { title: t('audienceGrowthTrend', { default: "Audience Growth Trend" }), value: "+5% MoM", icon: TrendingUpIcon, color: "text-green-500 dark:text-green-400" },
  ];

  const recentActivityData = [
    { id: '1', text: t('activityNewMatch', {name: 'Elena Ray', criteria: 'Sustainable Fashion'}), icon: UsersIcon, time: t('activityTimeNow', {default: 'Just now'}) },
    { id: '2', text: t('activityReportGenerated', {reportName: 'Tech Trends Q3'}), icon: DocumentTextIcon, time: t('activityTimeMinutesAgo', {minutes: '5'}) },
    { id: '3', text: t('activityEngagementIncrease', {name: 'Alex Gamer', increase: '0.5%'}), icon: TrendingUpIcon, time: t('activityTimeHourAgo', {hours: '1'}) },
    { id: '4', text: t('activityNewCampaignAdded', {campaignName: 'Summer Fitness Challenge'}), icon: ChartBarIcon, time: t('activityTimeHoursAgo', {hours: '3'}) },
  ];
  
  const quickActionsData = [
    { labelKey: 'discoverInfluencers', path: '/discover', icon: MagnifyingGlassIcon, color: 'bg-primary hover:bg-primary-dark' },
    { labelKey: 'reports', path: '/reports', icon: DocumentTextIcon, color: 'bg-secondary hover:bg-secondary-dark' },
    { labelKey: 'savedShortlisted', path: '/saved', icon: BookmarkIcon, color: 'bg-blue-600 hover:bg-blue-700' }, // Different blue for variety
  ];


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light mb-2">{t('dashboard')}</h1>
        <p className="text-neutral-DEFAULT dark:text-neutral-300">{t('welcomeToDashboard')}</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryData.map(item => (
          <div key={item.title} className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${item.color} hover:shadow-xl transition-shadow duration-300`}>
            <item.icon className={`h-10 w-10 ${item.textColor === "text-white" ? "text-white" : "text-neutral-800"}`} />
            <div>
              <p className={`text-sm opacity-90 ${item.textColor}`}>{item.title}</p>
              <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Highlights */}
      <div>
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('performanceHighlights', {default: 'Performance Highlights'})}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceHighlightsData.map(item => (
                <div key={item.title} className="bg-white dark:bg-neutral-dark p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                        <item.icon className={`h-7 w-7 ${item.color}`} />
                        <h3 className="text-md font-semibold text-neutral-dark dark:text-neutral-light">{item.title}</h3>
                    </div>
                    <p className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">{item.value}</p>
                </div>
            ))}
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('recentActivity', {default: 'Recent Activity'})}</h2>
          <ul className="space-y-4">
            {recentActivityData.map(activity => (
              <li key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-neutral-light dark:border-gray-700 last:border-b-0">
                <activity.icon className="h-6 w-6 text-primary dark:text-primary-light flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <p className="text-sm text-neutral-dark dark:text-neutral-light">{activity.text}</p>
                  <p className="text-xs text-neutral-DEFAULT dark:text-neutral-300">{activity.time}</p>
                </div>
                <button className="text-neutral-DEFAULT dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light p-1 rounded-full">
                   <ArrowPathIcon className="h-4 w-4"/>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('quickActions', {default: 'Quick Actions'})}</h2>
          <div className="space-y-3">
            {quickActionsData.map(action => (
                <Link
                key={action.labelKey}
                to={action.path}
                className={`w-full flex items-center justify-center text-white px-4 py-3 rounded-md text-sm font-medium transition-colors duration-300 shadow-md hover:shadow-lg ${action.color}`}
              >
                <action.icon className="h-5 w-5 mr-2" />
                {t(action.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;