"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, Play, Clock, Upload } from "lucide-react";
import { useState } from "react";
import { mockAnime } from "@/data/titles-anime-sample";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import AnimeMediaUpload from "@/components/forms/anime-media-upload";
import Image from "next/image";
import { truncate } from "@/lib/utils";

export default function AnimeDetailPage() {
  const [activeTitleId, setActiveTitleId] = useState("201");
  const [open, setOpen] = useState(false);

  const anime = mockAnime.find((a) => a.title_id === activeTitleId);
  if (!anime) return <div>Anime not found</div>;

  const animeTitle = anime.name;
  const animeDescription = truncate(anime.description, 50);
  const breadcrumbs = [
    { title: "Anime", url: "/anime" },
    { title: animeTitle },
  ];

  // Group episodes by season_id
  const seasonsMap: Record<string, typeof anime.episodes> = {};
  anime.episodes.forEach((ep) => {
    if (!seasonsMap[ep.season_id]) seasonsMap[ep.season_id] = [];
    seasonsMap[ep.season_id].push(ep);
  });
  const seasons = Object.entries(seasonsMap).map(([season_id, episodes]) => ({
    season_id,
    episodes,
  }));

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title={animeTitle}
        description={animeDescription}
        showButton={true}
        setOpen={setOpen}
        buttonLabel="Upload File"
      >
        <AnimeMediaUpload open={open} onOpenChange={setOpen} />
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

          {/* Anime Details */}
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
                  <span>{anime.release_year}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="font-normal">
                    {anime.age_rating}
                  </Badge>
                  <span>•</span>
                  <span>{anime.episodes.length} Episodes</span>
                </div>
              </div>
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Action</Badge>
                <Badge variant="outline">Adventure</Badge>
                <Badge variant="outline">Fantasy</Badge>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-semibold">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {animeDescription}
              </p>
            </div>
            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Creator
                </h3>
                <p className="text-foreground">Unknown</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Studio
                </h3>
                <p className="text-foreground">Studio Pierrot</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Episodes</h2>
          {/* Season Tabs */}
          <Tabs defaultValue={seasons[0]?.season_id} className="mb-6">
            <TabsList>
              {seasons.map((season, idx) => (
                <TabsTrigger key={season.season_id} value={season.season_id}>
                  Season {idx + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {seasons.map((season) => (
              <TabsContent key={season.season_id} value={season.season_id}>
                <div className="grid gap-4">
                  {season.episodes.map((episode) => (
                    <div
                      key={episode.episode_id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 h-full">
                        {/* Episode Number Thumbnail */}
                        <div className="w-24 h-full rounded-md bg-accent flex items-center justify-center shrink-0">
                          <span className="text-2xl font-bold text-muted-foreground">
                            {episode.episode_number}
                          </span>
                        </div>
                        {/* Episode Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {episode.episode_number}. {episode.episode_name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {episode.duration_minutes
                                    ? `${episode.duration_minutes} min`
                                    : ""}
                                </span>
                                {episode.release_date && (
                                  <>
                                    <span>•</span>
                                    <span>{episode.release_date}</span>
                                  </>
                                )}
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
