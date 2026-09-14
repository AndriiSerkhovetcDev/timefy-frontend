import { Button } from "@/components/ui/button";
import { CreateOrganizationForm } from "@/features/organization/ui/CreateOrganizationForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const CreateOrganizationPage = () => (
  <div className="min-w-0 space-y-6">
    <Button asChild variant="ghost" className="mb-4 -ml-3">
      <Link to="/account/organizations">
        <ArrowLeft aria-hidden="true" />
        Назад до компаній
      </Link>
    </Button>

    <div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Створення компанії</h1>
      <p className="mt-2 text-muted-foreground">
        Заповніть основну інформацію. Решту налаштувань можна буде додати пізніше.
      </p>
    </div>

    <CreateOrganizationForm />
  </div>
);

export default CreateOrganizationPage;
