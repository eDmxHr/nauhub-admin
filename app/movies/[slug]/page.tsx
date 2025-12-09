"use client";

import React, { useState } from "react";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, FileVideo, Film, Upload } from "lucide-react";
import MovieMediaUpload from "@/components/forms/movie-media-upload";
import Image from "next/image";
export default function Page() {
  const [open, setOpen] = useState(false);
  // Movie details (mocked for now)
  const movieTitle = "The Last Eclipse";
  const fullDescription =
    "When the world's brightest minds discover an anomaly in Earth's orbit, humanity faces an unprecedented crisis. Dr. Sarah Chen, a renowned astrophysicist, must race against time to uncover the truth behind the approaching darkness. As governments collapse and society fractures, she leads a desperate mission to save civilization from total extinction. But the greatest threat may not come from the cosmos—it may already be among us.";
  // Always truncate the description
  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n).trimEnd() + "..." : str;
  const movieDescription = truncate(fullDescription, 50);
  const breadcrumbs = [
    { title: "Movies", url: "/movies" },
    { title: movieTitle },
  ];
  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title={movieTitle}
        description={movieDescription}
        showButton={true}
        setOpen={setOpen}
        buttonLabel="Upload file"
      >
        <MovieMediaUpload open={open} onOpenChange={setOpen} />
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 max-w-7xl">
          {/* Poster */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px] aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/poster.avif"
                alt="Series poster"
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
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-accent px-3 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">8.4</span>
                    <span className="text-muted-foreground text-sm">/10</span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>2024</span>
                  <span>•</span>
                  <Badge variant="secondary" className="font-normal">
                    PG-13
                  </Badge>
                  <span>•</span>
                  <span>2h 28m</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Sci-Fi</Badge>
                <Badge variant="outline">Thriller</Badge>
                <Badge variant="outline">Drama</Badge>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-semibold">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {movieDescription}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Director
                </h3>
                <p className="text-foreground">Christopher Nolan</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Writers
                </h3>
                <p className="text-foreground">Emma Thompson, David Koepp</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Stars
                </h3>
                <p className="text-foreground">
                  Jessica Chastain, Oscar Isaac, Michael B. Jordan
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Studio
                </h3>
                <p className="text-foreground">Warner Bros. Pictures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Available Files</h2>
          <div className="grid gap-3">
            {[
              {
                name: "The Last Eclipse - 4K UHD",
                badge: "4K",
                info: "3840 x 2160 • H.265 • 15.2 GB",
              },
              {
                name: "The Last Eclipse - 1080p",
                badge: "HD",
                info: "1920 x 1080 • H.264 • 4.8 GB",
              },
              {
                name: "The Last Eclipse - 720p",
                badge: "SD",
                info: "1280 x 720 • H.264 • 2.1 GB",
              },
              {
                name: "Subtitles Pack",
                badge: "Multi-language",
                info: "English, Spanish, French, German, Japanese • SRT • 156 KB",
                icon: <Film className="w-6 h-6 text-primary" />,
              },
            ].map((file, idx) => (
              <div
                key={idx}
                className="border border-border rounded-lg p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    {file.icon || (
                      <FileVideo className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{file.name}</span>
                      <Badge
                        variant={
                          file.badge === "Multi-language"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {file.badge}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {file.info}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
