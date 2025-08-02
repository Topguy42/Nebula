import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Tools from "@/components/Tools";
import Settings from "@/components/Settings";
import {
  Gamepad2,
  Star,
  Play,
  ExternalLink,
  Search,
  ArrowLeft,
  Download,
  Mail,
  MessageSquare,
  Calendar,
  Music,
  Camera,
  Map,
  BookOpen,
  Code,
  Globe,
  Youtube,
  FileText,
} from "lucide-react";

const popularGames = [
  {
    name: "2048",
    url: "https://play2048.co/",
    description: "Number puzzle game",
    category: "Puzzle",
    rating: 4.8,
  },
  {
    name: "Slope",
    url: "https://slope-game.github.io/",
    description: "3D running game",
    category: "Action",
    rating: 4.7,
  },
  {
    name: "Snake",
    url: "https://www.google.com/fbx?fbx=snake_arcade",
    description: "Classic snake game",
    category: "Arcade",
    rating: 4.6,
  },
  {
    name: "Tetris",
    url: "https://tetris.com/play-tetris",
    description: "Block puzzle classic",
    category: "Puzzle",
    rating: 4.9,
  },
  {
    name: "Flappy Bird",
    url: "https://flappybird.io/",
    description: "Side-scrolling mobile game",
    category: "Arcade",
    rating: 4.5,
  },
  {
    name: "Pac-Man",
    url: "https://www.google.com/doodles/30th-anniversary-of-pac-man",
    description: "Classic arcade game",
    category: "Arcade",
    rating: 4.8,
  },
  {
    name: "Among Us",
    url: "https://skribbl.io/",
    description: "Social deduction party game",
    category: "Social",
    rating: 4.6,
  },
  {
    name: "Minecraft Classic",
    url: "https://classic.minecraft.net/",
    description: "Build and explore in creative mode",
    category: "Sandbox",
    rating: 4.9,
  },
  {
    name: "Cut the Rope",
    url: "https://www.cuttherope.ie/",
    description: "Physics puzzle game",
    category: "Puzzle",
    rating: 4.7,
  },
];

const quickLinks = [
  { name: "YouTube", url: "https://youtube.com", icon: "🎥" },
  { name: "Reddit", url: "https://reddit.com", icon: "🔴" },
  { name: "Discord", url: "https://discord.com", icon: "💬" },
  { name: "Wikipedia", url: "https://wikipedia.org", icon: "📚" },
  { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
  { name: "GitHub", url: "https://github.com", icon: "⚡" },
  { name: "Instagram", url: "https://instagram.com", icon: "📷" },
  { name: "TikTok", url: "https://tiktok.com", icon: "🎵" },
];

const webApps = [
  {
    name: "Google Docs",
    url: "https://docs.google.com",
    icon: FileText,
    description: "Create and edit documents online",
    category: "Productivity",
  },
  {
    name: "Gmail",
    url: "https://gmail.com",
    icon: Mail,
    description: "Email and communication",
    category: "Communication",
  },
  {
    name: "Google Drive",
    url: "https://drive.google.com",
    icon: Download,
    description: "Cloud storage and file sharing",
    category: "Storage",
  },
  {
    name: "WhatsApp Web",
    url: "https://web.whatsapp.com",
    icon: MessageSquare,
    description: "Messaging app for web",
    category: "Communication",
  },
  {
    name: "Google Calendar",
    url: "https://calendar.google.com",
    icon: Calendar,
    description: "Schedule and manage events",
    category: "Productivity",
  },
  {
    name: "Spotify Web",
    url: "https://open.spotify.com",
    icon: Music,
    description: "Music streaming service",
    category: "Entertainment",
  },
  {
    name: "Photopea",
    url: "https://photopea.com",
    icon: Camera,
    description: "Online photo editor",
    category: "Design",
  },
  {
    name: "Google Maps",
    url: "https://maps.google.com",
    icon: Map,
    description: "Navigation and location services",
    category: "Navigation",
  },
  {
    name: "Notion",
    url: "https://notion.so",
    icon: BookOpen,
    description: "Notes and project management",
    category: "Productivity",
  },
  {
    name: "CodePen",
    url: "https://codepen.io",
    icon: Code,
    description: "Online code editor and playground",
    category: "Development",
  },
  {
    name: "Translate",
    url: "https://translate.google.com",
    icon: Globe,
    description: "Language translation service",
    category: "Utility",
  },
  {
    name: "YouTube Studio",
    url: "https://studio.youtube.com",
    icon: Youtube,
    description: "Video creation and management",
    category: "Content",
  },
];

// Custom N Logo Component
const NebulaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={`${className} rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white shadow-lg`}
  >
    <span className="text-xl font-black">N</span>
  </div>
);

