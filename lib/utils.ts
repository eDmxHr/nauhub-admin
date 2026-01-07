import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDateTime(isoString: string): {
  date: string;
  time: string;
} {
  const dateObj = new Date(isoString);

  // Format date as "DD MMM YYYY"
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const year = dateObj.getFullYear();
  const date = `${day} ${month} ${year}`;

  // Format time as "HH:MM AM/PM"
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
}

export const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n).trimEnd() + "..." : str;

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Format as "DD MMM YYYY" (e.g., "15 Jan 2024")
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
