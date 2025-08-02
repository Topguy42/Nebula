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
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  Wifi,
  Zap,
  BookOpen,
  Timer,
  Eye,
  ExternalLink,
  Shield,
} from "lucide-react";

const toolsList = [
  {
    name: "Site Checker",
    icon: ExternalLink,
    description: "Check if websites are accessible and find alternatives",
    category: "Access",
  },
  {
    name: "DNS Tools",
    icon: Wifi,
    description: "Test different DNS servers and connectivity",
    category: "Network",
  },
  {
    name: "Proxy Finder",
    icon: Globe,
    description: "Find working proxy servers and bypass methods",
    category: "Bypass",
  },
  {
    name: "Study Timer",
    icon: Timer,
    description: "Pomodoro timer and focus sessions",
    category: "Productivity",
  },
  {
    name: "Filter Bypass",
    icon: Zap,
    description: "Methods to bypass content filters and restrictions",
    category: "Bypass",
  },
  {
    name: "Referrer Control",
    icon: BookOpen,
    description: "Manipulate referrer headers to bypass restrictions",
    category: "Bypass",
  },
  {
    name: "Cloaker",
    icon: Shield,
    description: "Change website title and favicon for privacy",
    category: "Privacy",
  },
  {
    name: "Privacy Check",
    icon: Eye,
    description: "Check your connection privacy and security",
    category: "Security",
  },
];

interface ToolsProps {}

