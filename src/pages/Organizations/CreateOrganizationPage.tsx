import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateOrganizationForm } from "@/features/organization/ui/CreateOrganizationForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const CreateOrganizationPage = () => (
  <div className="mx-auto w-full max-w-3xl">
    <Button asChild variant="ghost" className="mb-4 -ml-3">
      <Link to="/account/organizations">
        <ArrowLeft aria-hidden="true" />
        Назад до компаній
      </Link>
    </Button>

    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Створення компанії</h1>
      <p className="mt-2 text-muted-foreground">
        Заповніть основну інформацію. Решту налаштувань можна буде додати пізніше.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Дані компанії</CardTitle>
        <CardDescription>
          Назва і тип компанії використовуватимуться для подальших налаштувань.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateOrganizationForm />
      </CardContent>
    </Card>
  </div>
);

export default CreateOrganizationPage;
