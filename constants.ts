
import { MenuItem, SocialPlatform, Language } from './types.ts';
import { AppHomeIcon, UserCircleIcon, MagnifyingGlassIcon, ChartBarIcon, AdjustmentsHorizontalIcon, BookmarkIcon, DocumentTextIcon, CogIcon, QuestionMarkCircleIcon } from './components/Icons.tsx';

export const APP_NAME = "Influencer Marketing Identification";
export const COMPANY_NAME = "HEREANDNOW AI RESEARCH INSTITUTE";
export const COMPANY_LOGO_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Fevicon%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-03.png";
export const COMPANY_IMAGE_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', labelKey: 'home', path: '/home', icon: AppHomeIcon }, // New Home item
  { id: 'dashboard', labelKey: 'dashboard', path: '/dashboard', icon: AppHomeIcon }, // Uses AppHomeIcon
  { id: 'profile', labelKey: 'profile', path: '/profile', icon: UserCircleIcon },
  { id: 'discover', labelKey: 'discoverInfluencers', path: '/discover', icon: MagnifyingGlassIcon },
  { id: 'analytics', labelKey: 'analytics', path: '/analytics', icon: ChartBarIcon },
  { id: 'compare', labelKey: 'compare', path: '/compare', icon: AdjustmentsHorizontalIcon },
  { id: 'saved', labelKey: 'savedShortlisted', path: '/saved', icon: BookmarkIcon },
  { id: 'reports', labelKey: 'reports', path: '/reports', icon: DocumentTextIcon },
  { id: 'settings', labelKey: 'settings', path: '/settings', icon: CogIcon },
  { id: 'help', labelKey: 'helpAiAssistant', path: '/help', icon: QuestionMarkCircleIcon },
];

export const AVAILABLE_PLATFORMS: SocialPlatform[] = [
  SocialPlatform.Instagram,
  SocialPlatform.TikTok,
  SocialPlatform.YouTube,
  SocialPlatform.Twitter,
  SocialPlatform.Facebook,
];

export const AVAILABLE_CATEGORIES: string[] = [
  "Beauty", "Fashion", "Tech", "Gaming", "Travel", "Food", "Fitness", "Lifestyle", "Education", "Finance"
];

export const LANGUAGES = [
  { code: Language.EN, name: "English" },
  { code: Language.HI, name: "हिन्दी" }, // Hindi
  { code: Language.TA, name: "தமிழ்" }, // Tamil
  { code: Language.FR, name: "Français" }, // French
  { code: Language.NL, name: "Nederlands" }, // Dutch
  { code: Language.ES, name: "Español" }, // Spanish
];

export const DEFAULT_LANGUAGE = Language.EN;

export const MOCK_API_KEY_PLACEHOLDER = "YOUR_GEMINI_API_KEY"; // Placeholder