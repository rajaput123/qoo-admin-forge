import { Card, CardContent } from "@/components/ui/card";
import { Cog } from "lucide-react";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Cog className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">System Settings</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This feature is coming soon. You'll be able to configure notification preferences, email/SMS settings, document templates, and system-wide configurations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
