// ============================================
// Core Types for ORION (formerly Emergency YouTube)
// ============================================

// AI Provider Types
export type AIProvider = "openai" | "google" | "anthropic";
export type AIModel = string;

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProvider;
}

// TTS Provider Types
export type TTSProvider = "openai" | "google" | "elevenlabs";

export interface TTSVoice {
  id: string;
  name: string;
  provider: TTSProvider;
}

// Image Generation Types
export type ImageProvider = "dalle" | "stability" | "replicate";

// Media Source Types
export type MediaSource = "pexels" | "pixabay" | "unsplash" | "ai_generated";

// ============================================
// Step 1: Menu de Entrada (Context)
// ============================================
export interface ChannelMetrics {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  watchTime: number;
  averageViewDuration: number;
  ctr: number;
  impressions: number;
  publishedAt: string;
}

export interface ContextData {
  id: string;
  createdAt: string;
  updatedAt: string;
  theme: string;
  autoMode: boolean;
  metrics: ChannelMetrics[];
  channelData: ChannelData | null;
}

export interface ChannelData {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  recentVideos: RecentVideo[];
}

export interface RecentVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// ============================================
// Step 2: Inteligência (Research)
// ============================================
export interface ResearchQuery {
  query: string;
  source: "tavily" | "llm_simulated";
  results: ResearchResult[];
}

export interface ResearchResult {
  title: string;
  url: string;
  snippet: string;
  score: number;
}

export interface ResearchData {
  id: string;
  createdAt: string;
  contextId: string;
  internalAnalysis: {
    topPerformingTopics: string[];
    audienceInsights: string[];
    contentGaps: string[];
    recommendations: string[];
  };
  externalAnalysis: {
    trendingTopics: string[];
    competitorInsights: string[];
    marketOpportunities: string[];
  };
  queries: ResearchQuery[];
  consolidatedInsights: string;
}

// ============================================
// Global: Engine de Diretrizes (Guidelines)
// ============================================
export type DiretrizScope = "script" | "thumbnail" | "audio" | "description" | "video";

