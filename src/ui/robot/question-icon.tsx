import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface QuestionIconProps {
  status: "approved" | "pending" | "rejected";
}

export function QuestionIcon({ status }: QuestionIconProps) {
  if (status === "approved") {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-green-500">
        <CheckCircle2 className="size-4" />
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
        <Clock className="size-4" />
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-500">
        <XCircle className="size-4" />
      </div>
    );
  }

  return null;
}
