import { useForm, Controller } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { StreamUploader } from "../../components/stream-uploader";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";

export interface AnimeMediaUploadFormValues {
  poster_url: string;
  trailer_url: string;
  anime_file?: any;
}

interface AnimeMediaUploadProps {
  onSubmit?: (data: AnimeMediaUploadFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<AnimeMediaUploadFormValues>;
}

export default function AnimeMediaUpload({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: AnimeMediaUploadProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AnimeMediaUploadFormValues>({
    defaultValues: {
      poster_url: "",
      trailer_url: "",
      anime_file: undefined,
      ...defaultValues,
    },
  });

  const submitHandler =
    onSubmit ||
    ((data) => {
      console.log("Anime media upload data", data);
    });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Anime Media Upload"
      description="Upload media files for the anime."
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
          <Label htmlFor="anime_file">Anime File</Label>
          <Controller
            control={control}
            name="anime_file"
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
