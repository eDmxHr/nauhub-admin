"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, Play, Clock, Upload } from "lucide-react";
import { useState } from "react";
import { seasons } from "@/data/seasons-sample";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import SeriesMediaUpload from "@/components/forms/series-media-upload";
import Image from "next/image";

export default function SeriesDetailPage() {
  const [activeSeason, setActiveSeason] = useState(1);
  const [open, setOpen] = useState(false);

  const currentSeasonData = seasons.find((s) => s.number === activeSeason);

  // PageHeader and PageWrapper integration
  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n).trimEnd() + "..." : str;
  const seriesTitle = "The Last Eclipse";
  const fullDescription =
    "When the world's brightest minds discover an anomaly in Earth's orbit, humanity faces an unprecedented crisis. Dr. Sarah Chen, a renowned astrophysicist, must race against time to uncover the truth behind the approaching darkness. As governments collapse and society fractures, she leads a desperate mission to save civilization from total extinction. But the greatest threat may not come from the cosmos—it may already be among us.";
  const seriesDescription = truncate(fullDescription, 50);
  const breadcrumbs = [
    { title: "Series", url: "/series" },
    { title: seriesTitle },
  ];

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title={seriesTitle}
        description={seriesDescription}
        showButton={true}
        setOpen={setOpen}
        buttonLabel="Upload file"
      >
        <SeriesMediaUpload open={open} onOpenChange={setOpen} />
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

          {/* Series Details */}
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
                  <span>2024 - Present</span>
                  <span>•</span>
                  <Badge variant="secondary" className="font-normal">
                    TV-14
                  </Badge>
                  <span>•</span>
                  <span>{seasons.length} Seasons</span>
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
                {seriesDescription}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Creator
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
                  Network
                </h3>
                <p className="text-foreground">HBO Max</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Episodes</h2>
          {/* Season Tabs */}
          <Tabs
            defaultValue={String(activeSeason)}
            onValueChange={(val) => setActiveSeason(Number(val))}
            className="mb-6"
          >
            <TabsList>
              {seasons.map((season) => (
                <TabsTrigger key={season.number} value={String(season.number)}>
                  Season {season.number}
                </TabsTrigger>
              ))}
            </TabsList>
            {seasons.map((season) => (
              <TabsContent key={season.number} value={String(season.number)}>
                <div className="grid gap-4">
                  {season.episodes.map((episode) => (
                    <div
                      key={episode.number}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 h-full">
                        {/* Episode Number Thumbnail */}
                        <div className="w-24 h-full rounded-md bg-accent flex items-center justify-center shrink-0">
                          <span className="text-2xl font-bold text-muted-foreground">
                            {episode.number}
                          </span>
                        </div>
                        {/* Episode Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {episode.number}. {episode.title}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {episode.runtime}
                                </span>
                                <span>•</span>
                                <span>{episode.airDate}</span>
                                <span>•</span>
                                <span>{episode.size}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {episode.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="default">
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PageWrapper>
    </>
  );
}
