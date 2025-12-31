"use client";

import FormSheet from "../form-sheet";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Video } from "@/types";
import { useState, useEffect } from "react";
import { useGenres } from "@/hooks/use-genres";
import { useCategories } from "@/hooks/use-categories";
import { tvAgeRatings } from "@/data/age-ratings";

interface SeriesGeneralInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Video>) => void;
  editingSeries?: Video | null;
  isLoading?: boolean;
}

export default function SeriesGeneralInfo({
  open,
  onOpenChange,
  onSubmit,
  editingSeries,
  isLoading = false,
}: SeriesGeneralInfoProps) {
  const { data: genres = [] } = useGenres();
  const { data: categories = [] } = useCategories();

  const [formData, setFormData] = useState<Partial<Video>>({
    type: "series",
    title: "",
    description: "",
    thumbnail: "",
    banner: "",
    release_year: new Date().getFullYear(),
    age_rating: "TV-PG",
    imdb_rating: 0,
    is_published: false,
    is_featured: false,
    is_trending: false,
    genre_ids: [],
    category_ids: [],
  });

  useEffect(() => {
    if (editingSeries) {
      setFormData({
        ...editingSeries,
        genre_ids:
          editingSeries.genre_ids ||
          editingSeries.genres?.map((g) => Number(g.id)) ||
          [],
        category_ids:
          editingSeries.category_ids ||
          editingSeries.categories?.map((c) => Number(c.id)) ||
          [],
      });
    } else {
      setFormData({
        type: "series",
        title: "",
        description: "",
        thumbnail: "",
        banner: "",
        release_year: new Date().getFullYear(),
        age_rating: "TV-PG",
        imdb_rating: 0,
        is_published: false,
        is_featured: false,
        is_trending: false,
        genre_ids: [],
        category_ids: [],
      });
    }
  }, [editingSeries, open]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const toggleGenre = (genreId: number) => {
    const currentGenres = formData.genre_ids || [];
    if (currentGenres.includes(genreId)) {
      setFormData({
        ...formData,
        genre_ids: currentGenres.filter((id) => id !== genreId),
      });
    } else {
      setFormData({
        ...formData,
        genre_ids: [...currentGenres, genreId],
      });
    }
  };

  const toggleCategory = (categoryId: number) => {
    const currentCategories = formData.category_ids || [];
    if (currentCategories.includes(categoryId)) {
      setFormData({
        ...formData,
        category_ids: currentCategories.filter((id) => id !== categoryId),
      });
    } else {
      setFormData({
        ...formData,
        category_ids: [...currentCategories, categoryId],
      });
    }
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editingSeries ? "Edit Series" : "Add New Series"}
      description="Fill in the series details. Episodes will be added separately."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={editingSeries ? "Update Series" : "Create Series"}
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter series title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter series description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner URL</Label>
              <Input
                id="banner"
                value={formData.banner || ""}
                onChange={(e) =>
                  setFormData({ ...formData, banner: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Series Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="release_year">Release Year</Label>
            <Input
              id="release_year"
              type="number"
              value={formData.release_year || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  release_year: parseInt(e.target.value),
                })
              }
              min={1900}
              max={2100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age_rating">Age Rating</Label>
            <select
              id="age_rating"
              value={formData.age_rating || ""}
              onChange={(e) =>
                setFormData({ ...formData, age_rating: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {tvAgeRatings.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imdb_rating">IMDB Rating</Label>
            <Input
              id="imdb_rating"
              type="number"
              step="0.1"
              value={formData.imdb_rating || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imdb_rating: parseFloat(e.target.value),
                })
              }
              min={0}
              max={10}
            />
          </div>
        </div>

        {/* Genres */}
        <div className="space-y-2">
          <Label>Genres</Label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-10.5">
            {genres.map((genre) => (
              <Badge
                key={genre.id}
                variant={
                  (formData.genre_ids || []).includes(Number(genre.id))
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleGenre(Number(genre.id))}
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-10.5">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  (formData.category_ids || []).includes(Number(category.id))
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleCategory(Number(category.id))}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_published">Published</Label>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_published: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_featured">Featured</Label>
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_trending">Trending</Label>
            <Switch
              id="is_trending"
              checked={formData.is_trending}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_trending: checked })
              }
            />
          </div>
        </div>
      </div>
    </FormSheet>
  );
}
