"use client";

import { create } from "zustand";

export interface UploadStatus {
  video_uid: string;
  fileName: string;
  state: "inprogress" | "ready" | "error";
  ready: boolean;
  progress: number;
  duration: number | null;
  size: number;
  error?: string;
  startedAt: number;
}

interface UploadStore {
  uploads: Map<string, UploadStatus>;
  addUpload: (videoUid: string, fileName: string, size: number) => void;
  updateUpload: (videoUid: string, status: Partial<UploadStatus>) => void;
  removeUpload: (videoUid: string) => void;
  getUploads: () => UploadStatus[];
  getActiveUploads: () => UploadStatus[];
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  uploads: new Map(),

  addUpload: (videoUid, fileName, size) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      newUploads.set(videoUid, {
        video_uid: videoUid,
        fileName,
        state: "inprogress",
        ready: false,
        progress: 0,
        duration: null,
        size,
        startedAt: Date.now(),
      });
      return { uploads: newUploads };
    });
  },

  updateUpload: (videoUid, status) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      const existing = newUploads.get(videoUid);
      if (existing) {
        newUploads.set(videoUid, { ...existing, ...status });
      }
      return { uploads: newUploads };
    });
  },

  removeUpload: (videoUid) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      newUploads.delete(videoUid);
      return { uploads: newUploads };
    });
  },

  getUploads: () => {
    return Array.from(get().uploads.values());
  },

  getActiveUploads: () => {
    return Array.from(get().uploads.values()).filter(
      (upload) => !upload.ready && upload.state !== "error"
    );
  },
}));

