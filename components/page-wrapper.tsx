import { PlusIcon } from "@/lib/icons";
import { Button } from "./ui/button";

export default function PageWrapper({
  title,
  description,
  renderProps,
  buttonLabel,
  setOpen,
  children,
  showButton,
}: {
  title: string;
  description?: string;
  setOpen?: (open: boolean) => void;
  buttonLabel?: string;
  renderProps?: React.ReactNode;
  children: React.ReactNode;
  showButton?: boolean;
}) {
  return (
    <div className="bg-background text-foreground px-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p>{description}</p>
          </div>
          {showButton && (
            <div>
              <Button onClick={() => setOpen?.(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                {buttonLabel || "Add"}
              </Button>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
