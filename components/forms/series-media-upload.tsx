import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { qualities } from "../../data/qualities";
import FormSheet from "../form-sheet";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { X } from "lucide-react";

export interface SeriesMediaUploadFormValues {
  season_number: number;
  quality: string;
  episodes: Array<{
    episode_number: number;
    title: string;
    magnet_url?: string;
  }>;
}

interface SeriesMediaUploadProps {
  onSubmit?: (data: SeriesMediaUploadFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<SeriesMediaUploadFormValues>;
}

const downloadCsvTemplate = () => {
  const csv = `episode_number,title,magnet_url
1,Episode 1,magnet:?xt=urn:btih:XXXX
2,Episode 2,magnet:?xt=urn:btih:YYYY`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "episodes_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const downloadJsonTemplate = () => {
  const json = JSON.stringify(
    [
      {
        episode_number: 1,
        title: "Episode 1",
        magnet_url: "magnet:?xt=urn:btih:XXXX",
      },
      {
        episode_number: 2,
        title: "Episode 2",
        magnet_url: "magnet:?xt=urn:btih:YYYY",
      },
    ],
    null,
    2
  );

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "episodes_template.json";
  a.click();
  URL.revokeObjectURL(url);
};

export default function SeriesMediaUpload({
  onSubmit,
  open,
  onOpenChange,
  defaultValues,
}: SeriesMediaUploadProps) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<SeriesMediaUploadFormValues>({
    defaultValues: {
      season_number: 1,
      quality: "",
      episodes: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "episodes",
  });

  const handleBulkFileChange = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        let parsed: SeriesMediaUploadFormValues["episodes"] = [];

        if (file.name.endsWith(".json")) {
          const arr = JSON.parse(text);
          if (Array.isArray(arr)) {
            parsed = arr.map((it: any, idx: number) => ({
              episode_number: Number(it.episode_number || idx + 1),
              title: it.title || `Episode ${it.episode_number || idx + 1}`,
              magnet_url: it.magnet_url || it.magnet || "",
            }));
          }
        } else {
          const lines = text.split(/\r?\n/).filter(Boolean);
          if (lines.length < 2) return;

          const headers = lines[0].split(",").map((h) => h.trim());
          parsed = lines.slice(1).map((line, idx) => {
            const cols = line.split(",").map((c) => c.trim());
            const row: any = {};
            headers.forEach((h, i) => (row[h] = cols[i]));
            const epNum = Number(row.episode_number || idx + 1);
            return {
              episode_number: epNum,
              title: row.title || `Episode ${epNum}`,
              magnet_url: row.magnet_url || row.magnet || "",
            };
          });
        }

        const seen = new Set<number>();
        parsed = parsed
          .filter((e) => e.episode_number > 0)
          .filter((e) => {
            if (seen.has(e.episode_number)) return false;
            seen.add(e.episode_number);
            return true;
          })
          .sort((a, b) => a.episode_number - b.episode_number);

        replace(parsed);
      } catch (err) {
        console.error("Bulk upload failed", err);
      }
    };

    reader.readAsText(file);
  };

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
      description="Upload episodes for a selected season"
      onSubmit={handleSubmit(submitHandler)}
      isLoading={isSubmitting}
      submitButtonText="Save Episodes"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="season_number">Season Number</Label>
          <Input
            id="season_number"
            type="number"
            {...register("season_number", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Quality & Resolution</Label>
          <Select
            value={watch("quality")}
            onValueChange={(val) => setValue("quality", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {qualities.map((q) =>
                q.resolutions.map((res) => (
                  <SelectItem key={q.id + res} value={`${q.name} ${res}`}>
                    {q.name} {res}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Episodes</CardTitle>
            <CardDescription>{fields.length} episode(s) added</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No episodes added yet. Add manually or upload a file.
              </div>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 p-4 border rounded-lg relative bg-muted/30"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      Episode Number
                    </Label>
                    <Input
                      type="number"
                      {...register(`episodes.${index}.episode_number`, {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Title</Label>
                    <Input
                      {...register(`episodes.${index}.title`)}
                      placeholder="Episode title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      Magnet URL / Info Hash
                    </Label>
                    <Input
                      {...register(`episodes.${index}.magnet_url`)}
                      placeholder="magnet:?xt=urn:btih:..."
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              ))
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                onClick={() =>
                  append({
                    episode_number: fields.length + 1,
                    title: `Episode ${fields.length + 1}`,
                    magnet_url: "",
                  })
                }
                className="w-full"
              >
                Add Episode
              </Button>
              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => replace([])}
                  className="w-full"
                >
                  Clear All Episodes
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold">Bulk Upload</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload CSV or JSON file with episode data
                </p>
              </div>

              <Input
                type="file"
                accept=".csv,application/json,text/csv"
                onChange={(e) => handleBulkFileChange(e.target.files?.[0])}
              />

              <div className="flex flex-col justify-center gap-2">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => downloadCsvTemplate()}
                  className="w-full"
                >
                  Download CSV Template
                </Button>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => downloadJsonTemplate()}
                  className="w-full"
                >
                  Download JSON Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormSheet>
  );
}
