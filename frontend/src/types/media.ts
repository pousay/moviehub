import type {Link} from "./link";

export interface Media {
  type: string;
  title: string;
  year: number;
  duration: number;
  country: string;
  imdb_id: string;
  tmdb_id: number;
  imdb_rate: number;
  tmdb_rate: number;
  imdb_votes: number;
  tmdb_votes: number;
  popularity: number;
  overview: string;
  tagline: string | null;
  genres: string;
  poster: string;
  backdrop: string;
  total_seasons: number;
  total_episodes: number;
  id: number;
  links: Link[];
}