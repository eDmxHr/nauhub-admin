// Titles & Related
export type Movie = {
  title_id: string;
  title_type: "Movie";
  name: string;
  description: string;
  release_year: number;
  age_rating: string;
  is_original: boolean;
  duration_minutes: number;
  poster_url: string;
  trailer_url: string;
  created_at: string;
};

export type Series = {
  title_id: string;
  title_type: "Series";
  name: string;
  description: string;
  release_year: number;
  age_rating: string;
  is_original: boolean;
  poster_url: string;
  trailer_url: string;
  created_at: string;
  seasons: Season[];
};

export type Anime = {
  title_id: string;
  title_type: "Anime";
  name: string;
  description: string;
  release_year: number;
  age_rating: string;
  is_original: boolean;
  poster_url: string;
  trailer_url: string;
  created_at: string;
  episodes: Episode[];
};

export type Title = Movie | Series | Anime;

export type Season = {
  season_id: string;
  title_id: string;
  season_number: number;
  release_year: number;
  description: string;
  poster_url: string;
  episodes: Episode[];
};

export type Episode = {
  episode_id: string;
  season_id: string;
  episode_number: number;
  episode_name: string;
  description: string;
  duration_minutes: number;
  release_date: string;
  thumbnail_url: string;
};

// Genres & Relations
export type Genre = {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TitleGenre = {
  title_id: string;
  genre_id: string;
};

// Categories
export type Category = {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Videos (Movies, Series, Anime)
export type Video = {
  id: string | number;
  type: "movie" | "series" | "anime";
  title: string;
  description?: string;
  thumbnail?: string;
  banner?: string;
  magnet_url?: string;
  release_year?: number;
  duration?: number;
  age_rating?: string;
  imdb_rating?: number;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  category_ids?: number[];
  genre_ids?: number[];
  categories?: Category[];
  genres?: Genre[];
  created_at?: string;
  updated_at?: string;
};

// People & Credits
export type Person = {
  person_id: string;
  name: string;
  birth_date: string;
  bio: string;
  photo_url: string;
};

export type TitleCast = {
  title_id: string;
  person_id: string;
  role_name: string;
};

export type TitleCrew = {
  title_id: string;
  person_id: string;
  job_role: string;
};

// Languages & Relations
export type Language = {
  language_id: string;
  language_name: string;
};

export type TitleLanguage = {
  title_id: string;
  language_id: string;
  audio_or_subtitle: string;
};

// Users & Profiles
export type User = {
  user_id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string;
  created_at: string;
  plan_type: string;
  is_active: boolean;
};

export type Profile = {
  profile_id: string;
  user_id: string;
  profile_name: string;
  age_restriction: string;
  avatar_url: string;
};

// Watch History & Ratings
export type WatchHistory = {
  watch_id: string;
  user_id: string;
  title_id: string;
  episode_id: string;
  progress_seconds: number;
  is_completed: boolean;
  watched_at: string;
};

export type Rating = {
  rating_id: string;
  user_id: string;
  title_id: string;
  rating_value: number;
  review_text: string;
  created_at: string;
};
