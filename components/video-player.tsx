"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "@/lib/icons";

interface VideoPlayerProps {
  videoId?: string;
  customerId?: string;
  title?: string;
  description?: string;
}

declare global {
  interface Window {
    Stream: any;
  }
}

export default function VideoPlayer({
  videoId = "demo",
  customerId = "customer-450hlmgeahk5dcih",
  title = "Video",
  description,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const streamUrl = `https://${customerId}.cloudflarestream.com/${videoId}/iframe`;

  useEffect(() => {
    if (!videoId || videoId === "demo") {
      setError(null);
      setIsLoading(false);
      return;
    }

    // Load Cloudflare Stream SDK
    const script = document.createElement("script");
    script.src = "https://embed.cloudflarestream.com/embed/sdk.latest.js";
    script.async = true;
    script.onload = () => {
      if (iframeRef.current && window.Stream) {
        try {
          const streamPlayer = window.Stream(iframeRef.current);
          setPlayer(streamPlayer);

          // Event listeners
          streamPlayer.addEventListener("loadedmetadata", () => {
            setDuration(streamPlayer.duration);
            setIsLoading(false);
          });

          streamPlayer.addEventListener("play", () => setIsPlaying(true));
          streamPlayer.addEventListener("pause", () => setIsPlaying(false));
          streamPlayer.addEventListener("volumechange", () => {
            setIsMuted(streamPlayer.muted);
            setVolume(streamPlayer.volume);
          });

          streamPlayer.addEventListener("timeupdate", () => {
            setCurrentTime(streamPlayer.currentTime);
          });

          // Auto-hide controls
          streamPlayer.addEventListener("play", () => {
            setShowControls(true);
            scheduleControlsHide();
          });

          streamPlayer.addEventListener("error", (e: any) => {
            setError("Failed to load video");
            setIsLoading(false);
          });
        } catch (err) {
          setError("Failed to initialize video player");
          setIsLoading(false);
        }
      }
    };

    script.onerror = () => {
      setError("Failed to load Cloudflare Stream SDK");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [videoId]);

  const scheduleControlsHide = () => {
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    scheduleControlsHide();
  };

  const togglePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleMute = () => {
    if (!player) return;
    player.muted = !isMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const newVolume = parseFloat(e.target.value);
    player.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    player.currentTime = newTime;
  };

  const skipTime = (seconds: number) => {
    if (!player) return;
    player.currentTime = Math.max(
      0,
      Math.min(duration, player.currentTime + seconds)
    );
  };

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      iframeRef.current.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative group bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Title */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-linear-to-b from-black/80 via-black/20 to-transparent p-6">
        <h2 className="text-white text-2xl font-bold mb-1">{title}</h2>
        {description && <p className="text-gray-300 text-sm">{description}</p>}
      </div>

      {/* Video Container */}
      <div
        className="relative aspect-video w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => !isPlaying || setShowControls(false)}
      >
        {videoId === "demo" ? (
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-gray-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                <Play className="w-12 h-12 fill-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Demo Video Player</h3>
              <p className="text-gray-300">Upload a video to see it here</p>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={streamUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Error</h3>
            <p className="text-gray-300 text-center">{error}</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check your video ID and try again.
            </p>
          </div>
        )}

        {/* Play/Pause Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlayPause}
        >
          {!isPlaying && !isLoading && (
            <div className="bg-black/70 rounded-full p-4 hover:bg-black/90 transition-all duration-200">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Custom Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div className="px-6 pb-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${progressPercentage}%, rgba(255,255,255,0.3) ${progressPercentage}%, rgba(255,255,255,0.3) 100%)`,
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-6 pb-4">
            <div className="flex items-center space-x-4">
              {/* Skip Back */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-red-400 transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-red-400 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 fill-white" />
                )}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-red-400 transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Settings */}
              <button className="text-white hover:text-red-400 transition-colors">
                <Settings className="w-6 h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-red-400 transition-colors"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
