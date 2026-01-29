import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatBadgeStatusText,
  formatBadgeStatusVariant,
} from "@/lib/format-badge-status";
import { Video } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "@/lib/icons";

export const createMovieColumns = (
  handleEditMovie: (movie: Video) => void,
  handleDeleteMovie: (id: string | number) => void
): ColumnDef<Video>[] => [
  {
    id: "title",
    header: "Title",
    accessorFn: (row) => row.title,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.title}</span>
        {row.original.description && (
          <span className="text-xs text-muted-foreground truncate max-w-md">
            {row.original.description}
          </span>
        )}
      </div>
    ),
  },
  {
    id: "release_year",
    header: "Year",
    accessorFn: (row) => row.release_year,
    cell: ({ row }) => (
      <span className="text-center">{row.original.release_year || "-"}</span>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    accessorFn: (row) => row.duration,
    cell: ({ row }) => {
      const duration = row.original.duration;
      if (!duration) return <span>-</span>;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return (
        <span className="text-sm">
          {hours > 0 && `${hours}h `}
          {minutes > 0 && `${minutes}m`}
        </span>
      );
    },
  },
  {
    id: "age_rating",
    header: "Rating",
    accessorFn: (row) => row.age_rating,
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.age_rating || "N/A"}</Badge>
    ),
  },
  {
    id: "imdb_rating",
    header: "IMDB",
    accessorFn: (row) => row.imdb_rating,
    cell: ({ row }) => {
      const rating = row.original.imdb_rating;
      return rating ? (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span>{rating}</span>
        </div>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.status && (
          <Badge
            variant={formatBadgeStatusVariant(row.original.status)}
            className="text-xs"
          >
            {formatBadgeStatusText(row.original.status)}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "genres",
    header: "Genres",
    cell: ({ row }) => {
      const genres = row.original.genres || [];
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {genres.length > 0 ? (
            genres.slice(0, 2).map((genre) => (
              <Badge key={genre.id} variant="outline" className="text-xs">
                {genre.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          )}
          {genres.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{genres.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleEditMovie(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => handleDeleteMovie(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    meta: { headerAlign: "right" as const },
  },
];
