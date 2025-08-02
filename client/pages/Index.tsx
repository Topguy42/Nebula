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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Tools from "@/components/Tools";
import Settings from "@/components/Settings";
import DevToolsPanel from "@/components/DevToolsPanel";
import {
  Gamepad2,
  Star,
  Play,
  ExternalLink,
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
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
  Grid3X3,
  Settings as SettingsIcon,
  Wrench,
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
  {
    name: "YouTube",
    url: "https://youtube.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a2.934 2.934 0 0 0-2.063-2.085C19.61 3.676 12 3.676 12 3.676s-7.61 0-9.435.425A2.934 2.934 0 0 0 .502 6.186C.077 8.034.077 12 .077 12s0 3.966.425 5.814a2.934 2.934 0 0 0 2.063 2.085C4.39 20.324 12 20.324 12 20.324s7.61 0 9.435-.425a2.934 2.934 0 0 0 2.063-2.085C23.923 15.966 23.923 12 23.923 12s0-3.966-.425-5.814zM9.75 15.568V8.432L15.786 12l-6.036 3.568z" />
      </svg>
    ),
    color: "text-red-500",
  },
  {
    name: "Reddit",
    url: "https://reddit.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    color: "text-orange-500",
  },
  {
    name: "Discord",
    url: "https://discord.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    color: "text-indigo-500",
  },
  {
    name: "Wikipedia",
    url: "https://wikipedia.org",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.103 0C5.533 0 0.201 5.333 0.201 11.902s5.333 11.902 11.902 11.902S24.005 18.471 24.005 11.902 18.672 0 12.103 0zm-0.194 4.021c0.12 0 0.24 0.004 0.358 0.012l1.375 7.917 2.646-7.917c0.096-0.288 0.24-0.433 0.433-0.433 0.191 0 0.335 0.145 0.433 0.433l2.646 7.917 1.374-7.917c0.12-0.008 0.239-0.012 0.359-0.012 0.358 0 0.717 0.024 1.071 0.071l-2.12 12.194c-0.096 0.551-0.432 0.827-1.008 0.827-0.575 0-0.912-0.276-1.008-0.827L15.822 8.3l-2.646 7.986c-0.096 0.551-0.432 0.827-1.008 0.827s-0.912-0.276-1.008-0.827L8.514 8.3l-2.646 7.986c-0.096 0.551-0.432 0.827-1.008 0.827-0.575 0-0.912-0.276-1.008-0.827L1.732 4.092c0.354-0.047 0.713-0.071 1.071-0.071 0.12 0 0.24 0.004 0.359 0.012L4.537 12.05 7.183 4.133C7.279 3.845 7.423 3.7 7.614 3.7c0.191 0 0.335 0.145 0.433 0.433l2.646 7.917L11.909 4.033z" />
      </svg>
    ),
    color: "text-gray-600",
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "text-blue-500",
  },
  {
    name: "GitHub",
    url: "https://github.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    color: "text-slate-500",
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "text-pink-500",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com",
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    color: "text-violet-500",
  },
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

