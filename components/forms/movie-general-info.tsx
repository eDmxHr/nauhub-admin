import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
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

export interface MovieGeneralInfoFormValues {
  name: string;
  description: string;
  release_year: number;
  parental_rating: string;
  duration_minutes: number;
  genres: string[];
}

interface MovieGeneralInfoProps {
  onSubmit?: (data: MovieGeneralInfoFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<MovieGeneralInfoFormValues>;
}

export default function MovieGeneralInfo({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: MovieGeneralInfoProps) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MovieGeneralInfoFormValues>({
    defaultValues: {
      name: "",
      description: "",
      release_year: new Date().getFullYear(),
      parental_rating: "PG-13",
      duration_minutes: 90,
      genres: [],
      ...defaultValues,
    },
  });

  const selectedGenres = watch("genres") || [];

  const toggleGenre = (genreValue: string) => {
    const currentGenres = selectedGenres;
    if (currentGenres.includes(genreValue)) {
      setValue(
        "genres",
        currentGenres.filter((g) => g !== genreValue)
      );
    } else {
      setValue("genres", [...currentGenres, genreValue]);
    }
  };

  const submitHandler =
    onSubmit ||
    ((data) => {
      // Default: log data
      console.log("Movie general info data", data);
    });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Movie Information"
      description="Add movie details, torrent magnet link, and poster."
      onSubmit={handleSubmit(submitHandler)}
      isLoading={isSubmitting}
      submitButtonText="Save Movie"
    >
      <div className="flex flex-col gap-y-6 mt-4">
        {/* Basic Information */}
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Movie Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
            placeholder="Enter movie name"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", { required: true })}
            placeholder="Enter movie description"
            rows={4}
          />
        </div>

        {/* Movie Details Grid */}
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
              placeholder="2024"
            />
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

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="parental_rating">Parental Rating</Label>
            <Select
              value={watch("parental_rating")}
              onValueChange={(val) => setValue("parental_rating", val)}
            >
              <SelectTrigger id="parental_rating">
                <SelectValue placeholder="Select rating" />
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

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input
              id="duration_minutes"
              type="number"
              {...register("duration_minutes", { required: true, min: 1 })}
              placeholder="120"
            />
          </div>
        </div>
      </div>
    </FormSheet>
  );
}
