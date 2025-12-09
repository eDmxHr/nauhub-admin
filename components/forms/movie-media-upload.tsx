import { useForm, Controller } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { StreamUploader } from "../../components/stream-uploader";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";

export interface MovieMediaUploadFormValues {
  poster_url: string;
  movie_file?: any; // Will be handled by StreamUploader
}

interface MovieMediaUploadProps {
  onSubmit?: (data: MovieMediaUploadFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<MovieMediaUploadFormValues>;
}

export default function MovieMediaUpload({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: MovieMediaUploadProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<MovieMediaUploadFormValues>({
    defaultValues: {
      poster_url: "",
      movie_file: undefined,
      ...defaultValues,
    },
  });

  const submitHandler =
    onSubmit ||
    ((data) => {
      // Default: log data
      console.log("Movie media upload data", data);
    });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Movie Media Upload"
      description="Upload media files for the movie."
      onSubmit={handleSubmit(submitHandler)}
      isLoading={isSubmitting}
      submitButtonText="Upload Media"
    >
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="poster_url">Poster URL</Label>
          <Input
            id="poster_url"
            {...register("poster_url")}
            placeholder="Poster URL"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="movie_file">Movie File</Label>
          <Controller
            control={control}
            name="movie_file"
            render={({ field }) => (
              <StreamUploader
                onUploadComplete={(file) => field.onChange(file)}
                onUploadError={() => field.onChange(undefined)}
              />
            )}
          />
        </div>
      </div>
    </FormSheet>
  );
}
