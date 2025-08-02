import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { Settings as SettingsIcon, Shield, Zap, Volume2, Moon, Sun, Search, RotateCcw } from "lucide-react";

interface SettingsProps {
  settings: {
    notifications: boolean;
    autoplay: boolean;
    privacy: boolean;
    volume: number[];
    quality: string;
    aboutBlank: boolean;
    antiGoGuardian: boolean;
  };
  setSettings: (settings: any) => void;
}

export default function Settings({ settings, setSettings }: SettingsProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <Card className="backdrop-blur-glass border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    notifications: checked,
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-play Media</p>
                <p className="text-sm text-muted-foreground">
                  Automatically play videos and audio
                </p>
              </div>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) =>
                  setSettings((prev: any) => ({ ...prev, autoplay: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-glass border-border/50 hover:shadow-lg transition-all duration-300">
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
                <p className="text-sm text-muted-foreground">
                  Block trackers and ads
                </p>
              </div>
              <Switch
                checked={settings.privacy}
                onCheckedChange={(checked) =>
                  setSettings((prev: any) => ({ ...prev, privacy: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">About Blank Mode</p>
                <p className="text-sm text-muted-foreground">
                  Block all requests with styled about:blank page
                </p>
              </div>
              <Switch
                checked={settings.aboutBlank}
                onCheckedChange={(checked) =>
                  setSettings((prev: any) => ({ ...prev, aboutBlank: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anti-GoGuardian</p>
                <p className="text-sm text-muted-foreground">
                  Prevent monitoring software from closing tabs
                </p>
              </div>
              <Switch
                checked={settings.antiGoGuardian}
                onCheckedChange={(checked) =>
                  setSettings((prev: any) => ({ ...prev, antiGoGuardian: checked }))
                }
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Referrer Rotation</p>
                  <p className="text-sm text-muted-foreground">
                    Rotate referrer headers to bypass restrictions
                  </p>
                </div>
                <Switch
                  checked={localStorage.getItem('proxy-referrer-rotation') === 'true'}
                  onCheckedChange={(checked) => {
                    localStorage.setItem('proxy-referrer-rotation', checked.toString());
                    // Force re-render
                    setSettings((prev: any) => ({ ...prev }));
                  }}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Volume</p>
                  <p className="text-sm text-muted-foreground">
                    Default media volume
                  </p>
                </div>
                <Volume2 className="h-4 w-4" />
              </div>
              <Slider
                value={settings.volume}
                onValueChange={(value) =>
                  setSettings((prev: any) => ({ ...prev, volume: value }))
                }
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">
                {settings.volume[0]}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-glass border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="font-medium">Default Search Engine</p>
              <p className="text-sm text-muted-foreground mb-3">
                Choose your preferred search engine to avoid rate limiting
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'duckduckgo', name: 'DuckDuckGo', desc: 'Privacy-focused' },
                  { key: 'google', name: 'Google', desc: 'Most comprehensive' },
                  { key: 'bing', name: 'Bing', desc: 'Microsoft search' },
                  { key: 'startpage', name: 'Startpage', desc: 'Private Google results' },
                ].map((engine) => {
                  const isSelected = (localStorage.getItem('preferred-search-engine') || 'google') === engine.key;
                  return (
                    <Button
                      key={engine.key}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => {
                        localStorage.setItem('preferred-search-engine', engine.key);
                        setSettings((prev: any) => ({ ...prev })); // Force re-render
                      }}
                      className="h-auto p-3 flex flex-col items-start text-left"
                    >
                      <span className="font-medium">{engine.name}</span>
                      <span className="text-xs text-muted-foreground">{engine.desc}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-glass border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="font-medium">Proxy Quality</p>
              <p className="text-sm text-muted-foreground mb-3">
                Higher quality uses more bandwidth
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map((quality) => (
                  <Button
                    key={quality}
                    variant={
                      settings.quality === quality ? "default" : "outline"
                    }
                    onClick={() =>
                      setSettings((prev: any) => ({ ...prev, quality }))
                    }
                    className="capitalize"
                  >
                    {quality}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-glass border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reset Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reset All Settings</p>
                <p className="text-sm text-muted-foreground">
                  Restore default search engine and clear rate limiting data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem('preferred-search-engine');
                  localStorage.removeItem('proxy-referrer-rotation');
                  setSettings({
                    notifications: true,
                    autoplay: false,
                    privacy: true,
                    volume: [75],
                    quality: "high",
                    aboutBlank: false,
                    antiGoGuardian: false,
                  });
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">
            Vortex v1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
