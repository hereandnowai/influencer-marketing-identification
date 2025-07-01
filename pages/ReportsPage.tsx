
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { DocumentTextIcon, DownloadIcon } from '../components/Icons.tsx';
import { Influencer } from '../types.ts';

const ReportsPage: React.FC = () => {
  const { languageState, savedInfluencers, addToast } = useAppContext();
  const { t } = languageState;
  
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);

  const handleCheckboxChange = (influencerId: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(influencerId) 
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const generateCSV = (data: Influencer[]) => {
    if (data.length === 0) {
        addToast(t('noDataToExport', {default: 'No data selected to export.'}), 'warning');
        return;
    }
    const headers = ['ID', 'Name', 'Platform', 'Followers', 'Engagement Rate', 'Niche'];
    const rows = data.map(inf => [inf.id, inf.name, inf.platform, inf.followers, inf.engagementRate, inf.niche].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "influencer_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(t('csvExported', {default: 'CSV report exported successfully!'}), 'success');
  };
  
  const generatePDF = (data: Influencer[]) => {
     if (data.length === 0) {
        addToast(t('noDataToExport', {default: 'No data selected to export.'}), 'warning');
        return;
    }
    addToast(t('pdfGenerationMock', {default: 'PDF generation is a premium feature (mock).'}), 'info');
    console.log("Simulating PDF generation for:", data);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const influencersToExport = savedInfluencers.filter(inf => selectedInfluencers.includes(inf.id));
    if (influencersToExport.length === 0) {
      addToast(t('noInfluencersSelectedForExport', {default: 'Please select influencers to export.'}), 'warning');
      return;
    }
    if (format === 'csv') {
      generateCSV(influencersToExport);
    } else {
      generatePDF(influencersToExport);
    }
  };


  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <DocumentTextIcon className="h-8 w-8 text-primary dark:text-primary-light mr-3" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light">{t('reports')}</h1>
      </div>
      <p className="mb-8 text-neutral-DEFAULT dark:text-neutral-300">{t('reportsPageDescription')}</p>

      <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">{t('generateReport', {default: 'Generate Report'})}</h2>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">{t('reportType', {default: 'Report Type'})}</label>
            <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value as 'summary' | 'detailed')}
                className="w-full md:w-1/3 p-2.5 bg-white text-neutral-dark border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
                <option value="summary">{t('summaryReport', {default: 'Summary Report'})}</option>
                <option value="detailed">{t('detailedReport', {default: 'Detailed Report (Mock)'})}</option>
            </select>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium text-neutral-dark dark:text-neutral-light mb-2">{t('selectInfluencersForReport', {default: 'Select Influencers for Report'})}</h3>
          {savedInfluencers.length === 0 ? (
             <p className="text-neutral-DEFAULT dark:text-neutral-300">{t('noSavedInfluencersForReport', { default: 'No saved influencers to generate a report. Save some influencers first.' })}</p>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-neutral-light dark:border-gray-700 rounded-md p-2 space-y-2">
              {savedInfluencers.map(inf => (
                <label key={inf.id} className="flex items-center space-x-2 p-2 hover:bg-neutral-light/50 dark:hover:bg-neutral-darker rounded cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedInfluencers.includes(inf.id)}
                    onChange={() => handleCheckboxChange(inf.id)}
                    className="form-checkbox h-4 w-4 text-primary focus:ring-primary-dark rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 dark:checked:bg-primary"
                  />
                  <img src={inf.profilePictureUrl || `https://i.pravatar.cc/30?u=${inf.id}`} alt={inf.name} className="h-8 w-8 rounded-full object-cover"/>
                  <span className="text-sm text-neutral-dark dark:text-neutral-light">{inf.name}</span>
                  <span className="text-xs text-neutral-DEFAULT dark:text-neutral-300">({inf.platform})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {savedInfluencers.length > 0 && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={selectedInfluencers.length === 0}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              {t('exportToCSV')}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={selectedInfluencers.length === 0}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              {t('exportToPDF')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
