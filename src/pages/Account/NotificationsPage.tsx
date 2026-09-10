import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Info, ShieldAlert } from "lucide-react";

export const NotificationsPage = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing aria-hidden="true" className="text-primary" />
          Персональні сповіщення
        </CardTitle>
        <CardDescription>
          Тут з’являться канали сповіщень, які можна змінювати для особистого профілю.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info aria-hidden="true" />
          <AlertTitle>Налаштування ще не підключені</AlertTitle>
          <AlertDescription>
            Поточна модель користувача та API не містять notification preferences, тому перемикачі
            не показуються і фіктивні значення не зберігаються.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>

    <Alert className="border-primary/20 bg-accent/50">
      <ShieldAlert aria-hidden="true" />
      <AlertTitle>Критичні повідомлення безпеки</AlertTitle>
      <AlertDescription>
        Timefy може надсилати обов’язкові повідомлення, пов’язані з безпекою вашого облікового
        запису.
      </AlertDescription>
    </Alert>
  </div>
);

export default NotificationsPage;
