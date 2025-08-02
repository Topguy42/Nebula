import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Shield,
  Zap,
  Volume2,
} from "lucide-react";

interface SettingsProps {
  settings: {
    darkMode: boolean;
    notifications: boolean;
    autoplay: boolean;
    privacy: boolean;
    volume: number[];
    quality: string;
  };
  setSettings: (settings: any) => void;
}

export default function Settings({ settings, setSettings }: SettingsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings((prev: any) => ({ ...prev, darkMode: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive browser notifications</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings((prev: any) => ({ ...prev, notifications: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-play Media</p>
                <p className="text-sm text-muted-foreground">Automatically play videos and audio</p>
              </div>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) => setSettings((prev: any) => ({ ...prev, autoplay: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enhanced Privacy</p>
                <p className="text-sm text-muted-foreground">Block trackers and ads</p>
              </div>
              <Switch
                checked={settings.privacy}
                onCheckedChange={(checked) => setSettings((prev: any) => ({ ...prev, privacy: checked }))}
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Volume</p>
                  <p className="text-sm text-muted-foreground">Default media volume</p>
                </div>
                <Volume2 className="h-4 w-4" />
              </div>
              <Slider
                value={settings.volume}
                onValueChange={(value) => setSettings((prev: any) => ({ ...prev, volume: value }))}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">{settings.volume[0]}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="font-medium">Proxy Quality</p>
              <p className="text-sm text-muted-foreground mb-3">Higher quality uses more bandwidth</p>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((quality) => (
                  <Button
                    key={quality}
                    variant={settings.quality === quality ? "default" : "outline"}
                    onClick={() => setSettings((prev: any) => ({ ...prev, quality }))}
                    className="capitalize"
                  >
                    {quality}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">Nebula v1.0.0 • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}