export default function Index() {
  const [proxyUrl, setProxyUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "proxy" | "games" | "apps" | "tools" | "settings"
  >("proxy");
  const [currentUrl, setCurrentUrl] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentHistory, setRecentHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([
    "https://google.com",
    "https://github.com",
    "https://youtube.com",
    "https://wikipedia.org",
  ]);

  // Settings state
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoplay: false,
    privacy: true,
    volume: [75],
    quality: "high",
    aboutBlank: false,
  });

  // Store reference to about:blank window
  const [aboutBlankWindow, setAboutBlankWindow] = useState<Window | null>(null);

  // Effect to trigger about:blank immediately when setting is enabled
  useEffect(() => {
    if (settings.aboutBlank) {
      const newWindow = window.open("about:blank", "_blank");
      if (newWindow) {
        setAboutBlankWindow(newWindow);

        // Load the actual Nebula app in the about:blank window
        const currentUrl = window.location.href;
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Nebula Proxy - About Blank Mode</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              iframe {
                width: 100vw;
                height: 100vh;
                border: none;
                display: block;
              }
            </style>
          </head>
          <body>
            <iframe
              src="${currentUrl}"
              allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; vr; xr-spatial-tracking"
              allowfullscreen
              sandbox="allow-same-origin allow-scripts allow-forms allow-navigation allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-top-navigation-by-user-activation"
            ></iframe>
          </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      setAboutBlankWindow(null);
    }
  }, [settings.aboutBlank]);

  const handleProxySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proxyUrl.trim()) {
      const query = proxyUrl.trim();
      setIsLoading(true);

      // Check if about blank is enabled
      if (settings.aboutBlank) {
        if (aboutBlankWindow && !aboutBlankWindow.closed) {
          // Focus the about:blank window that contains the full Nebula app
          aboutBlankWindow.focus();
        }
        setIsLoading(false);
        setProxyUrl("");
        return;
      }

      // Check if it's a URL
      const isUrl =
        query.startsWith("http://") ||
        query.startsWith("https://") ||
        query.startsWith("www.") ||
        (query.includes(".") &&
          !query.includes(" ") &&
          query.split(".").length >= 2);

      let finalUrl = "";
      if (isUrl) {
        // Handle as URL
        let url = query;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }
        finalUrl = url;
        setDisplayUrl(url);
        setCurrentUrl(`/api/proxy?url=${encodeURIComponent(url)}`);
      } else {
        // Handle as search query - redirect to Google
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        finalUrl = searchUrl;
        setDisplayUrl(`Google Search: ${query}`);
        setCurrentUrl(`/api/proxy?url=${encodeURIComponent(searchUrl)}`);
      }

      // Add to recent history
      setRecentHistory((prev) => {
        const updated = [finalUrl, ...prev.filter((url) => url !== finalUrl)];
        return updated.slice(0, 5); // Keep only 5 recent items
      });
    }
  };

  const handleGamePlay = (gameUrl: string) => {
    setIsLoading(true);

    // Check if about blank is enabled
    if (settings.aboutBlank) {
      if (aboutBlankWindow && !aboutBlankWindow.closed) {
        aboutBlankWindow.focus();
      }
      setIsLoading(false);
      return;
    }

    setDisplayUrl(gameUrl);
    setCurrentUrl(`/api/proxy?url=${encodeURIComponent(gameUrl)}`);
    setActiveTab("proxy"); // Switch to proxy tab to show the iframe
  };

  const handleQuickLink = (url: string) => {
    setIsLoading(true);

    // Check if about blank is enabled
    if (settings.aboutBlank) {
      if (aboutBlankWindow && !aboutBlankWindow.closed) {
        aboutBlankWindow.focus();
      }
      setIsLoading(false);
      return;
    }

    setDisplayUrl(url);
    setCurrentUrl(`/api/proxy?url=${encodeURIComponent(url)}`);
  };

  const handleBackToHome = () => {
    setCurrentUrl("");
    setDisplayUrl("");
    setProxyUrl("");
    setIsLoading(false);
  };

  const filteredGames = popularGames.filter(
    (game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // If showing iframe content
  if (currentUrl) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation Bar */}
        <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-6 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <NebulaLogo className="w-6 h-6" />
                <span className="font-semibold">Nebula</span>
              </div>
            </div>
            <div className="flex-1 max-w-2xl mx-4">
              <div className="bg-background/50 rounded-lg px-4 py-2 text-sm text-muted-foreground border border-border/50 truncate">
                {displayUrl}
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              🔒 Secure
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={currentUrl}
          className="w-full h-[calc(100vh-73px)] border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            console.log("Iframe failed to load");
          }}
          title="Browsing content"
          sandbox="allow-same-origin allow-scripts allow-forms allow-navigation allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-top-navigation-by-user-activation"
          allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; vr; xr-spatial-tracking"
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-blue-500/10 to-primary/10 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NebulaLogo className="w-12 h-12" />

            {/* Navigation */}
            <nav className="flex items-center space-x-8 text-sm font-medium">
              <button
                onClick={() => setActiveTab("proxy")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "proxy"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                PROXY
              </button>
              <button
                onClick={() => setActiveTab("games")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "games"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                GAMES
              </button>
              <button
                onClick={() => setActiveTab("apps")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "apps"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                APPS
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "tools"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                TOOLS
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "settings"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SETTINGS
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-8xl md:text-9xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NEBULA
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Browse freely, play endlessly
            </p>

            {/* Main Search/Input */}
            <div className="max-w-4xl mx-auto">
              {activeTab === "proxy" ? (
                <form onSubmit={handleProxySubmit}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search with Google or enter address"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="h-20 text-xl bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary rounded-2xl px-8"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="absolute right-3 top-3 h-14 px-6"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              ) : activeTab === "games" ? (
                <div className="relative">
                  <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-20 text-xl bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary rounded-2xl pl-16 pr-8"
                  />
                </div>
              ) : activeTab === "apps" ? (
                <div className="relative">
                  <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search web applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-20 text-xl bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary rounded-2xl pl-16 pr-8"
                  />
                </div>
              ) : activeTab === "tools" ? (
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Built-in Tools</h2>
                  <p className="text-muted-foreground text-lg">
                    Select a tool from below to get started
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Settings & Preferences
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Customize your Nebula experience
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "proxy" && (
            <div className="max-w-6xl mx-auto space-y-12">
              <div>
                <h3 className="text-2xl font-semibold mb-8">Quick Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      onClick={() => handleQuickLink(link.url)}
                      className="h-20 flex-col gap-3 bg-card/30 hover:bg-card/60 border-border/50 hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-xl"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-xs font-medium">{link.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {recentHistory.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Recent History</h3>
                  <div className="grid gap-3">
                    {recentHistory.map((url, index) => (
                      <Button
                        key={url}
                        variant="outline"
                        onClick={() => handleQuickLink(url)}
                        className="justify-start h-auto p-4 bg-card/20 hover:bg-card/40 border-border/30"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {index + 1}
                          </div>
                          <span className="truncate flex-1 text-left">
                            {url}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-6">Favorites</h3>
                <div className="grid gap-3">
                  {favorites.map((url) => (
                    <Button
                      key={url}
                      variant="outline"
                      onClick={() => handleQuickLink(url)}
                      className="justify-start h-auto p-4 bg-card/20 hover:bg-card/40 border-border/30"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                          ⭐
                        </div>
                        <span className="truncate flex-1 text-left">
                          {url.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <Card
                    key={game.name}
                    className="group hover:scale-[1.02] transition-all duration-300 bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-xl"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{game.name}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {game.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {game.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {game.rating}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleGamePlay(game.url)}
                          className="gap-2 group-hover:scale-105 transition-transform font-medium"
                        >
                          <Play className="h-4 w-4" />
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-12">
                  <Gamepad2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No games found</h3>
                  <p className="text-muted-foreground">
                    Try searching for a different game or category.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "apps" && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webApps
                  .filter(
                    (app) =>
                      app.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      app.category
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      app.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((app) => {
                    const IconComponent = app.icon;
                    return (
                      <Card
                        key={app.name}
                        className="group hover:scale-[1.02] transition-all duration-300 bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-xl cursor-pointer"
                        onClick={() => handleQuickLink(app.url)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-xl">
                                  {app.name}
                                </CardTitle>
                                <CardDescription className="text-base mt-1">
                                  {app.description}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium"
                            >
                              {app.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button
                            size="sm"
                            className="w-full gap-2 group-hover:scale-105 transition-transform font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Launch App
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {webApps.filter(
                (app) =>
                  app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  app.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  app.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              ).length === 0 && (
                <div className="text-center py-12">
                  <ExternalLink className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No apps found</h3>
                  <p className="text-muted-foreground">
                    Try searching for a different application or category.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "tools" && <Tools />}

          {activeTab === "settings" && (
            <Settings settings={settings} setSettings={setSettings} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <NebulaLogo className="w-6 h-6" />
              <span className="text-lg font-bold text-primary">Nebula</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Privacy First • No Logs • Lightning Fast
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