export default function Tools({}: ToolsProps) {
  const [websiteInput, setWebsiteInput] = useState("");
  const [dnsServer, setDnsServer] = useState("8.8.8.8");
  const [proxyRegion, setProxyRegion] = useState("global");
  const [studyTime, setStudyTime] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [filterType, setFilterType] = useState("keyword");
  const [targetUrl, setTargetUrl] = useState("");
  const [result, setResult] = useState("");
  const [selectedTool, setSelectedTool] = useState("sitechecker");
  const [timeLeft, setTimeLeft] = useState(studyTime * 60);
  const [referrerRotation, setReferrerRotation] = useState(false);
  const [cloakerTitle, setCloakerTitle] = useState("");
  const [cloakerFavicon, setCloakerFavicon] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalFavicon, setOriginalFavicon] = useState("");

  // Initialize referrer rotation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('proxy-referrer-rotation') === 'true';
    setReferrerRotation(saved);
  }, []);

  // Clear result when switching tools
  useEffect(() => {
    setResult("");
  }, [selectedTool]);

  // Initialize original title and favicon
  useEffect(() => {
    setOriginalTitle(document.title);
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      setOriginalFavicon(favicon.href);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any simulation elements
      const iframe = document.getElementById('referrer-simulation-frame');
      if (iframe) {
        iframe.remove();
      }
      // Restore original title and favicon
      if (originalTitle) {
        document.title = originalTitle;
      }
      if (originalFavicon) {
        updateFavicon(originalFavicon);
      }
    };
  }, [originalTitle, originalFavicon]);

  const updateFavicon = (url: string) => {
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = url;
  };

  const applyCloaker = () => {
    if (!cloakerTitle && !cloakerFavicon) {
      setResult("⚠️ Please enter a title or favicon URL to apply cloaker!");
      return;
    }

    let changes = [];

    if (cloakerTitle) {
      document.title = cloakerTitle;
      changes.push(`• Title changed to: "${cloakerTitle}"`);
    }

    if (cloakerFavicon) {
      try {
        updateFavicon(cloakerFavicon);
        changes.push(`• Favicon changed to: ${cloakerFavicon}`);
      } catch (error) {
        changes.push(`• Favicon update failed: Invalid URL`);
      }
    }

    setResult(`🥸 Cloaker Applied Successfully!

${changes.join('\n')}

💡 Tips:
• Your browser tab now appears as the disguised site
• Use common websites like "Google Classroom" or "Khan Academy"
• Remember to restore when done to avoid confusion

⚠️ Note: This only changes the appearance of THIS tab.
Other tabs and windows are not affected.`);
  };

  const restoreCloaker = () => {
    if (originalTitle) {
      document.title = originalTitle;
    }
    if (originalFavicon) {
      updateFavicon(originalFavicon);
    }

    setResult(`🔄 Cloaker Restored!

• Title restored to: "${originalTitle || 'Original'}"
• Favicon restored to original

Your tab appearance has been reset to normal.`);
  };

  const checkWebsiteAccess = async () => {
    if (!websiteInput) return;

    setResult("Checking website accessibility...");

    try {
      // Try to fetch the website
      const url = websiteInput.startsWith("http")
        ? websiteInput
        : `https://${websiteInput}`;
      const response = await fetch(
        `/api/proxy-check?url=${encodeURIComponent(url)}`,
      );

      if (response.ok) {
        setResult(`✅ ${websiteInput} is accessible`);
      } else {
        setResult(`❌ ${websiteInput} may be blocked. Try these alternatives:
        
🔗 Alternative methods:
• Try HTTPS instead of HTTP
• Use Google Translate: translate.google.com/translate?u=${encodeURIComponent(websiteInput)}
• Use Archive.org: web.archive.org/web/*/${websiteInput}
• Try adding 's' to make it HTTPS
• Use different subdomain: m.${websiteInput} or www.${websiteInput}

🌐 Alternative DNS servers:
• Cloudflare: 1.1.1.1
• OpenDNS: 208.67.222.222
• Quad9: 9.9.9.9`);
      }
    } catch (error) {
      setResult(`❌ ${websiteInput} appears to be blocked or unreachable.

🔧 Try these workarounds:
• Use Google Cache: cache:${websiteInput}
• Try mobile version: m.${websiteInput}
• Use translate proxy: translate.google.com
• Check if HTTPS works: https://${websiteInput}
• Try different ports if applicable`);
    }
  };

  const testDNS = async () => {
    setResult(`Testing DNS server: ${dnsServer}

🔍 Common DNS Servers:
• Cloudflare: 1.1.1.1, 1.0.0.1 (Fast & Private)
• Google: 8.8.8.8, 8.8.4.4 (Reliable)
• OpenDNS: 208.67.222.222, 208.67.220.220 (Family Safe)
• Quad9: 9.9.9.9 (Security focused)

📝 How to change DNS on your device:
Windows: Network Settings > Adapter Options > Properties > IPv4
Mac: System Preferences > Network > Advanced > DNS
Android: WiFi Settings > Modify Network > Advanced
iOS: WiFi Settings > Configure DNS

⚠️ Note: Some schools may block DNS changes`);
  };

  const findProxyServers = () => {
    const proxies = {
      global: [
        "proxy-server.com",
        "hidester.com",
        "proxysite.com",
        "hide.me",
        "croxyproxy.com",
      ],
      us: ["us-proxy.org", "american-proxy.com", "usa-proxy.net"],
      eu: ["european-proxy.com", "eu-proxy.net", "europeproxy.org"],
    };

    const selectedProxies =
      proxies[proxyRegion as keyof typeof proxies] || proxies.global;

    setResult(`🌐 Working Proxy Servers (${proxyRegion.toUpperCase()}):

📡 Free Proxy Sites:
${selectedProxies.map((proxy) => `• https://${proxy}`).join("\n")}

🔧 Manual Proxy Setup:
• Chrome: Settings → Advanced → System → Open proxy settings
• Firefox: Settings → Network Settings → Manual proxy
• Edge: Settings → System → Open proxy settings

🌍 Alternative Access Methods:
• Google Translate: translate.google.com/translate?u=TARGET_URL
• Archive.org: web.archive.org/web/*/TARGET_URL
• Cached pages: cache:TARGET_URL in Google
• Mobile versions: m.WEBSITE.com or mobile.WEBSITE.com

🛡️ VPN Alternatives:
• Tor Browser (if allowed)
• Browser extensions (if permitted)
• Mobile hotspot with different carrier
• Change DNS to 1.1.1.1 or 8.8.8.8

`);
  };

  const startStudyTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
      return;
    }

    setTimeLeft(studyTime * 60);
    setTimerRunning(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setResult("🎉 Study session complete! Time for a break.");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getFilterBypassMethods = () => {
    const methods = {
      keyword: `🔍 Keyword Filter Bypass:
• Use synonyms or alternative spellings
• Add numbers or symbols: g4ming, soci@l
• Use different languages for same word
• Try abbreviated forms: YT for YouTube
• Use URL shorteners to hide destination
• Search in images then click through`,

      url: `🌐 URL Filter Bypass:
• Try HTTPS instead of HTTP
• Add 's' to domain: https://site.com
• Use IP address instead of domain name
• Try different subdomains: m., www., mobile.
• Use port numbers: site.com:443
• Try different TLDs: .net, .org, .io`,

      content: `📄 Content Filter Bypass:
• Use Google Translate as proxy
• View cached/archived versions
• Use text-only versions of sites
• Access mobile versions (often less filtered)
• Use RSS feeds for news content
• Try reader mode in browsers`,
    };

    const selectedMethod =
      methods[filterType as keyof typeof methods] || methods.keyword;

    setResult(`🛡️ Filter Bypass Methods:

${selectedMethod}

🔧 General Bypass Techniques:
• Change DNS servers (1.1.1.1, 8.8.8.8)
• Use different browsers
• Clear browser cache and cookies
• Disable JavaScript temporarily
• Use incognito/private browsing mode
• Try different network (mobile hotspot)

🌍 Alternative Access:
• Google Cache: cache:website.com
• Archive.org: web.archive.org
• Proxy sites: croxyproxy.com, hide.me
• Mirror sites: often domain.org when .com blocked
• API access: Some sites have open APIs

📱 Mobile Tricks:
• Use mobile apps instead of websites
• Mobile versions often less restricted
• Different app stores may have alternatives

`);
  };



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const checkPrivacy = async () => {
    try {
      // Get IP info
      const ipResponse = await fetch("https://ipapi.co/json/");
      const ipData = await ipResponse.json();

      const connectionInfo = `🌐 Your Connection Information:

📍 Location & Network:
• IP Address: ${ipData.ip || "Unable to detect"}
• Location: ${ipData.city || "Unknown"}, ${ipData.region || "Unknown"}, ${ipData.country_name || "Unknown"}
• ISP/Organization: ${ipData.org || "Unknown"}
• Network Type: ${ipData.network || "Unknown"}
• Timezone: ${ipData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}

💻 Browser & Device:
• User Agent: ${navigator.userAgent}
• Browser Language: ${navigator.language}
• Platform: ${navigator.platform}
• Screen Resolution: ${window.screen.width}x${window.screen.height}
• Viewport Size: ${window.innerWidth}x${window.innerHeight}
• Color Depth: ${window.screen.colorDepth}-bit
• Pixel Ratio: ${window.devicePixelRatio}

🔧 Browser Features:
• Cookies Enabled: ${navigator.cookieEnabled ? "Yes" : "No"}
• JavaScript Enabled: Yes (obviously)
• Local Storage: ${typeof Storage !== "undefined" ? "Available" : "Not Available"}
• Online Status: ${navigator.onLine ? "Online" : "Offline"}
• Do Not Track: ${navigator.doNotTrack === "1" ? "Enabled" : "Disabled"}

⏰ Time Information:
• Local Time: ${new Date().toLocaleString()}
• UTC Time: ${new Date().toUTCString()}
• Timezone Offset: UTC${new Date().getTimezoneOffset() > 0 ? "-" : "+"}${Math.abs(new Date().getTimezoneOffset() / 60)}`;

      setResult(connectionInfo);
    } catch (error) {
      // Fallback if IP service fails
      const basicInfo = `🌐 Your Connection Information:

💻 Browser & Device:
• User Agent: ${navigator.userAgent}
• Browser Language: ${navigator.language}
• Platform: ${navigator.platform}
• Screen Resolution: ${window.screen.width}x${window.screen.height}
• Viewport Size: ${window.innerWidth}x${window.innerHeight}
• Color Depth: ${window.screen.colorDepth}-bit
• Pixel Ratio: ${window.devicePixelRatio}

🔧 Browser Features:
• Cookies Enabled: ${navigator.cookieEnabled ? "Yes" : "No"}
• JavaScript Enabled: Yes
• Local Storage: ${typeof Storage !== "undefined" ? "Available" : "Not Available"}
• Online Status: ${navigator.onLine ? "Online" : "Offline"}
• Do Not Track: ${navigator.doNotTrack === "1" ? "Enabled" : "Disabled"}

⏰ Time Information:
• Local Time: ${new Date().toLocaleString()}
• UTC Time: ${new Date().toUTCString()}
• Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
• Timezone Offset: UTC${new Date().getTimezoneOffset() > 0 ? "-" : "+"}${Math.abs(new Date().getTimezoneOffset() / 60)}

ℹ️ Note: IP location data unavailable`;

      setResult(basicInfo);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {toolsList.map((tool) => {
          const IconComponent = tool.icon;
          const toolKey = tool.name.toLowerCase().replace(/[\s\/]/g, "");
          return (
            <Button
              key={tool.name}
              variant={selectedTool === toolKey ? "default" : "outline"}
              onClick={() => setSelectedTool(toolKey)}
              className="h-20 flex-col gap-2 text-center"
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-xs font-medium">{tool.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Tool Content */}
      <Card className="bg-card/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const tool = toolsList.find(
                (t) =>
                  t.name.toLowerCase().replace(/[\s\/]/g, "") === selectedTool,
              );
              if (tool) {
                const IconComponent = tool.icon;
                return (
                  <>
                    <IconComponent className="h-5 w-5" />
                    {tool.name}
                  </>
                );
              }
              return "Tool";
            })()}
          </CardTitle>
          <CardDescription>
            {
              toolsList.find(
                (t) =>
                  t.name.toLowerCase().replace(/[\s\/]/g, "") === selectedTool,
              )?.description
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTool === "sitechecker" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter website URL (e.g., wikipedia.org)"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
              />
              <Button onClick={checkWebsiteAccess} className="w-full">
                Check Website Access
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "dnstools" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  DNS Server:
                </label>
                <select
                  value={dnsServer}
                  onChange={(e) => setDnsServer(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="8.8.8.8">Google DNS (8.8.8.8)</option>
                  <option value="1.1.1.1">Cloudflare DNS (1.1.1.1)</option>
                  <option value="208.67.222.222">
                    OpenDNS (208.67.222.222)
                  </option>
                  <option value="9.9.9.9">Quad9 DNS (9.9.9.9)</option>
                </select>
              </div>
              <Button onClick={testDNS} className="w-full">
                Get DNS Information
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "proxyfinder" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Region:
                </label>
                <select
                  value={proxyRegion}
                  onChange={(e) => setProxyRegion(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="global">Global Proxies</option>
                  <option value="us">US Proxies</option>
                  <option value="eu">European Proxies</option>
                </select>
              </div>
              <Button onClick={findProxyServers} className="w-full">
                Find Working Proxies
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "studytimer" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Study Time (minutes):
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={studyTime}
                  onChange={(e) => setStudyTime(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-center text-sm text-muted-foreground">
                  {studyTime} minutes
                </p>
              </div>

              {timerRunning && (
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <div className="text-4xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Focus time remaining
                  </p>
                </div>
              )}

              <Button
                onClick={startStudyTimer}
                className="w-full"
                variant={timerRunning ? "destructive" : "default"}
              >
                {timerRunning ? "Stop Timer" : "Start Study Session"}
              </Button>

              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-center text-lg font-medium">{result}</p>
                </div>
              )}
            </div>
          )}

          {selectedTool === "filterbypass" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Filter Type:
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="keyword">Keyword Filters</option>
                  <option value="url">URL/Domain Blocks</option>
                  <option value="content">Content Restrictions</option>
                </select>
              </div>
              <Button onClick={getFilterBypassMethods} className="w-full">
                Get Bypass Methods
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "referrercontrol" && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Proxy Referrer Rotation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  When enabled, the proxy will automatically rotate referrer headers every 5 seconds to bypass referrer-based restrictions.
                </p>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Status: </span>
                    <span className={referrerRotation ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {referrerRotation ? "🟢 Active" : "🔴 Disabled"}
                    </span>
                  </div>

                  {referrerRotation && (
                    <div className="text-sm">
                      <span className="font-medium">Mode: </span>
                      <span className="font-mono text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">
                        Auto-Rotating
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => {
                    setReferrerRotation(!referrerRotation);
                    // Store the setting in localStorage
                    localStorage.setItem('proxy-referrer-rotation', (!referrerRotation).toString());

                    if (!referrerRotation) {
                      setResult(`🔄 Referrer rotation enabled!

When you browse through the proxy, your referrer will automatically rotate every 5 seconds through these sources:

🌍 Rotation Sources:
• Google Search
• Bing Search
• DuckDuckGo
• Yahoo Search
• Facebook
• Twitter
• Reddit
• Wikipedia
• YouTube
• GitHub
• Stack Overflow
• No referrer

💡 How it works:
• Referrer changes automatically every 5 seconds
• No manual intervention needed
• Works with all proxy browsing
• Helps bypass referrer-based blocks

🚀 Just browse normally through the proxy - the referrer rotation happens automatically in the background!`);
                    } else {
                      setResult("🔄 Referrer rotation disabled. Proxy will use standard referrer behavior.");
                    }
                  }}
                  variant={referrerRotation ? "destructive" : "default"}
                  size="lg"
                  className="w-full max-w-xs"
                >
                  {referrerRotation ? "Disable Rotation" : "Enable Rotation"}
                </Button>
              </div>

              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>💡 Tip: Enable this before browsing to automatically bypass referrer restrictions</p>
                <p>⚡ Works with all proxy browsing - no need to enter specific URLs</p>
              </div>
            </div>
          )}

          {selectedTool === "studynotes" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Type your study notes here. They'll be saved locally in your browser."
                value={studyNotes}
                onChange={(e) => {
                  setStudyNotes(e.target.value);
                  localStorage.setItem("study-notes", e.target.value);
                }}
                className="min-h-[200px]"
                onFocus={() => {
                  const saved = localStorage.getItem("study-notes");
                  if (saved) setStudyNotes(saved);
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    const blob = new Blob([studyNotes], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "study-notes.txt";
                    a.click();
                  }}
                  variant="outline"
                >
                  Download Notes
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("study-notes");
                    setStudyNotes("");
                    setResult("Notes cleared!");
                  }}
                  variant="outline"
                >
                  Clear Notes
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                💡 Tip: Your notes are saved locally in your browser. Download
                them to keep permanently!
              </div>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{result}</p>
                </div>
              )}
            </div>
          )}

          {selectedTool === "privacycheck" && (
            <div className="space-y-4">
              <Button onClick={checkPrivacy} className="w-full">
                Check Privacy & Security Info
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
