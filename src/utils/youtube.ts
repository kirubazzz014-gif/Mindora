import { YouTubeVideoInfo } from '../types';

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already an 11 character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/i,
    /youtube\.com\/live\/([^"&?\/\s]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }

  return null;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Preset educational videos for instant selection
export const CURATED_EDUCATIONAL_VIDEOS: YouTubeVideoInfo[] = [
  {
    id: 'WUvTyaaNkzM',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    title: 'The Essence of Calculus - Chapter 1 | 3Blue1Brown',
    author: '3Blue1Brown',
    thumbnailUrl: 'https://img.youtube.com/vi/WUvTyaaNkzM/hqdefault.jpg',
    durationSeconds: 1025, // ~17m
    durationFormatted: '17:05'
  },
  {
    id: 'nykOeWgQcHM',
    url: 'https://www.youtube.com/watch?v=nykOeWgQcHM',
    title: 'MIT 6.0001: Introduction to Computer Science and Python',
    author: 'MIT OpenCourseWare',
    thumbnailUrl: 'https://img.youtube.com/vi/nykOeWgQcHM/hqdefault.jpg',
    durationSeconds: 3120, // ~52m
    durationFormatted: '52:00'
  },
  {
    id: 'Yocja_N5s1I',
    url: 'https://www.youtube.com/watch?v=Yocja_N5s1I',
    title: 'Crash Course World History: The Agricultural Revolution',
    author: 'CrashCourse',
    thumbnailUrl: 'https://img.youtube.com/vi/Yocja_N5s1I/hqdefault.jpg',
    durationSeconds: 671, // ~11m
    durationFormatted: '11:11'
  },
  {
    id: 'gX3d_Lw8K3o',
    url: 'https://www.youtube.com/watch?v=gX3d_Lw8K3o',
    title: 'Science of Focus, Attention & Productivity | Dr. Andrew Huberman',
    author: 'Andrew Huberman',
    thumbnailUrl: 'https://img.youtube.com/vi/gX3d_Lw8K3o/hqdefault.jpg',
    durationSeconds: 5400, // 90m
    durationFormatted: '1:30:00'
  },
  {
    id: 'oxZqJq3Jmkg',
    url: 'https://www.youtube.com/watch?v=oxZqJq3Jmkg',
    title: 'Organic Chemistry Introduction & Naming Basics',
    author: 'Khan Academy',
    thumbnailUrl: 'https://img.youtube.com/vi/oxZqJq3Jmkg/hqdefault.jpg',
    durationSeconds: 1560, // 26m
    durationFormatted: '26:00'
  },
  {
    id: 'HeQX2HjkcNo',
    url: 'https://www.youtube.com/watch?v=HeQX2HjkcNo',
    title: 'The Simplest Math Problem No One Can Solve (Collatz)',
    author: 'Veritasium',
    thumbnailUrl: 'https://img.youtube.com/vi/HeQX2HjkcNo/hqdefault.jpg',
    durationSeconds: 1320, // 22m
    durationFormatted: '22:00'
  }
];

export async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeVideoInfo> {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Check preset library first for accurate static metadata
  const foundPreset = CURATED_EDUCATIONAL_VIDEOS.find(v => v.id === videoId);
  if (foundPreset) {
    return foundPreset;
  }

  try {
    // Attempt noembed / oembed for clean real titles
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return {
          id: videoId,
          url: videoUrl,
          title: data.title,
          author: data.author_name || 'YouTube Creator',
          thumbnailUrl: data.thumbnail_url || defaultThumbnail,
          durationSeconds: 1800, // Default 30 min focus if unknown
          durationFormatted: '30:00'
        };
      }
    }
  } catch {
    // fallback gracefully
  }

  // Fallback info with valid thumbnail
  return {
    id: videoId,
    url: videoUrl,
    title: `Selected Educational Video (${videoId})`,
    author: 'YouTube Educational Content',
    thumbnailUrl: defaultThumbnail,
    durationSeconds: 1800,
    durationFormatted: '30:00'
  };
}
