import { cn, extractDateTime } from "@/lib/utils";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  value: string;
  showTime?: boolean;
}

export default function DateTimeColumn({
  value,
  showTime = true,
  className,
}: Props) {
  if (!value) {
    return null;
  }

  const { date, time } = extractDateTime(value);

  return (
    <div className={cn("flex flex-col", className)}>
      <div>{date}</div>
      {showTime && <div className="text-muted-foreground text-xs">{time}</div>}
    </div>
  );
}
