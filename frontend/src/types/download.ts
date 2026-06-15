export interface DownloadLink {
  quality: "4K" | "1080p" | "720p" | "480p";
  codec: string;
  url: string;
  size: string | null;
}

export interface Season {
  season: number;
  episodes: number;
  softsub_links: DownloadLink[];
  dubbed_links: DownloadLink[];
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies: Comment[];
}