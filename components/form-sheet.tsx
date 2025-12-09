import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoaderCircleIcon } from "lucide-react";
import { ReactNode } from "react";

export interface FormSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  submitButtonText?: string;
  closeButtonText?: string;
  customFooter?: ReactNode;
}

export default function FormSheet({
  open = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  onSubmit,
  submitButtonText = "Save changes",
  closeButtonText = "Close",
  customFooter,
  isLoading = false,
  disabled = false,
}: FormSheetProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(e);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent>
        <form className="flex h-full w-full flex-col" onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>

            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : (
              <SheetDescription className="sr-only">{title}</SheetDescription>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">{children}</div>

          {customFooter || (
            <SheetFooter className="flex-row justify-between border-t">
              <SheetClose asChild>
                <Button variant="outline">{closeButtonText}</Button>
              </SheetClose>

              <Button type="submit" disabled={isLoading || disabled}>
                {isLoading && (
                  <LoaderCircleIcon
                    className="animate-spin"
                    aria-hidden="true"
                  />
                )}

                {submitButtonText}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