export interface Diretriz {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  appliesTo: DiretrizScope[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuidelinesData {
  diretrizes: Diretriz[];
  updatedAt: string;
}

// ============================================
// Step 4: Proposta de Vídeo
// ============================================
export type AssetStatus = "pending" | "generating" | "ready" | "approved" | "error";

export interface ScriptSection {
  id: string;
  type: "hook" | "intro" | "content" | "cta" | "outro";
  content: string;
  duration: number; // estimated seconds
}

export interface Script {
  id: string;
  status: AssetStatus;
  sections: ScriptSection[];
  totalDuration: number;
  generatedAt: string;
  approvedAt: string | null;
  audioUrl: string | null;
  ttsProvider: TTSProvider | null;
  ttsVoice: string | null;
}

export interface SoundtrackSuggestion {
  id: string;
  title: string;
  artist: string;
  genre: string;
  url: string;
  duration: number;
  license: string;
  isUpload: boolean;
}

export interface Soundtrack {
  id: string;
  status: AssetStatus;
  suggestions: SoundtrackSuggestion[];
  selected: string | null;
  generatedAt: string;
  approvedAt: string | null;
}

export interface Description {
  id: string;
  status: AssetStatus;
  content: string;
  generatedAt: string;
  approvedAt: string | null;
}

export interface Tags {
  id: string;
  status: AssetStatus;
  items: string[];
  generatedAt: string;
  approvedAt: string | null;
}

export interface UploadSetup {
  category: string;
  language: string;
  license: "youtube" | "creative_commons";
  madeForKids: boolean;
  ageRestricted: boolean;
  paidPromotion: boolean;
  allowComments: boolean;
  allowEmbedding: boolean;
}

export interface TitleThumbnailVariation {
  id: string;
  title: string;
  thumbnailPrompt: string;
  thumbnailUrl: string | null;
  imageProvider: ImageProvider | null;
}

export interface TitlesAndThumbs {
  id: string;
  status: AssetStatus;
  variations: TitleThumbnailVariation[];
  selectedVariation: string | null;
  generatedAt: string;
  approvedAt: string | null;
}

export interface ProposalData {
  id: string;
  createdAt: string;
  updatedAt: string;
  contextId: string;
  researchId: string;
  rationale: string; // "Why this proposal will perform well"
  script: Script;
  soundtrack: Soundtrack;
  description: Description;
  tags: Tags;
  uploadSetup: UploadSetup;
  titlesAndThumbs: TitlesAndThumbs;
  allApproved: boolean;
}

// ============================================
// Step 5: Studio de Criação
// ============================================
export interface MediaItem {
  id: string;
  source: MediaSource;
  sourceId: string;
  url: string;
  previewUrl: string;
  type: "image" | "video";
  duration: number | null;
  attribution: string;
}

export interface StoryboardScene {
  id: string;
  order: number;
  scriptSectionId: string;
  text: string;
  voiceoverUrl: string | null;
  media: MediaItem | null;
  duration: number;
  transition: "cut" | "fade" | "dissolve";
}

export interface StoryboardData {
  id: string;
  createdAt: string;
  proposalId: string;
  scenes: StoryboardScene[];
  totalDuration: number;
}

export interface RenderData {
  id: string;
  createdAt: string;
  storyboardId: string;
  status: "pending" | "rendering" | "completed" | "error";
  progress: number;
  videoUrl: string | null;
  error: string | null;
}

// ============================================
// Step 6: Finalização e Upload
// ============================================
export interface UploadData {
  id: string;
  createdAt: string;
  proposalId: string;
  renderId: string;
  status: "pending" | "uploading" | "processing" | "published" | "error";
  youtubeVideoId: string | null;
  youtubeUrl: string | null;
  error: string | null;
}

// ============================================
// Application State
// ============================================
export type WorkflowStep = 1 | 2 | 4 | 5 | 6;

export interface WorkflowState {
  currentStep: WorkflowStep;
  context: ContextData | null;
  research: ResearchData | null;
  proposal: ProposalData | null;
  storyboard: StoryboardData | null;
  render: RenderData | null;
  upload: UploadData | null;
}

// ============================================
// API Response Types
// ============================================
export interface APIKeyStatus {
  youtube: boolean;
  openai: boolean;
  google: boolean;
  anthropic: boolean;
  pexels: boolean;
  pixabay: boolean;
  unsplash: boolean;
  json2video: boolean;
  elevenlabs: boolean;
  tavily: boolean;
  replicate: boolean;
  stability: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Settings & Profile System
// ============================================

// User Profile (Mock - Single Tenant)
export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

// Documentation CMS
export type DocCategory = "getting-started" | "features" | "api" | "changelog" | "guides";

export interface DocPage {
  id: string;
  title: string;
  category: DocCategory;
  content: string;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocsData {
  pages: DocPage[];
  updatedAt: string;
}

// Integration Tokens
export interface IntegrationTokens {
  github: {
    token: string;
    owner: string;
    repo: string;
  } | null;
  vercel: {
    token: string;
    projectId: string;
  } | null;
  updatedAt: string;
}

// System Logs
export type LogLevel = "info" | "warning" | "error" | "success";
export type LogSource = "system" | "workflow" | "api" | "user";

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  details?: Record<string, unknown>;
}

export interface LogsData {
  logs: SystemLog[];
}

// GitHub API Types
export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GitHubCommitsResponse {
  commits: GitHubCommit[];
  error?: string;
}

// Vercel API Types
export type VercelDeploymentState = "READY" | "ERROR" | "BUILDING" | "QUEUED" | "CANCELED";

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: VercelDeploymentState;
  createdAt: number;
  readyState: string;
}

export interface VercelDeploymentsResponse {
  deployments: VercelDeployment[];
  error?: string;
}

// Branding System (White Label)
export interface BrandingConfig {
  systemName: string;
  logoUrl: string | null;
  updatedAt: string;
}

// System Health Monitoring
export interface SystemHealth {
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  uptime: number;
  nodeVersion: string;
  platform: string;
  timestamp: string;
}

export interface APIHealthStatus {
  name: string;
  status: "online" | "offline" | "unknown";
  responseTime?: number;
  error?: string;
}

export interface SystemMonitorData {
  system: SystemHealth;
  apis: APIHealthStatus[];
}

// File Vault System (Vercel Blob)
export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  modifiedAt?: string;
  url?: string; // Vercel Blob URL
}

export interface DirectoryListing {
  path: string;
  entries: FileEntry[];
  totalSize?: number;
  totalFiles?: number;
  message?: string; // For error messages or status
}

// Settings Tabs
export type SettingsTab = "profile" | "docs" | "integrations" | "logs" | "appearance" | "monitor" | "files";

export interface SettingsState {
  activeTab: SettingsTab;
  profile: UserProfile;
  docs: DocsData;
  integrations: IntegrationTokens;
}
