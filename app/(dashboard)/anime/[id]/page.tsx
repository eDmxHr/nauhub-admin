"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVideo } from "@/hooks/use-videos";
import {
  useCreateSeason,
  useUpdateSeason,
  useDeleteSeason,
  Season,
} from "@/hooks/use-seasons";
import {
  useCreateEpisode,
  useUpdateEpisode,
  useDeleteEpisode,
  Episode,
} from "@/hooks/use-episodes";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import SeasonForm from "@/components/forms/season-form";
import EpisodeForm from "@/components/forms/episode-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Plus, Pencil, Trash2, PlayCircle } from "@/lib/icons";
import LoadingState from "@/components/loading-state";
import {
  formatBadgeStatusText,
  formatBadgeStatusVariant,
} from "@/lib/format-badge-status";
import { formatDate } from "@/lib/utils";

export default function AnimeDetailPage() {
  const params = useParams();
  const animeId = Number(params.id);

  // Fetch anime data
  const { data: anime, isLoading: animeLoading } = useVideo(animeId);

  // Season management
  const createSeasonMutation = useCreateSeason();
  const updateSeasonMutation = useUpdateSeason();
  const deleteSeasonMutation = useDeleteSeason();

  // Episode management
  const createEpisodeMutation = useCreateEpisode();
  const updateEpisodeMutation = useUpdateEpisode();
  const deleteEpisodeMutation = useDeleteEpisode();

  // Season dialog states
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [deleteSeasonDialogOpen, setDeleteSeasonDialogOpen] = useState(false);
  const [deleteSeasonId, setDeleteSeasonId] = useState<string | number | null>(
    null
  );
  const [deleteSeasonTitle, setDeleteSeasonTitle] = useState("");

  // Episode dialog states
  const [episodeDialogOpen, setEpisodeDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<
    string | number | null
  >(null);
  const [deleteEpisodeDialogOpen, setDeleteEpisodeDialogOpen] = useState(false);
  const [deleteEpisodeId, setDeleteEpisodeId] = useState<
    string | number | null
  >(null);
  const [deleteEpisodeTitle, setDeleteEpisodeTitle] = useState("");

  // Season handlers
  const handleAddSeason = () => {
    setEditingSeason(null);
    setSeasonDialogOpen(true);
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setSeasonDialogOpen(true);
  };

  const handleSaveSeason = async (data: Partial<Season>) => {
    try {
      if (editingSeason) {
        await updateSeasonMutation.mutateAsync({
          id: editingSeason.id,
          data,
        });
        toast.success("Season updated successfully");
      } else {
        await createSeasonMutation.mutateAsync({
          videoId: animeId,
          data,
        });
        toast.success("Season created successfully");
      }
      setSeasonDialogOpen(false);
      setEditingSeason(null);
    } catch (error: any) {
      console.error("Failed to save season:", error);
      toast.error(error?.message || "Failed to save season");
    }
  };

  const handleDeleteSeason = (season: Season) => {
    setDeleteSeasonId(season.id);
    setDeleteSeasonTitle(season.title);
    setDeleteSeasonDialogOpen(true);
  };

  const confirmDeleteSeason = async () => {
    if (!deleteSeasonId) return;
    try {
      await deleteSeasonMutation.mutateAsync(deleteSeasonId);
      toast.success("Season deleted successfully");
      setDeleteSeasonDialogOpen(false);
      setDeleteSeasonId(null);
      setDeleteSeasonTitle("");
    } catch (error: any) {
      console.error("Failed to delete season:", error);
      toast.error(error?.message || "Failed to delete season");
    }
  };

  // Episode handlers
  const handleAddEpisode = (seasonId: string | number) => {
    setSelectedSeasonId(seasonId);
    setEditingEpisode(null);
    setEpisodeDialogOpen(true);
  };

  const handleEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setSelectedSeasonId(episode.season_id);
    setEpisodeDialogOpen(true);
  };

  const handleSaveEpisode = async (data: Partial<Episode>) => {
    try {
      if (editingEpisode) {
        await updateEpisodeMutation.mutateAsync({
          id: editingEpisode.id,
          data,
        });
        toast.success("Episode updated successfully");
      } else if (selectedSeasonId) {
        const newEpisode = await createEpisodeMutation.mutateAsync({
          seasonId: selectedSeasonId,
          data,
        });

        // If a video was uploaded, notify backend to associate it with the new episode
        if (data.cloudflare_video_uid && newEpisode?.id) {
          try {
            await api.post("/admin/cloudflare/upload-complete", {
              video_uid: data.cloudflare_video_uid,
              model_type: "episode",
              model_id: Number(newEpisode.id),
            });
          } catch (error: any) {
            console.error("Failed to notify upload complete:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to register video upload";
            toast.error(errorMessage);
          }
        }
        toast.success("Episode created successfully");
      }
      setEpisodeDialogOpen(false);
      setEditingEpisode(null);
      setSelectedSeasonId(null);
    } catch (error: any) {
      console.error("Failed to save episode:", error);
      toast.error(error?.message || "Failed to save episode");
    }
  };

  const handleDeleteEpisode = (episode: Episode) => {
    setDeleteEpisodeId(episode.id);
    setDeleteEpisodeTitle(episode.title);
    setDeleteEpisodeDialogOpen(true);
  };

  const confirmDeleteEpisode = async () => {
    if (!deleteEpisodeId) return;
    try {
      await deleteEpisodeMutation.mutateAsync(deleteEpisodeId);
      toast.success("Episode deleted successfully");
      setDeleteEpisodeDialogOpen(false);
      setDeleteEpisodeId(null);
      setDeleteEpisodeTitle("");
    } catch (error: any) {
      console.error("Failed to delete episode:", error);
      toast.error(error?.message || "Failed to delete episode");
    }
  };

  if (animeLoading) {
    return <LoadingState />;
  }

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">Anime not found</p>
        </div>
      </div>
    );
  }

  // Get anime data
  const seasons = (anime as any).seasons || [];
  const animeDescription = anime.description || "";

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Anime", url: "/anime" },
          { title: anime.title },
        ]}
      />
      <PageWrapper
        title={anime.title}
        description={animeDescription.substring(0, 100)}
        showButton={true}
        setOpen={handleAddSeason}
        buttonLabel="Add Season"
      >
        {/* Anime Details Section */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 max-w-7xl mb-12">
          {/* Poster */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px] aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={anime.thumbnail || anime.banner || "/poster.avif"}
                alt={`${anime.title} poster`}
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
                {anime.imdb_rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-accent px-3 py-1 rounded-md">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">
                        {anime.imdb_rating}
                      </span>
                      <span className="text-muted-foreground text-sm">/10</span>
                    </div>
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {anime.release_year && <span>{anime.release_year}</span>}
                  {anime.release_year && anime.age_rating && <span>•</span>}
                  {anime.age_rating && (
                    <Badge variant="secondary" className="font-normal">
                      {anime.age_rating}
                    </Badge>
                  )}
                  {seasons.length > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {seasons.length} Season{seasons.length !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>

                {/* Status Badge */}
                {anime.status && (
                  <Badge
                    variant={formatBadgeStatusVariant(anime.status)}
                    className="text-xs"
                  >
                    {formatBadgeStatusText(anime.status)}
                  </Badge>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {anime.genres && anime.genres.length > 0 ? (
                  anime.genres.map((genre: any) => (
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
                {anime.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Seasons & Episodes Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Seasons & Episodes</h2>
          {seasons.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg p-8 text-center">
              <div className="w-12 h-12 text-muted-foreground mx-auto mb-3">
                <PlayCircle className="w-full h-full" />
              </div>
              <p className="text-muted-foreground mb-4">
                No seasons yet. Add your first season to get started.
              </p>
            </div>
          ) : (
            <Tabs
              defaultValue={`season-${seasons[0]?.id}`}
              className="space-y-4"
            >
              <TabsList>
                {seasons.map((season: any) => (
                  <TabsTrigger key={season.id} value={`season-${season.id}`}>
                    Season {season.season_number}
                  </TabsTrigger>
                ))}
              </TabsList>

              {seasons.map((season: any) => (
                <TabsContent key={season.id} value={`season-${season.id}`}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>
                          Season {season.season_number}: {season.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {season.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddEpisode(season.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Episode
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSeason(season)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSeason(season)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!season.episodes || season.episodes.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-muted-foreground mb-4">
                            No episodes yet. Add your first episode.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {season.episodes.map((episode: any) => (
                            <Card key={episode.id}>
                              <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted">
                                      <PlayCircle className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">
                                          Episode {episode.episode_number}:{" "}
                                          {episode.title}
                                        </h4>
                                        <Badge
                                          variant={formatBadgeStatusVariant(
                                            episode.status
                                          )}
                                          className="text-xs"
                                        >
                                          {formatBadgeStatusText(
                                            episode.status
                                          )}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {episode.description}
                                      </p>
                                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                        {episode.duration && (
                                          <span>{episode.duration} min</span>
                                        )}
                                        {episode.release_date && (
                                          <span>{formatDate(episode.release_date)}</span>
                                        )}
                                        {episode.view_count !== undefined && (
                                          <span>
                                            {episode.view_count} views
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditEpisode(episode)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteEpisode(episode)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </PageWrapper>

      {/* Season Form Dialog */}
      <SeasonForm
        open={seasonDialogOpen}
        onOpenChange={setSeasonDialogOpen}
        onSubmit={handleSaveSeason}
        editingSeason={editingSeason}
        isLoading={
          createSeasonMutation.isPending || updateSeasonMutation.isPending
        }
      />

      {/* Episode Form Dialog */}
      <EpisodeForm
        open={episodeDialogOpen}
        onOpenChange={setEpisodeDialogOpen}
        onSubmit={handleSaveEpisode}
        editingEpisode={editingEpisode}
        isLoading={
          createEpisodeMutation.isPending || updateEpisodeMutation.isPending
        }
      />

      {/* Delete Season Confirmation */}
      <DeleteConfirmDialog
        open={deleteSeasonDialogOpen}
        onOpenChange={setDeleteSeasonDialogOpen}
        onConfirm={confirmDeleteSeason}
        title="Delete Season"
        description={`Are you sure you want to delete "${deleteSeasonTitle}"? This will also delete all episodes in this season. This action cannot be undone.`}
        isLoading={deleteSeasonMutation.isPending}
      />

      {/* Delete Episode Confirmation */}
      <DeleteConfirmDialog
        open={deleteEpisodeDialogOpen}
        onOpenChange={setDeleteEpisodeDialogOpen}
        onConfirm={confirmDeleteEpisode}
        title="Delete Episode"
        description={`Are you sure you want to delete "${deleteEpisodeTitle}"? This action cannot be undone.`}
        isLoading={deleteEpisodeMutation.isPending}
      />
    </>
  );
}
