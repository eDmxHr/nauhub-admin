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

export interface SeriesGeneralInfoFormValues {
  name: string;
  description: string;
  release_year: number;
  season_number: number;
  quality: string;
  parental_rating: string;
  genre: string;
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
      season_number: 1,
      quality: "",
      parental_rating: "PG-13",
      genre: "",
      ...defaultValues,
    },
  });

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
            <Label htmlFor="season_number">Season Number</Label>
            <Input
              id="season_number"
              type="number"
              {...register("season_number", { required: true, min: 1 })}
              placeholder="Season Number"
            />
          </div>
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
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="quality">Quality</Label>
            <Select
              value={watch("quality")}
              onValueChange={(val) => setValue("quality", val)}
            >
              <SelectTrigger id="quality">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                {qualities.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </div>
    </FormSheet>
  );
}
