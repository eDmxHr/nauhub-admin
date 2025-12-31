// Age ratings for movies
export const movieAgeRatings = [
  { value: "G", label: "G" },
  { value: "PG", label: "PG" },
  { value: "PG-13", label: "PG-13" },
  { value: "14", label: "14" },
  { value: "R", label: "R" },
  { value: "NC-17", label: "NC-17" },
];

// Age ratings for TV shows (series and anime)
export const tvAgeRatings = [
  { value: "TV-Y", label: "TV-Y" },
  { value: "TV-Y7", label: "TV-Y7" },
  { value: "TV-G", label: "TV-G" },
  { value: "TV-PG", label: "TV-PG" },
  { value: "TV-14", label: "TV-14" },
  { value: "TV-MA", label: "TV-MA" },
];

// Combined list if needed
export const allAgeRatings = [...movieAgeRatings, ...tvAgeRatings];
