"use client";

import { StreamUploader } from "../components/stream-uploader";
import VideoPlayer from "../components/video-player";

export default function Home() {
  // Handler for successful upload
  const handleUploadComplete = (file: any) => {
    alert(`Upload completed: ${file.name}. Stream UID: ${file.uid}`);
    console.log("[v0] Upload completed:", file);
  };

  // Handler for upload error
  const handleUploadError = (error: any, file: any) => {
    alert(`Upload error: ${error.message || error}`);
    console.error("[v0] Upload error:", error, file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Video Upload to Cloudflare Stream
          </h1>
          <p className="text-gray-600">
            Upload your videos securely using resumable TUS protocol
          </p>
        </div>

        <StreamUploader
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          maxFileSize={5 * 1024 * 1024 * 1024} // 5GB
        />
      </div>
      <div className="max-w-4xl mx-auto mt-12">
        <VideoPlayer
          videoId="dfed538d03658e0188eecb21d8ed39f3"
          customerId="customer-450hlmgeahk5dcih"
          title="Film 101"
          description="Film Description"
        />
      </div>
    </div>
  );
}
