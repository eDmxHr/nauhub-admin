"use client";

import React, { useState } from "react";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Star, FileVideo, LoaderIcon } from "lucide-react";
import Image from "next/image";
import { truncate } from "@/lib/utils";
import { useVideo } from "@/hooks/use-videos";
import {
  formatBadgeStatusText,
  formatBadgeStatusVariant,
} from "@/lib/format-badge-status";
import { useParams } from "next/navigation";
import LoadingState from "@/components/loading-state";

export default function Page() {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const movieId = Number(params.id);

  const { data: movie, isLoading, error } = useVideo(movieId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">Failed to load movie details</p>
        </div>
      </div>
    );
  }

  const movieDescription = movie.description
    ? truncate(movie.description, 50)
    : "";
  const breadcrumbs = [
    { title: "Movies", url: "/movies" },
    { title: movie.title },
  ];
  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title={movie.title}
        description={movieDescription}
        showButton={true}
        setOpen={setOpen}
        buttonLabel="Upload file"
      >
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 max-w-7xl">
          {/* Poster */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px] aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={movie.thumbnail || movie.banner || "/poster.avif"}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 320px) 100vw, 320px"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4">
                {/* Rating */}
                {movie.imdb_rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-accent px-3 py-1 rounded-md">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{movie.imdb_rating}</span>
                      <span className="text-muted-foreground text-sm">/10</span>
                    </div>
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {movie.release_year && <span>{movie.release_year}</span>}
                  {movie.release_year && movie.age_rating && <span>•</span>}
                  {movie.age_rating && (
                    <Badge variant="secondary" className="font-normal">
                      {movie.age_rating}
                    </Badge>
                  )}
                  {(movie.release_year || movie.age_rating) &&
                    movie.duration && <span>•</span>}
                  {movie.duration && (
                    <span>
                      {Math.floor(movie.duration / 60) > 0 &&
                        `${Math.floor(movie.duration / 60)}h `}
                      {movie.duration % 60 > 0 && `${movie.duration % 60}m`}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                {movie.status && (
                  <Badge
                    variant={formatBadgeStatusVariant(movie.status)}
                    className="text-xs"
                  >
                    {formatBadgeStatusText(movie.status)}
                  </Badge>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres && movie.genres.length > 0 ? (
                  movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No genres available
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-semibold">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {movie.description || "No description available"}
              </p>
            </div>

            {/* Additional Info */}
            {movie.magnet_url && (
              <div className="pt-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Magnet Link
                  </h3>
                  <p className="text-foreground text-xs break-all font-mono bg-accent/30 p-2 rounded">
                    {movie.magnet_url}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Files Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Media Files</h2>
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No media files uploaded yet. Use the &quot;Upload file&quot;
              button to add media files to this movie.
            </p>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
