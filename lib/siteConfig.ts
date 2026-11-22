// // Edit these once — every legal/about/contact page reads from here.
// export const siteConfig = {
//   name: "CyberNotes",
//   url: "https://cybernotes.in", // TODO: your real domain
//   contactEmail: "devopsmechanic@gmail.com", // TODO: a real inbox you monitor
//   ownerName: "CyberNotes Editorial Team", // TODO: your name / business name
//   jurisdiction: "India", // governing law in the Terms
//   lastUpdated: "November 21, 2026",
// };

// Edit these once — every legal/about/contact/YouTube section reads from here.
export const siteConfig = {
  name: "CyberNotes",
  url: "https://cybernotes.in",
  contactEmail: "contact@cybernotes.in", // MUST be a real inbox you monitor (reviewers may email it)
  ownerName: "CyberNotes Editorial Team", // TODO: your name / business name
  jurisdiction: "India", // governing law in the Terms
  lastUpdated: "November 22, 2026",
};

// YouTube channel + API client details used by the homepage YouTube section and the
// Privacy Policy / Terms YouTube sections. Keep these identical to what you submit in the
// YouTube API audit form and to what your Google Cloud OAuth consent screen shows.
export const youtubeConfig = {
  channelName: "CyberSnack",
  channelUrl: "https://www.youtube.com/@CyberSnackHQ",
  apiClientName: "CyberSnack Uploader",
  // OAuth scopes the API client requests. Must match the consent screen EXACTLY.
  scopes: [{ scope: "https://www.googleapis.com/auth/youtube.upload", purpose: "Upload videos to our own YouTube channel" }],
  // Optional: YouTube video IDs to embed on the homepage (the part after v= or /shorts/).
  // Leave empty to show only the "Watch on YouTube" button.
  videoIds: [] as string[],
};

export const YOUTUBE_TOS_URL = "https://www.youtube.com/t/terms";
export const GOOGLE_PRIVACY_URL = "http://www.google.com/policies/privacy";
export const GOOGLE_REVOKE_URL = "https://security.google.com/settings/security/permissions";