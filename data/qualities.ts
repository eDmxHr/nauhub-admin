export const qualities = [
  // Low Quality (Theater Recordings)
  {
    id: "cam",
    name: "CAM",
    description: "Recorded in theater with a camera. Very poor quality.",
    resolutions: ["360p", "480p", "720p", "1080p"],
  },
  {
    id: "ts",
    name: "TS",
    description:
      "Theater recording with direct audio. Slightly better than CAM.",
    resolutions: ["360p", "480p"],
  },

  // Mid Quality (Pre-release or SD)
  {
    id: "wp",
    name: "WP",
    description: "Early unfinished copy. Quality varies.",
    resolutions: ["360p", "480p", "720p", "1080p"],
  },
  {
    id: "tc",
    name: "TC",
    description: "Direct copy from film print. DVD-like quality.",
    resolutions: ["360p", "480p", "720p", "1080p"],
  },
  {
    id: "scr",
    name: "SCR",
    description: "Promotional DVD copy. May have watermarks/messages.",
    resolutions: ["360p", "480p", "720p", "1080p"],
  },
  {
    id: "dvdrip",
    name: "DVDRip",
    description: "Rip from retail DVD. Clean SD quality.",
    resolutions: ["360p", "480p", "720p", "1080p"],
  },

  // High Quality (HD Sources)
  {
    id: "hdtv",
    name: "HDTV",
    description: "Rip from HD TV broadcast. Good quality for shows.",
    resolutions: ["480p", "720p", "1080p"],
  },
  {
    id: "webdl",
    name: "WEB-DL",
    description:
      "Downloaded from online platform. High quality, not re-encoded.",
    resolutions: ["720p", "1080p", "4K"],
  },
  {
    id: "webrip",
    name: "WEBRip",
    description: "Captured from online stream. HD, may be re-encoded.",
    resolutions: ["720p", "1080p", "4K"],
  },
  {
    id: "hdrip",
    name: "HDRip",
    description: "Rip from HD source. Quality varies with compression.",
    resolutions: ["720p", "1080p"],
  },
  {
    id: "bdrip",
    name: "BDRip",
    description: "Rip from Blu-ray disc. Very high quality.",
    resolutions: ["720p", "1080p", "4K"],
  },
  {
    id: "bluray",
    name: "Blu-ray",
    description:
      "Untouched Blu-ray disc copy. Highest quality, very large size.",
    resolutions: ["720p", "1080p", "4K"],
  },
];

// Quality options for video forms
export const videoQualityOptions = [
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" },
  { value: "480p", label: "480p" },
  { value: "4k", label: "4k" },
  { value: "2160p", label: "2160p" },
  { value: "CAM", label: "CAM" },
  { value: "HDTS", label: "HDTS" },
  { value: "TS", label: "TS" },
];
