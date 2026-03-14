import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="animate-spin text-secondary" size={40} />
    </div>
  );
};
