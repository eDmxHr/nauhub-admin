# Cloudflare Stream TUS Upload Implementation

## Overview

This implementation provides a complete solution for uploading videos to Cloudflare Stream using the TUS (resumable upload) protocol in a Next.js 14 app.

## Architecture

### Security Model

- **Backend-only Cloudflare API calls**: The browser never talks directly to Cloudflare
- **No tokens in browser**: All authentication happens server-side
- **Secure upload URLs**: Backend generates time-limited upload URLs

### Flow

1. User selects video file
2. Frontend requests upload URL from `/api/stream/direct-upload`
3. Backend calls Cloudflare to create direct upload session
4. Backend returns `uploadURL` and `uid` to frontend
5. Frontend uses tus-js-client to upload to the provided URL
6. Upload progress is tracked and displayed
7. On completion, Cloudflare `uid` is available for further processing

## Files Created

### Backend API Route

- `/app/api/stream/direct-upload/route.ts`: Creates Cloudflare direct upload sessions

### React Component

- `/app/components/cloudflare-stream-uploader.tsx`: Complete upload UI with progress tracking

### Updated Files

- `/app/page.tsx`: Integration example
- `/.env`: Environment variables (backend-only)

## Environment Setup

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update your Cloudflare credentials:

   ```env
   CF_ACCOUNT_ID=your_account_id_here
   CF_STREAM_TOKEN=your_api_token_here
   ```

3. Get your credentials:
   - **Account ID**: Cloudflare Dashboard → Right sidebar
   - **API Token**: Cloudflare Dashboard → My Profile → API Tokens → Create Token
     - Use "Custom token" template
     - Permissions: `Stream:Edit`, `Stream:Create`
     - Account Resources: Include your account

## Features

### Upload Component Features

- ✅ Drag & drop file selection
- ✅ Video file validation
- ✅ File size limits (configurable)
- ✅ Real-time progress tracking
- ✅ Error handling with retry
- ✅ Multiple file uploads
- ✅ Resumable uploads (TUS protocol)
- ✅ Success/error states with UI feedback
- ✅ Cloudflare Stream UID returned on completion

### Security Features

- ✅ Backend-only API token usage
- ✅ No sensitive data exposed to browser
- ✅ Server-side upload URL generation
- ✅ Validation and error handling

## Usage

### Basic Integration

```tsx
import { CloudflareStreamUploader } from "./components/cloudflare-stream-uploader";

export default function MyPage() {
  const handleUploadComplete = (file) => {
    console.log("Video uploaded!", file.uid);
    // Use file.uid to access the video in Cloudflare Stream
  };

  const handleUploadError = (error, file) => {
    console.error("Upload failed:", error);
  };

  return (
    <CloudflareStreamUploader
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      maxFileSize={5 * 1024 * 1024 * 1024} // 5GB
    />
  );
}
```

### Advanced Configuration

```tsx
<CloudflareStreamUploader
  onUploadComplete={(file) => {
    // Handle successful upload
    console.log("Stream UID:", file.uid);
  }}
  onUploadError={(error, file) => {
    // Handle upload errors
    console.error("Upload failed:", error.message);
  }}
  maxFileSize={2 * 1024 * 1024 * 1024} // 2GB limit
  className="my-custom-styles"
/>
```

## API Endpoints

### POST `/api/stream/direct-upload`

Creates a new Cloudflare Stream direct upload session.

**Response:**

```json
{
  "uploadURL": "https://upload.videodelivery.net/tus/...",
  "uid": "abc123def456ghi789"
}
```

**Error Response:**

```json
{
  "error": "Description of error",
  "details": "Additional error details"
}
```

## Testing

1. Start development server:

   ```bash
   npm run dev
   ```

2. Navigate to your app and test:
   - Select a video file
   - Verify upload progress is displayed
   - Check browser console for success/error messages
   - Confirm Cloudflare Stream UID is returned

## Troubleshooting

### Common Issues

1. **"Failed to get upload URL"**

   - Check your environment variables are set correctly
   - Verify your Cloudflare API token has correct permissions
   - Check server console for detailed error messages

2. **Upload fails immediately**

   - Verify file is a valid video format
   - Check file size doesn't exceed limits
   - Ensure network connection is stable

3. **Imports not found**
   - Ensure shadcn/ui components are installed
   - Check import paths match your project structure

### Debug Steps

1. Check server logs for API errors
2. Open browser dev tools → Network tab
3. Verify `/api/stream/direct-upload` returns valid response
4. Check that `uploadURL` is a valid TUS endpoint

## Production Considerations

1. **File Size Limits**: Adjust `maxFileSize` based on your needs
2. **Allowed Origins**: Update `allowedOrigins` in API route for production domains
3. **Rate Limiting**: Consider adding rate limiting to the API endpoint
4. **Error Monitoring**: Add proper error logging/monitoring
5. **Upload Limits**: Consider adding user-based upload quotas

## Dependencies Used

- `tus-js-client`: TUS resumable upload client
- `lucide-react`: Icons
- `shadcn/ui`: UI components
- Next.js 14 App Router

The implementation is now complete and ready for testing!
