import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { GoogleGenAI } from "@google/genai";
import { GEMINI_TEXT_MODEL, LANGUAGES } from '../constants.ts';
import { Language, ChatMessage } from '../types.ts';
import { QuestionMarkCircleIcon, PaperAirplaneIcon, TrashIcon, MicrophoneIcon, SpeakerWaveIcon, SparklesIcon } from '../components/Icons.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const HelpPage: React.FC = () => {
  const { languageState, addToast, apiKeyStatus } = useAppContext();
  const { language: currentAppLanguage, setLanguage: setAppLanguage, t } = languageState;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const suggestionKeys = ['aiSuggestion1', 'aiSuggestion2', 'aiSuggestion3', 'aiSuggestion4'];


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false; // Process final result
      recognitionRef.current.lang = navigator.language; // Start with browser's language

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const detectedLang = recognitionRef.current.lang || navigator.language; // lang from result or recognizer
        setInput(transcript); // Set input field with transcript
        handleSpeechLanguageDetection(detectedLang.split('-')[0]); // Use base language code
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          addToast(t('speechRecognitionPermissionDenied'), 'error');
        } else {
          addToast(t('speechRecognitionError', { error: event.error }), 'error');
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

    } else {
      console.warn("Speech recognition not supported by this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [t, addToast]);
  
  const handleSpeechLanguageDetection = (detectedLangCode: string) => {
    const supportedLang = LANGUAGES.find(l => l.code === detectedLangCode);
    if (supportedLang) {
        if (currentAppLanguage !== supportedLang.code) {
            setAppLanguage(supportedLang.code as Language); // Toast is handled in AppContext
            // No need for separate toast here as AppContext handles it.
        }
    } else {
        addToast(t('languageNotSupportedForSwitch', { language: detectedLangCode }), 'warning');
    }
  };

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      addToast(t('speechRecognitionNotSupported'), 'warning');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Dynamically set recognition language based on current app language if desired
        // Or keep it to auto-detect based on browser/user speech
        recognitionRef.current.lang = currentAppLanguage || navigator.language;
        recognitionRef.current.start();
        setIsListening(true);
        addToast(t('listening'), 'info');
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        addToast(t('speechRecognitionError', {error: 'start-failed'}), 'error');
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    if (apiKeyStatus !== 'ok' || !process.env.API_KEY) {
      addToast(t('apiKeyNeededForAIChat', {default: 'API Key is required for AI chat functionality.'}), 'error');
      const aiErrorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: t('aiChatDisabledApiKey', {default: "AI chat is disabled. Please configure the API key."}), timestamp: Date.now() };
      setMessages(prev => [...prev, aiErrorMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are a helpful AI assistant for the 'Influencer Marketing Identification' application. Your goal is to assist users with their questions about influencer marketing, how to find influencers, understand analytics, and use the features of this application. Provide concise and relevant information. Respond in the language of the user's query if possible, otherwise default to English. The user's query language might be hinted by their app settings, but prioritize the language of the current input. Current app language setting: ${LANGUAGES.find(l => l.code === currentAppLanguage)?.name || 'English'}.`;
      
      const response = await ai.models.generateContent({
          model: GEMINI_TEXT_MODEL,
          contents: [{ role: "user", parts: [{ text: `User query (app language: ${currentAppLanguage}): ${currentInput}` }] }],
          config: {
            systemInstruction: systemInstruction,
          }
      });
      
      const aiResponseText = response.text;
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI chat error:", error);
      addToast(t('aiChatError', { default: 'Error communicating with AI. Please try again.' }), 'error');
      const aiErrorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: t('aiChatErrorResponse', {default: "Sorry, I couldn't process that request right now."}), timestamp: Date.now() };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    addToast(t('chatCleared', {default: 'Chat history cleared.'}), 'info');
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Attempt to set language for speech synthesis based on current app language
      const langISO = LANGUAGES.find(l => l.code === currentAppLanguage)?.code || 'en-US';
      utterance.lang = langISO;
      speechSynthesis.speak(utterance);
    } else {
      addToast('Text-to-speech not supported by your browser.', 'warning');
    }
  };

  const handleSuggestionClick = (suggestionKey: string) => {
    const suggestionText = t(suggestionKey);
    setInput(suggestionText);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex items-center mb-6">
        <QuestionMarkCircleIcon className="h-8 w-8 text-primary dark:text-primary-light mr-3" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-dark dark:text-neutral-light">{t('helpAiAssistant')}</h1>
      </div>
      <p className="mb-6 text-neutral-DEFAULT dark:text-neutral-300">{t('helpPageDescription')}</p>

      <div className="flex-grow flex flex-col bg-white dark:bg-neutral-dark shadow-xl rounded-lg overflow-hidden">
        <div className="flex-grow p-6 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
             <div className="text-center text-neutral-DEFAULT dark:text-neutral-300 h-full flex flex-col justify-center items-center">
                <QuestionMarkCircleIcon className="w-16 h-16 text-neutral-light dark:text-gray-700 mb-4"/>
                <p>{t('aiChatStart', {default: 'Ask the AI assistant anything about influencer marketing or how to use the app.'})}</p>
                <p className="text-xs mt-1">{t('aiChatExampleQuery', {default: 'e.g., "Who is the best tech influencer in India with high engagement?"'})}</p>
                
                <div className="mt-8 w-full max-w-md">
                  <h4 className="text-sm font-semibold text-neutral-dark dark:text-neutral-light mb-3 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 mr-1.5 text-primary dark:text-primary-light" />
                    {t('aiSuggestionsTitle', { default: "Or try these suggestions:"})}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestionKeys.map(key => (
                       <button
                        key={key}
                        onClick={() => handleSuggestionClick(key)}
                        className="px-3 py-1.5 bg-neutral-light dark:bg-neutral-darker text-primary dark:text-primary-light border border-primary/30 dark:border-primary-light/30 rounded-full text-xs hover:bg-primary/10 dark:hover:bg-primary-light/10 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50 transition-colors"
                       >
                         {t(key)}
                       </button>
                    ))}
                  </div>
                </div>
             </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-xl shadow relative group ${
                  msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-neutral-light dark:bg-gray-700 text-neutral-dark dark:text-neutral-light rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                    msg.sender === 'user' 
                    ? 'text-blue-200 dark:text-blue-300 opacity-80' 
                    : 'text-neutral-DEFAULT dark:text-neutral-400 opacity-80'
                  } text-right`}
                >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {msg.sender === 'ai' && (
                  <button 
                    onClick={() => speakMessage(msg.text)} 
                    className="absolute -top-2 -right-2 p-1 bg-white dark:bg-neutral-dark rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity text-neutral-DEFAULT dark:text-neutral-light hover:text-primary dark:hover:text-primary-light"
                    title="Speak message"
                    aria-label="Speak message"
                  >
                    <SpeakerWaveIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && !isListening && ( // Don't show AI thinking if user is dictating
            <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow bg-neutral-light dark:bg-gray-700 text-neutral-dark dark:text-neutral-light rounded-bl-none">
                    <LoadingSpinner size="sm" text={t('aiThinking', {default: "AI is thinking..."})} />
                </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-neutral-light dark:border-gray-700 bg-slate-50 dark:bg-neutral-darker">
          <div className="flex items-center space-x-2">
            <select
                value={currentAppLanguage}
                onChange={(e) => setAppLanguage(e.target.value as Language)}
                className="p-3 bg-white text-neutral-dark border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                aria-label={t('language')}
                disabled={isLoading}
            >
                {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name.length > 3 ? lang.code.toUpperCase() : lang.name}</option>
                ))}
            </select>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && !isListening && handleSendMessage()}
              placeholder={isListening ? t('listening') : t('aiChatPlaceholder')}
              className="flex-grow p-3 bg-white text-neutral-dark placeholder-neutral-DEFAULT border border-gray-300 dark:bg-neutral-dark dark:text-neutral-light dark:placeholder-neutral-400 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              disabled={isLoading || isListening || apiKeyStatus !== 'ok'}
            />
            <button
              onClick={handleToggleListening}
              disabled={isLoading || apiKeyStatus !== 'ok' || !recognitionRef.current}
              className={`p-3 rounded-xl shadow-md transition-colors disabled:opacity-50 ${
                isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-secondary hover:bg-secondary-dark text-white'
              }`}
              title={isListening ? "Stop listening" : "Speak input"}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === '' || apiKeyStatus !== 'ok' || isListening}
              className="p-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-neutral-darker focus:ring-primary-dark transition-colors disabled:opacity-50"
              title={t('sendMessage')}
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
             <button
              onClick={clearChat}
              disabled={isLoading || messages.length === 0}
              className="p-3 bg-gray-200 dark:bg-gray-700 text-neutral-dark dark:text-neutral-light rounded-xl shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-neutral-darker focus:ring-gray-500 transition-colors disabled:opacity-50"
              title={t('clearChat')}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
            {apiKeyStatus !== 'ok' && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 text-center">{t('aiChatDisabledApiKeyShort', {default: "AI Chat disabled: API Key not configured."})}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
