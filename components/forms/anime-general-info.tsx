import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";

export interface AnimeGeneralInfoFormValues {
  name: string;
  description: string;
  release_year: number;
  age_rating: string;
  is_original: boolean;
}

interface AnimeGeneralInfoProps {
  onSubmit?: (data: AnimeGeneralInfoFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<AnimeGeneralInfoFormValues>;
}

export default function AnimeGeneralInfo({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: AnimeGeneralInfoProps) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AnimeGeneralInfoFormValues>({
    defaultValues: {
      name: "",
      description: "",
      release_year: new Date().getFullYear(),
      age_rating: "PG",
      is_original: false,
      ...defaultValues,
    },
  });

  const submitHandler =
    onSubmit ||
    ((data) => {
      console.log("Anime general info data", data);
    });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Anime General Info"
      description="Add general information about the anime."
      onSubmit={handleSubmit(submitHandler)}
      isLoading={isSubmitting}
      submitButtonText="Save Info"
    >
      <div className="flex flex-col gap-y-6 mt-4">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Anime Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
            placeholder="Anime name"
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
            <Label htmlFor="age_rating">Age Rating</Label>
            <Select
              value={watch("age_rating")}
              onValueChange={(val) => setValue("age_rating", val)}
            >
              <SelectTrigger id="age_rating">
                <SelectValue placeholder="Age Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="G">G</SelectItem>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="PG-13">PG-13</SelectItem>
                <SelectItem value="R">R</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </FormSheet>
  );
}
