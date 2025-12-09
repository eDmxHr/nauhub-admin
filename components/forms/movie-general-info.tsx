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
import { qualities } from "../../data/qualities";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";

export interface MovieGeneralInfoFormValues {
  name: string;
  description: string;
  release_year: number;
  parental_rating: string;
  is_original: boolean;
  duration_minutes: number;
  quality: string;
  genre: string;
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
      is_original: false,
      duration_minutes: 90,
      quality: "",
      genre: "",
      ...defaultValues,
    },
  });

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
      title="Movie General Info"
      description="Add general information about the movie."
      onSubmit={handleSubmit(submitHandler)}
      isLoading={isSubmitting}
      submitButtonText="Save Info"
    >
      <div className="flex flex-col gap-y-6 mt-4">
        {/* Movie Name and Description outside grid */}
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Movie Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
            placeholder="Movie name"
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
        {/* Remaining fields in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Release Year */}
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
          {/* Genre */}
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              value={watch("genre")}
              onValueChange={(val) => setValue("genre", val)}
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                <SelectItem value="Thriller">Thriller</SelectItem>
                <SelectItem value="Drama">Drama</SelectItem>
                <SelectItem value="Comedy">Comedy</SelectItem>
                <SelectItem value="Action">Action</SelectItem>
                <SelectItem value="Documentary">Documentary</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Horror">Horror</SelectItem>
                <SelectItem value="Animation">Animation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Parental Rating */}
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
          {/* Duration */}
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="duration_minutes">Duration (min)</Label>
            <Input
              id="duration_minutes"
              type="number"
              {...register("duration_minutes", { required: true, min: 1 })}
              placeholder="Duration (min)"
            />
          </div>
          {/* Quality & Resolution */}
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="quality">Quality & Resolution</Label>
            <Select
              value={watch("quality")}
              onValueChange={(val) => setValue("quality", val)}
            >
              <SelectTrigger id="quality">
                <SelectValue placeholder="Quality & Resolution" />
              </SelectTrigger>
              <SelectContent>
                {qualities.map((q) =>
                  q.resolutions.map((res) => (
                    <SelectItem key={q.id + res} value={`${q.name} ${res}`}>
                      {`${q.name} ${res}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </FormSheet>
  );
}
