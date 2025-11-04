import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Church, Castle, Landmark, Bell } from "lucide-react";
import { useState } from "react";

const monumentTypes = [
  { id: "temples", label: "Temples", icon: Church },
  { id: "forts", label: "Forts", icon: Castle },
  { id: "palaces", label: "Palaces", icon: Building2 },
  { id: "monuments", label: "Monuments", icon: Landmark },
];

const PreferencesSection = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["temples", "forts"]);

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                Your Preferences
              </CardTitle>
              <CardDescription className="text-base">
                Customize your learning experience by selecting monument types and notification settings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="text-base font-semibold">
                    Location Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when approaching monuments
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              {/* Monument Types */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Interested Monument Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monumentTypes.map(({ id, label, icon: Icon }) => (
                    <div
                      key={id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-smooth ${
                        selectedTypes.includes(id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleType(id)}
                    >
                      <Checkbox
                        id={id}
                        checked={selectedTypes.includes(id)}
                        onCheckedChange={() => toggleType(id)}
                      />
                      <Icon className="w-5 h-5 text-primary" />
                      <Label htmlFor={id} className="cursor-pointer flex-1">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-gradient-card border border-border/50">
                <p className="text-sm text-muted-foreground">
                  You will receive {notificationsEnabled ? "notifications" : "no notifications"} about{" "}
                  <span className="font-semibold text-foreground">
                    {selectedTypes.length} monument type(s)
                  </span>{" "}
                  during your walks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PreferencesSection;
