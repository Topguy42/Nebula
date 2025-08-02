import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Gamepad2, Shield, Zap, Star, Play, ExternalLink, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  }
];

const quickLinks = [
  { name: "YouTube", url: "https://youtube.com", icon: "🎥" },
  { name: "Reddit", url: "https://reddit.com", icon: "🔴" },
  { name: "Discord", url: "https://discord.com", icon: "💬" },
  { name: "Wikipedia", url: "https://wikipedia.org", icon: "📚" },
  { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
  { name: "GitHub", url: "https://github.com", icon: "⚡" }
];

export default function Index() {
  const [proxyUrl, setProxyUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Interstellar
                </h1>
                <p className="text-xs text-muted-foreground">Web Proxy & Games</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Fast
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Browse Anywhere, Play Anything
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access blocked websites and enjoy your favorite games with our secure, fast proxy service.
          </p>
        </div>

        {/* Proxy Input */}
        <Card className="max-w-2xl mx-auto mb-12 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Web Proxy
            </CardTitle>
            <CardDescription>
              Enter any website URL to access it through our secure proxy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProxySubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter website URL (e.g., youtube.com)"
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                className="flex-1 bg-background/50"
              />
              <Button type="submit" size="default" className="px-6">
                <ExternalLink className="h-4 w-4 mr-2" />
                Go
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                onClick={() => handleQuickLink(link.url)}
                className="h-16 flex-col gap-2 bg-card/30 hover:bg-card/50 border-border/50"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-xs">{link.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Games Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Featured Games</h3>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-background/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <Card key={game.name} className="group hover:scale-[1.02] transition-all duration-200 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{game.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {game.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {game.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{game.rating}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleGamePlay(game.url)}
                      className="gap-2 group-hover:scale-105 transition-transform"
                    >
                      <Play className="h-3 w-3" />
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Interstellar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure web proxy and gaming platform. Browse freely, play safely.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>Privacy First</span>
              <span>•</span>
              <span>No Logs</span>
              <span>•</span>
              <span>Fast & Secure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
