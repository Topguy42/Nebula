import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Gamepad2, Shield, Zap, Star, Play, ExternalLink, Search } from "lucide-react";

const popularGames = [
  {
    name: "2048",
    url: "https://play2048.co/",
    description: "Number puzzle game",
    category: "Puzzle",
    rating: 4.8
  },
  {
    name: "Slope",
    url: "https://slope-game.github.io/",
    description: "3D running game",
    category: "Action",
    rating: 4.7
  },
  {
    name: "Snake",
    url: "https://www.google.com/fbx?fbx=snake_arcade",
    description: "Classic snake game",
    category: "Arcade",
    rating: 4.6
  },
  {
    name: "Tetris",
    url: "https://tetris.com/play-tetris",
    description: "Block puzzle classic",
    category: "Puzzle", 
    rating: 4.9
  },
  {
    name: "Flappy Bird",
    url: "https://flappybird.io/",
    description: "Side-scrolling mobile game",
    category: "Arcade",
    rating: 4.5
  },
  {
    name: "Pac-Man",
    url: "https://www.google.com/doodles/30th-anniversary-of-pac-man",
    description: "Classic arcade game",
    category: "Arcade",
    rating: 4.8
  },
  {
    name: "Among Us",
    url: "https://skribbl.io/",
    description: "Social deduction party game",
    category: "Social",
    rating: 4.6
  },
  {
    name: "Minecraft Classic",
    url: "https://classic.minecraft.net/",
    description: "Build and explore in creative mode",
    category: "Sandbox",
    rating: 4.9
  },
  {
    name: "Cut the Rope",
    url: "https://www.cuttherope.ie/",
    description: "Physics puzzle game",
    category: "Puzzle",
    rating: 4.7
  }
];

const quickLinks = [
  { name: "YouTube", url: "https://youtube.com", icon: "🎥" },
  { name: "Reddit", url: "https://reddit.com", icon: "🔴" },
  { name: "Discord", url: "https://discord.com", icon: "💬" },
  { name: "Wikipedia", url: "https://wikipedia.org", icon: "📚" },
  { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
  { name: "GitHub", url: "https://github.com", icon: "⚡" },
  { name: "Instagram", url: "https://instagram.com", icon: "📷" },
  { name: "TikTok", url: "https://tiktok.com", icon: "🎵" }
];

export default function Index() {
  const [proxyUrl, setProxyUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"proxy" | "games">("proxy");

  const handleProxySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proxyUrl) {
      let url = proxyUrl;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      window.open(url, "_blank");
    }
  };

  const handleGamePlay = (gameUrl: string) => {
    window.open(gameUrl, "_blank");
  };

  const handleQuickLink = (url: string) => {
    window.open(url, "_blank");
  };

  const filteredGames = popularGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/20">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Nebula
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Web Proxy & Gaming Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Tabs in header */}
              <div className="flex bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("proxy")}
                  className={`flex items-center gap-2 h-8 text-sm font-medium px-3 rounded-md transition-all ${
                    activeTab === "proxy"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  Proxy
                </button>
                <button
                  onClick={() => setActiveTab("games")}
                  className={`flex items-center gap-2 h-8 text-sm font-medium px-3 rounded-md transition-all ${
                    activeTab === "games"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Gamepad2 className="h-4 w-4" />
                  Games
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border-primary/20">
                  <Shield className="h-3.5 w-3.5" />
                  Secure
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border-primary/20">
                  <Zap className="h-3.5 w-3.5" />
                  Fast
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Browse Anywhere, Play Anything
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Access blocked websites and enjoy your favorite games with our secure, lightning-fast proxy service.
          </p>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {/* Proxy Tab */}
          {activeTab === "proxy" && (
            <div className="space-y-8">
              {/* URL Input */}
              <Card className="bg-card/40 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    Secure Web Proxy
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter any website URL to access it through our encrypted proxy network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProxySubmit} className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Enter website URL (e.g., youtube.com, reddit.com)"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="flex-1 h-12 text-base bg-background/80 border-border/50 focus:border-primary"
                    />
                    <Button type="submit" size="lg" className="px-8 h-12 gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Browse
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">Quick Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      onClick={() => handleQuickLink(link.url)}
                      className="h-20 flex-col gap-3 bg-card/30 hover:bg-card/60 border-border/50 hover:border-primary/50 transition-all duration-200 hover:scale-105"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-sm font-medium">{link.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Games Tab */}
          {activeTab === "games" && (
            <div className="space-y-8">
              {/* Search Bar */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base bg-background/80 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <Card key={game.name} className="group hover:scale-[1.02] transition-all duration-300 bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{game.name}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {game.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {game.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-muted-foreground">{game.rating}</span>
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
                  <p className="text-muted-foreground">Try searching for a different game or category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Nebula</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Secure web proxy and gaming platform. Browse freely, play safely.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Privacy First
              </span>
              <span>•</span>
              <span>No Logs</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Lightning Fast
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