// VortexPortal Logo Component
const VortexLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center group`}>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 opacity-90 blur-sm group-hover:blur-none transition-all duration-300" />
    <div className="relative z-10 w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl border border-white/30">
      <svg className="w-3/5 h-3/5 text-white" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 22H22L12 2Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="currentColor"
          className="animate-pulse"
        />
        <path
          d="M12 2L22 22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M12 2L2 22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
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
  const [proxyError, setProxyError] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    autoplay: false,
    privacy: true,
    volume: [75],
    quality: "high",
    aboutBlank: false,
    antiGoGuardian: false,
  });

  // Store reference to about:blank window
  const [aboutBlankWindow, setAboutBlankWindow] = useState<Window | null>(null);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // Anti-GoGuardian functionality
  useEffect(() => {
    if (settings.antiGoGuardian) {
      const preventClose = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your session will be lost.";
        return "Are you sure you want to leave? Your session will be lost.";
      };

      const preventVisibilityChange = () => {
        // Keep the page "active" to prevent monitoring software from detecting inactivity
        if (document.hidden) {
          document.dispatchEvent(new Event("visibilitychange"));
        }
      };

      const preventFocus = (e: Event) => {
        // Prevent focus loss detection
        e.preventDefault();
        window.focus();
      };

      const preventTabClose = (e: KeyboardEvent) => {
        // Prevent Ctrl+W, Ctrl+F4, Alt+F4
        if (
          (e.ctrlKey && e.key === "w") ||
          (e.ctrlKey && e.key === "F4") ||
          (e.altKey && e.key === "F4")
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Add event listeners
      window.addEventListener("beforeunload", preventClose);
      document.addEventListener("visibilitychange", preventVisibilityChange);
      window.addEventListener("blur", preventFocus);
      window.addEventListener("keydown", preventTabClose, true);

      // Prevent right-click context menu
      const preventContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      document.addEventListener("contextmenu", preventContextMenu);

      // Override window.close
      const originalClose = window.close;
      window.close = () => {
        console.log("Tab close attempt blocked by anti-GoGuardian");
        return false;
      };

      // Cleanup function
      return () => {
        window.removeEventListener("beforeunload", preventClose);
        document.removeEventListener(
          "visibilitychange",
          preventVisibilityChange,
        );
        window.removeEventListener("blur", preventFocus);
        window.removeEventListener("keydown", preventTabClose, true);
        document.removeEventListener("contextmenu", preventContextMenu);
        window.close = originalClose;
      };
    }
  }, [settings.antiGoGuardian]);

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
            <title>VortexPortal - Professional Web Proxy</title>
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
      setProxyError(null);

      // Check if about blank is enabled
      if (settings.aboutBlank) {
        if (aboutBlankWindow && !aboutBlankWindow.closed) {
          // Focus the about:blank window that contains the full Nebula app
          aboutBlankWindow.focus();
        }
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

      setProxyUrl("");
      // Set loading after setting URL to start loading immediately
      setIsLoading(true);
    }
  };

  const handleGamePlay = (gameUrl: string) => {
    setProxyError(null);

    // Check if about blank is enabled
    if (settings.aboutBlank) {
      if (aboutBlankWindow && !aboutBlankWindow.closed) {
        aboutBlankWindow.focus();
      }
      return;
    }

    setDisplayUrl(gameUrl);
    setCurrentUrl(`/api/proxy?url=${encodeURIComponent(gameUrl)}`);
    setActiveTab("proxy"); // Switch to proxy tab to show the iframe
    setIsLoading(true); // Set loading after URL change
  };

  const handleQuickLink = (url: string) => {
    setProxyError(null);

    // Check if about blank is enabled
    if (settings.aboutBlank) {
      if (aboutBlankWindow && !aboutBlankWindow.closed) {
        aboutBlankWindow.focus();
      }
      return;
    }

    setDisplayUrl(url);
    setCurrentUrl(`/api/proxy?url=${encodeURIComponent(url)}`);
    setIsLoading(true); // Set loading after URL change
  };

  const handleBackToHome = () => {
    setCurrentUrl("");
    setDisplayUrl("");
    setProxyUrl("");
    setIsLoading(false);
    setProxyError(null);
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
        <div className="backdrop-blur-glass border-b border-border/50 px-6 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="px-3"
                  title="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.forward()}
                  className="px-3"
                  title="Go forward"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const iframe = document.querySelector("iframe");
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                  className="px-3"
                  title="Refresh page"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToHome}
                  className="gap-2 ml-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <VortexLogo className="w-7 h-7" />
                <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">VortexPortal</span>
              </div>
            </div>
            <div className="flex-1 max-w-2xl mx-4">
              <div className="backdrop-blur-glass rounded-lg px-4 py-2 text-sm text-muted-foreground border border-border/50 truncate">
                {displayUrl}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDevToolsOpen(!devToolsOpen)}
              className="gap-2"
              title="Open developer tools panel"
            >
              <Code className="h-4 w-4" />
              Dev Tools
            </Button>
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
        {proxyError ? (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Proxy Error</h3>
              <p className="text-muted-foreground mb-4">{proxyError}</p>
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-[calc(100vh-73px)] border-0"
            onLoad={() => {
              setIsLoading(false);
              console.log("Iframe loaded successfully");
            }}
            onError={(e) => {
              setIsLoading(false);
              setProxyError(
                "Failed to load the requested website. It may be blocking proxy access.",
              );
              console.error("Iframe failed to load:", e);
            }}
            title="Browsing content"
            sandbox="allow-same-origin allow-scripts allow-forms allow-navigation allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-top-navigation-by-user-activation allow-downloads"
            allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; vr; xr-spatial-tracking; clipboard-read; clipboard-write"
            loading="eager"
          />
        )}

        {/* Custom Dev Tools Panel */}
        <DevToolsPanel
          isOpen={devToolsOpen}
          onClose={() => setDevToolsOpen(false)}
          iframeUrl={displayUrl}
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ultra-modern gradient orbs */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-cyan-500/25 blur-3xl animate-float"></div>
        <div
          className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-cyan-500/30 via-teal-500/20 to-emerald-500/25 blur-3xl animate-float-delayed"
        ></div>
        <div
          className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-teal-400/15 via-emerald-400/20 to-cyan-400/15 blur-2xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] rounded-full bg-gradient-to-tl from-emerald-400/20 via-teal-400/15 to-cyan-400/20 blur-2xl animate-float-delayed"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Sophisticated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.04)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(20,184,166,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        {/* Modern geometric elements */}
        <div className="absolute top-1/4 left-1/6 w-1 h-24 bg-gradient-to-b from-transparent via-emerald-300/25 to-transparent rotate-45"></div>
        <div className="absolute top-3/4 right-1/6 w-1 h-20 bg-gradient-to-b from-transparent via-teal-300/25 to-transparent rotate-45"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent -rotate-45"></div>
        <div className="absolute top-1/6 right-1/3 w-1 h-18 bg-gradient-to-b from-transparent via-emerald-300/20 to-transparent rotate-12"></div>

        {/* Refined floating particles */}
        <div
          className="absolute top-20 left-10 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-teal-400/60 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/5 w-2 h-2 bg-cyan-400/40 rounded-full animate-float-delayed"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-300/50 rounded-full animate-float"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-1 h-1 bg-teal-300/60 rounded-full animate-float-delayed"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/6 w-1.5 h-1.5 bg-cyan-300/45 rounded-full animate-float"
          style={{ animationDelay: "5s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-sm bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <VortexLogo className="w-10 h-10" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  VortexPortal
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">
                  Professional Web Proxy
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center bg-muted/40 rounded-full p-1 backdrop-blur-sm border border-border/50">
              <button
                onClick={() => setActiveTab("proxy")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  activeTab === "proxy"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Proxy</span>
              </button>
              <button
                onClick={() => setActiveTab("games")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  activeTab === "games"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                <span className="hidden md:inline">Games</span>
              </button>
              <button
                onClick={() => setActiveTab("apps")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  activeTab === "apps"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden md:inline">Apps</span>
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  activeTab === "tools"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span className="hidden md:inline">Tools</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </button>
            </nav>

            {/* Theme Toggle */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          {/* Hero Section */}
          <div className="mb-20">
            <div className="space-y-8">
              {/* Main Title */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-none">
                  VortexPortal
                </h1>
                <div className="space-y-4">
                  <p className="text-2xl md:text-3xl font-semibold text-foreground/90 leading-tight">
                    Professional Web Proxy Solution
                  </p>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Experience secure, lightning-fast web browsing with enterprise-grade proxy technology.
                    Access any website, stream content, and run applications with uncompromising privacy and performance.
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-medium">Zero-Log Policy</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="font-medium">Global Network</span>
                </div>
              </div>
            </div>

            {/* Main Search/Input */}
            <div className="max-w-4xl mx-auto">
              {activeTab === "proxy" ? (
                <form onSubmit={handleProxySubmit}>
                  <div className="relative group">
                    <Input
                      type="text"
                      placeholder="Enter website URL or search query..."
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="h-16 text-lg backdrop-blur-sm bg-background/60 border-2 border-border/50 focus:border-primary/80 rounded-2xl px-6 pr-20 transition-all duration-300 hover:shadow-xl hover:bg-background/80 group-hover:border-primary/40 placeholder:text-muted-foreground/60"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="absolute right-2 top-2 h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              ) : activeTab === "games" ? (
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search games by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-16 text-lg backdrop-blur-sm bg-background/60 border-2 border-border/50 focus:border-primary/80 rounded-2xl pl-14 pr-6 transition-all duration-300 hover:shadow-xl hover:bg-background/80 group-hover:border-primary/40 placeholder:text-muted-foreground/60"
                  />
                </div>
              ) : activeTab === "apps" ? (
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search web applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-16 text-lg backdrop-blur-sm bg-background/60 border-2 border-border/50 focus:border-primary/80 rounded-2xl pl-14 pr-6 transition-all duration-300 hover:shadow-xl hover:bg-background/80 group-hover:border-primary/40 placeholder:text-muted-foreground/60"
                  />
                </div>
              ) : activeTab === "tools" ? (
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">Professional Tools</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Access advanced utilities and developer tools for enhanced productivity
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    Settings & Configuration
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Customize your VortexPortal experience with advanced settings and preferences
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "proxy" && (
            <div className="max-w-7xl mx-auto space-y-16">
              <div>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-3">Quick Access</h3>
                  <p className="text-muted-foreground">Jump to your favorite websites instantly</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                  {quickLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <div
                        key={link.name}
                        onClick={() => handleQuickLink(link.url)}
                        className="group cursor-pointer"
                      >
                        <div className="relative p-6 rounded-2xl backdrop-blur-sm bg-background/60 border border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-background/80">
                          {/* Icon */}
                          <div className="flex justify-center mb-4">
                            <div className={`${link.color} group-hover:scale-110 transition-transform duration-300 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 shadow-lg border border-emerald-200/50 dark:border-emerald-800/50`}>
                              <IconComponent />
                            </div>
                          </div>
                          {/* Label */}
                          <div className="text-center">
                            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              {link.name}
                            </span>
                          </div>
                          {/* Hover effect */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGames.map((game) => (
                  <Card
                    key={game.name}
                    className="group hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm bg-background/60 border-2 border-border/50 hover:border-primary/40 hover:shadow-2xl rounded-2xl overflow-hidden"
                  >
                    <CardHeader className="pb-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{game.name}</CardTitle>
                          <CardDescription className="text-base text-muted-foreground leading-relaxed">
                            {game.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                        >
                          {game.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-foreground">
                              {game.rating}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">rating</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleGamePlay(game.url)}
                          className="gap-2 group-hover:scale-105 transition-all font-semibold shadow-lg hover:shadow-xl px-6"
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
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        className="group hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm bg-background/60 border-2 border-border/50 hover:border-primary/40 hover:shadow-2xl cursor-pointer rounded-2xl overflow-hidden"
                        onClick={() => handleQuickLink(app.url)}
                      >
                        <CardHeader className="pb-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                <IconComponent className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div className="space-y-2">
                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                  {app.name}
                                </CardTitle>
                                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                                  {app.description}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-xs font-semibold px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20 shrink-0"
                            >
                              {app.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button
                            size="sm"
                            className="w-full gap-2 group-hover:scale-105 transition-all font-semibold shadow-lg hover:shadow-xl"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Launch Application
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
      <footer className="relative z-10 mt-32 border-t border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <VortexLogo className="w-8 h-8" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">VortexPortal</span>
                <p className="text-xs text-muted-foreground font-medium">Professional Web Proxy</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Enterprise-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Zero-Log Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Lightning Fast Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span>Global Network</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border/40">
              <p className="text-xs text-muted-foreground/80">
                © 2024 VortexPortal. Built for professionals who demand reliability and security.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
