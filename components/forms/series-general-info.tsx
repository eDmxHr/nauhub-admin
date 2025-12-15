import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { parentalRatings } from "../../data/parental-ratings";
import { genres } from "../../data/genres";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

export interface SeriesGeneralInfoFormValues {
  name: string;
  description: string;
  release_year: number;
  parental_rating: string;
  genres: string[];
  poster_file?: File;
}

interface SeriesGeneralInfoProps {
  onSubmit?: (data: SeriesGeneralInfoFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<SeriesGeneralInfoFormValues>;
}

export default function SeriesGeneralInfo({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: SeriesGeneralInfoProps) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SeriesGeneralInfoFormValues>({
    defaultValues: {
      name: "",
      description: "",
      release_year: new Date().getFullYear(),
      parental_rating: "PG-13",
      genres: [],
      poster_file: undefined,
      ...defaultValues,
    },
  });

  const selectedGenres = watch("genres") || [];

  const toggleGenre = (genreValue: string) => {
    const currentGenres = selectedGenres;
    if (currentGenres.includes(genreValue)) {
      setValue(
        "genres",
        currentGenres.filter((g: string) => g !== genreValue)
      );
    } else {
      setValue("genres", [...currentGenres, genreValue]);
    }
  };

  const submitHandler =
    onSubmit ||
    ((data) => {
      console.log("Series general info data", data);
    });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Series General Info"
      description="Add general information about the series."
      onSubmit={handleSubmit(submitHandler)}
      isLoading={isSubmitting}
      submitButtonText="Save Info"
    >
      <div className="flex flex-col gap-y-6 mt-4">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Series Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
            placeholder="Series name"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            {...register("description", { required: true })}
            placeholder="Description"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="poster_file">Poster Image</Label>
          <Input
            id="poster_file"
            type="file"
            accept="image/*"
            {...register("poster_file")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="release_year">Release Year</Label>
            <Input
              id="release_year"
              type="number"
              {...register("release_year", {
                required: true,
                min: 1900,
                max: 2100,
              })}
              placeholder="Year"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="parental_rating">Parental Rating</Label>
            <Select
              value={watch("parental_rating")}
              onValueChange={(val) => setValue("parental_rating", val)}
            >
              <SelectTrigger id="parental_rating">
                <SelectValue placeholder="Parental Rating" />
              </SelectTrigger>
              <SelectContent>
                {parentalRatings.map((rating) => (
                  <SelectItem key={rating.value} value={rating.value}>
                    {rating.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label>Genres (select multiple)</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
              {genres.map((genre) => (
                <Badge
                  key={genre.value}
                  variant={
                    selectedGenres.includes(genre.value) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre.value)}
                >
                  {genre.label}
                </Badge>
              ))}
            </div>
            {selectedGenres.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No genres selected
              </p>
            )}
          </div>
        </div>
      </div>
    </FormSheet>
  );
}
