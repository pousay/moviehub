export interface Link {
  media_id: number;
  url: string;
  season: number;
  quality: string;
  codec: string;
  language: string;
  size: null | number;
  id: number;
}

export interface DownloadLink {
  quality: string;
  codec: string;
  url: string;
  size: string | null;
}