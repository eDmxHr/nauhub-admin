import { useForm, Controller } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { StreamUploader } from "../../components/stream-uploader";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";

export interface SeriesMediaUploadFormValues {
  poster_url: string;
  season_file?: any;
}

interface SeriesMediaUploadProps {
  onSubmit?: (data: SeriesMediaUploadFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<SeriesMediaUploadFormValues>;
}

export default function SeriesMediaUpload({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: SeriesMediaUploadProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SeriesMediaUploadFormValues>({
    defaultValues: {
      poster_url: "",
      season_file: undefined,
      ...defaultValues,
    },
  });

  const submitHandler =
    onSubmit ||
    ((data) => {
      console.log("Series media upload data", data);
    });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Series Media Upload"
      description="Upload media files for the series."
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
          <Label htmlFor="season_file">Season File</Label>
          <Controller
            control={control}
            name="season_file"
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
