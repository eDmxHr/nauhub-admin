export const formatBadgeStatusText = (status: string | null | undefined) => {
  if (!status) return null;
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatBadgeStatusVariant = (status: string | null | undefined) => {
  switch (status) {
    case "ready":
      return "default";
    case "processing":
      return "processing";
    case "error":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "default";
  }
};
