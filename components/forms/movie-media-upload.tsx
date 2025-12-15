import { useForm, Controller } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { StreamUploader } from "../../components/stream-uploader";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";
import { qualities } from "@/data/qualities";

export interface MovieMediaUploadFormValues {
  quality: string;
  magnet_url: string;
  poster_file?: File;
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
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<MovieMediaUploadFormValues>({
    defaultValues: {
      quality: "",
      magnet_url: "",
      poster_file: undefined,
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
          <Label htmlFor="quality">Quality & Resolution</Label>
          <select
            id="quality"
            {...register("quality", { required: true })}
            className="border rounded-md p-2"
          >
            <option value="">Select quality</option>
            {qualities.map((q: any) =>
              q.resolutions.map((res: string) => (
                <option
                  key={q.id + res}
                  value={`${q.name} ${res}`}
                >{`${q.name} ${res}`}</option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="magnet_url">Magnet URL or Info Hash</Label>
          <Input
            id="magnet_url"
            {...register("magnet_url", { required: true })}
            placeholder="magnet:?xt=urn:btih:... or info hash"
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
      </div>
    </FormSheet>
  );
}
