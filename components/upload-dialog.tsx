import { ReactNode, ReactElement } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

export type UploadDialogProps = {
  children: ReactNode;
  title: string;
  buttonLabel: string;
};

export function UploadDialog({
  children,
  title,
  buttonLabel,
}: UploadDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
