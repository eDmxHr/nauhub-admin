import { Anime } from "../types/index";

export const mockAnime: Anime[] = [
  {
    title_id: "201",
    title_type: "Anime",
    name: "Ninja Quest",
    description: "A young ninja's journey to become the leader of his village.",
    release_year: 2015,
    age_rating: "PG",
    is_original: true,
    poster_url: "https://image.tmdb.org/t/p/original/ninjaquest.jpg",
    trailer_url: "https://www.youtube.com/watch?v=ninjaquest",
    created_at: "2025-12-01T10:00:00Z",
    episodes: [
      {
        episode_id: "201-1",
        season_id: "201",
        episode_number: 1,
        episode_name: "The Beginning",
        description: "The journey starts.",
        duration_minutes: 24,
        release_date: "2015-01-01",
        thumbnail_url: "https://image.tmdb.org/t/p/original/ninjaquest-ep1.jpg",
      },
      {
        episode_id: "201-2",
        season_id: "201",
        episode_number: 2,
        episode_name: "First Mission",
        description: "A dangerous mission awaits.",
        duration_minutes: 24,
        release_date: "2015-01-08",
        thumbnail_url: "https://image.tmdb.org/t/p/original/ninjaquest-ep2.jpg",
      },
    ],
  },
  {
    title_id: "202",
    title_type: "Anime",
    name: "Space Rangers",
    description: "A team of rangers protect the galaxy from evil.",
    release_year: 2018,
    age_rating: "PG-13",
    is_original: false,
    poster_url: "https://image.tmdb.org/t/p/original/spacerangers.jpg",
    trailer_url: "https://www.youtube.com/watch?v=spacerangers",
    created_at: "2025-12-01T10:00:00Z",
    episodes: [
      {
        episode_id: "202-1",
        season_id: "202",
        episode_number: 1,
        episode_name: "Rangers Assemble",
        description: "The rangers unite for the first time.",
        duration_minutes: 26,
        release_date: "2018-03-01",
        thumbnail_url:
          "https://image.tmdb.org/t/p/original/spacerangers-ep1.jpg",
      },
    ],
  },
];
