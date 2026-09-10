import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

type EmailStatusProps = {
  verified: boolean;
  pending?: boolean;
};

export const EmailStatus = ({ verified, pending = false }: EmailStatusProps) => {
  if (verified) {
    return (
      <Badge className="gap-1.5 bg-success-surface text-success hover:bg-success-surface">
        <CheckCircle2 aria-hidden="true" className="size-3.5" />
        Підтверджено
      </Badge>
    );
  }

  if (pending) {
    return (
      <Badge variant="outline" className="gap-1.5 text-warning">
        <Clock3 aria-hidden="true" className="size-3.5" />
        Очікує підтвердження
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-destructive">
      <XCircle aria-hidden="true" className="size-3.5" />
      Не підтверджено
    </Badge>
  );
};
