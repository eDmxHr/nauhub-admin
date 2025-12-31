import { LoaderIcon } from "lucide-react";
import React from "react";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
