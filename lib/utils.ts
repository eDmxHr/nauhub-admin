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
