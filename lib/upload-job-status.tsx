import {
  CheckCircle2,
  AlertCircle,
  Download,
  Cloud,
  Loader2,
} from "lucide-react";

export type UploadJobStatus =
  | "downloading"
  | "uploading"
  | "processing"
  | "completed"
  | "error";

export function getUploadJobStatusIcon(status: UploadJobStatus) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case "downloading":
      return <Download className="h-5 w-5 text-blue-600 animate-pulse" />;
    case "uploading":
      return <Cloud className="h-5 w-5 text-purple-600 animate-pulse" />;
    case "processing":
      return <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />;
    default:
      return (
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      );
  }
}

export function getUploadJobStatusLabel(status: UploadJobStatus) {
  switch (status) {
    case "downloading":
      return "Downloading from source";
    case "uploading":
      return "Uploading to Cloudflare";
    case "processing":
      return "Processing on Cloudflare";
    case "completed":
      return "Ready";
    case "error":
      return "Error";
    default:
      return status;
  }
}

export function getUploadJobStatusVariant(
  status: UploadJobStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "error":
      return "destructive";
    default:
      return "secondary";
  }
}
