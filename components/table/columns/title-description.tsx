export default function TitleDescriptionColumn({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium capitalize">{title}</span>
      <span className="text-xs text-muted-foreground capitalize">
        {description}
      </span>
    </div>
  );
}
