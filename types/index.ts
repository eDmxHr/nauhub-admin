import { Plan } from "@/hooks/use-plans";

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
  status?: string;
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
  seasons?: VideoSeason[];
  created_at?: string;
  updated_at?: string;
};

// Season type for Video relationship
export type VideoSeason = {
  id: string | number;
  video_id: string | number;
  season_number: number;
  title: string;
  description?: string;
  thumbnail?: string;
  release_year?: number;
  is_published?: boolean;
  episodes?: VideoEpisode[];
  created_at?: string;
  updated_at?: string;
};

// Episode type for Season relationship
export type VideoEpisode = {
  id: string | number;
  season_id: string | number;
  episode_number: number;
  title: string;
  description?: string;
  thumbnail?: string;
  cloudflare_video_uid?: string;
  status?: string;
  duration?: number;
  release_date?: string;
  is_published?: boolean;
  view_count?: number;
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

// Note: User and Profile types moved to bottom of file with new structure

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

// ======================================================
// COMMON / SHARED TYPES
// ======================================================

export type ISODate = string; // YYYY-MM-DD
export type ISODateTime = string; // ISO 8601

export type UserRole = "user" | "admin";
export type Currency = "MVR";

export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";

export type PaymentStatus = "pending" | "approved" | "rejected";

// ======================================================
// USER TYPES
// ======================================================

/**
 * User - Core user entity
 */
export interface User {
  id: number;
  name: string;

  email: string | null; // Nullable (phone-only auth)
  email_verified_at: ISODateTime | null;

  password: string | null; // Nullable (OTP users)

  phone: string | null; // Unique, 7-digit
  phone_verified: boolean;

  role: UserRole;
  is_subscribed: boolean;
  is_active: boolean;

  remember_token: string | null;

  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/**
 * User with relations (admin detail view)
 */
export interface UserWithRelations extends User {
  subscriptions: Subscription[];
  payments: Payment[];
  profiles: Profile[];
  stats: {
    watch_history_count: number;
    playlist_count: number;
    profile_count: number;
    total_payments: number;
    approved_payments: number;
  };
}

/**
 * User statistics (admin dashboard)
 */
export interface UserStats {
  total_users: number;
  active_users: number;
  blocked_users: number;
  total_admins: number;
  subscribed_users: number;
  phone_verified_users: number;
}

// ======================================================
// SUBSCRIPTION TYPES
// ======================================================

/**
 * Subscription - User subscription record
 */
export interface Subscription {
  id: number;
  user_id: number;

  plan_type: "monthly" | "annual";
  amount: string; // Decimal string
  currency: Currency;

  start_date: ISODate;
  end_date: ISODate;

  status: SubscriptionStatus;
  auto_renew: boolean; // Reserved for future

  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/**
 * Subscription with user relation (admin view)
 */
export interface SubscriptionWithUser extends Subscription {
  user: User;
}

/**
 * Subscription plan (frontend-only, static config)
 */
export interface SubscriptionPlan {
  id:
    | "basic_monthly"
    | "basic_annual"
    | "standard_monthly"
    | "standard_annual"
    | "premium_monthly"
    | "premium_annual";

  tier: "basic" | "standard" | "premium";
  name: string;
  duration: "monthly" | "annual";

  price: number;
  currency: Currency;
  duration_days: number;

  popular?: boolean;
  savings?: string; // e.g. "MVR 298"
  discount_text?: string; // e.g. "2 months free"
  features: string[];
}

// ======================================================
// PAYMENT TYPES
// ======================================================

/**
 * Payment - Subscription payment & verification
 */
export interface Payment {
  id: number;
  user_id: number;
  subscription_id: number | null;

  amount: string; // Decimal string
  currency: Currency;

  reference_code: string; // PAY-XXXXXX
  proof_image: string | null; // storage path

  status: PaymentStatus;

  admin_notes: string | null;
  verified_by: number | null;
  verified_at: ISODateTime | null;

  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/**
 * Payment with relations (admin view)
 */
export interface PaymentWithRelations extends Payment {
  user: User;
  subscription: Subscription | null;
  verifiedBy?: User;
}

// ======================================================
// PROFILE TYPES
// ======================================================

/**
 * Profile - Multiple profiles per user
 */
export interface Profile {
  id: number;
  user_id: number;

  name: string;
  avatar: string | null;

  pin_protected: boolean;
  pin: string | null; // Hashed

  is_kids_profile: boolean;

  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/**
 * Profile summary (for user detail view)
 */
export interface ProfileSummary {
  id: number;
  user_id: number;
  name: string;
  avatar: string | null;
  has_pin: boolean;
}

/**
 * Current subscription summary (for user detail view)
 */
export interface CurrentSubscription {
  id: number;
  plan_type: "monthly" | "annual";
  end_date: ISODate;
  days_remaining: number;
  plan_name: string;
  plan_details: Plan;
}

/**
 * Watch history item (for user detail view)
 */
export interface WatchHistoryItem {
  id: number;
  user_id: number;
  profile_id: number;
  video_id: number;
  episode_id: number | null;
  progress_seconds: number;
  duration_seconds: number;
  completed: boolean;
  last_watched_at: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  video: {
    id: number;
    type: string;
    title: string;
    description: string;
    thumbnail: string;
    banner: string;
    cloudflare_video_uid: string;
    status: string;
    duration: number;
    quality: string;
    release_year: number;
    age_rating: string;
    imdb_rating: string;
    is_published: boolean;
    is_featured: boolean;
    is_trending: boolean;
    view_count: number;
    created_at: ISODateTime;
    updated_at: ISODateTime;
  };
  episode: any | null;
}

/**
 * Payment with subscription (for user detail view)
 */
export interface PaymentDetail extends Payment {
  subscription: Subscription | null;
}

/**
 * User detail response (from GET /admin/users/:id)
 */
export interface UserDetail extends Omit<User, "password" | "remember_token"> {
  profiles: ProfileSummary[];
  current_subscription: CurrentSubscription | null;
  payments: PaymentDetail[];
  watch_history: WatchHistoryItem[];
}

// ======================================================
// SUPPORT TICKET TYPES
// ======================================================

export type TicketCategory =
  | "movie_request"
  | "series_request"
  | "technical_issue"
  | "billing"
  | "account"
  | "feedback"
  | "other";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus =
  | "open"
  | "pending"
  | "awaiting_reply"
  | "in_progress"
  | "resolved"
  | "closed";

export interface SupportTicket {
  id: number;
  user_id: number;
  ticket_number: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to: number | null;
  resolution_notes: string | null;
  resolved_at: ISODateTime | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface SupportTicketReply {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_admin_reply: boolean;
  is_internal_note: boolean;
  attachments: string[] | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  user?: User;
}

export interface SupportTicketWithUser extends SupportTicket {
  user: User | null;
  assignedAdmin?: User | null;
  replies?: SupportTicketReply[];
}

export interface SupportTicketStats {
  total: number;
  open: number;
  pending: number;
  in_progress: number;
  resolved: number;
  closed: number;
  by_category: Record<TicketCategory, number>;
  by_priority: Record<TicketPriority, number>;
}
