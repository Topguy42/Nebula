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
  Link2,
  BookOpen,
  Timer,
  Activity,
  Search,
  Shield,
} from "lucide-react";

const toolsList = [
  {
    name: "Site Checker",
    icon: Globe,
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
    name: "URL Tools",
    icon: Link2,
    description: "Encode/decode URLs and manipulate web addresses",
    category: "Utility",
  },
  {
    name: "Study Timer",
    icon: Timer,
    description: "Pomodoro timer and focus sessions",
    category: "Productivity",
  },
  {
    name: "Network Tester",
    icon: Activity,
    description: "Test connectivity and network performance",
    category: "Network",
  },
  {
    name: "Mirror Finder",
    icon: Search,
    description: "Find alternative URLs and mirror sites",
    category: "Access",
  },
  {
    name: "Study Notes",
    icon: BookOpen,
    description: "Offline note-taking and study guides",
    category: "Education",
  },
  {
    name: "Privacy Check",
    icon: Shield,
    description: "Check your connection privacy and security",
    category: "Security",
  },
];

interface ToolsProps {}

export default function Tools({}: ToolsProps) {
  const [websiteInput, setWebsiteInput] = useState("");
  const [dnsServer, setDnsServer] = useState("8.8.8.8");
  const [urlToolsInput, setUrlToolsInput] = useState("");
  const [studyTime, setStudyTime] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [networkTestUrl, setNetworkTestUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [studyNotes, setStudyNotes] = useState("");
  const [result, setResult] = useState("");
  const [selectedTool, setSelectedTool] = useState("sitechecker");
  const [timeLeft, setTimeLeft] = useState(studyTime * 60);

  // Clear result when switching tools
  useEffect(() => {
    setResult("");
  }, [selectedTool]);

  const checkWebsiteAccess = async () => {
    if (!websiteInput) return;
    
    setResult("Checking website accessibility...");
    
    try {
      // Try to fetch the website
      const url = websiteInput.startsWith('http') ? websiteInput : `https://${websiteInput}`;
      const response = await fetch(`/api/proxy-check?url=${encodeURIComponent(url)}`);
      
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

  const processUrlTools = (action: string) => {
    if (!urlToolsInput) return;

    try {
      let output = "";

      switch (action) {
        case "encode":
          output = `URL Encoded: ${encodeURIComponent(urlToolsInput)}`;
          break;
        case "decode":
          output = `URL Decoded: ${decodeURIComponent(urlToolsInput)}`;
          break;
        case "base64encode":
          output = `Base64 Encoded: ${btoa(urlToolsInput)}`;
          break;
        case "base64decode":
          output = `Base64 Decoded: ${atob(urlToolsInput)}`;
          break;
        case "analyze":
          try {
            const url = new URL(urlToolsInput.startsWith('http') ? urlToolsInput : `https://${urlToolsInput}`);
            output = `🔍 URL Analysis:
Protocol: ${url.protocol}
Host: ${url.hostname}
Port: ${url.port || 'default'}
Path: ${url.pathname}
Query: ${url.search}
Fragment: ${url.hash}

🔗 Alternative formats:
• Without www: ${url.hostname.replace('www.', '')}
• Mobile version: m.${url.hostname.replace('www.', '')}
• HTTPS: https://${url.hostname}${url.pathname}`;
          } catch {
            output = "Error: Invalid URL format";
          }
          break;
        default:
          output = "Unknown action";
      }

      setResult(output);
    } catch (error) {
      setResult(`Error: Invalid input for ${action}`);
    }
  };

  const startStudyTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
      return;
    }

    setTimeLeft(studyTime * 60);
    setTimerRunning(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  const testNetworkConnectivity = async () => {
    const testUrl = networkTestUrl || "google.com";
    setResult("🔍 Testing network connectivity...");

    let results = "🌐 Network Connectivity Information:\n\n";

    // Basic connectivity check
    results += `📡 Browser Status:
• Online Status: ${navigator.onLine ? '✅ Online' : '❌ Offline'}
• User Agent: ${navigator.userAgent.split(' ')[0]}...
• Language: ${navigator.language}
• Platform: ${navigator.platform}\n\n`;

    // Connection API info (if available)
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      results += `📊 Connection Details:
• Type: ${connection.effectiveType || 'Unknown'}
• Speed: ${connection.downlink ? `${connection.downlink} Mbps` : 'Unknown'}
• RTT: ${connection.rtt ? `${connection.rtt}ms` : 'Unknown'}
• Save Data: ${connection.saveData ? 'Enabled' : 'Disabled'}\n\n`;
    }

    // DNS suggestions for the target URL
    if (testUrl && testUrl !== "google.com") {
      results += `🔍 Testing suggestions for "${testUrl}":
• Try HTTPS: https://${testUrl}
• Try HTTP: http://${testUrl}
• Try www: https://www.${testUrl}
• Try mobile: https://m.${testUrl}
• Try subdomain: Check if site has mobile/m/touch subdomain\n\n`;
    }

    // DNS server recommendations
    results += `🌐 DNS Server Options:
• Current: Usually your ISP's DNS
• Cloudflare: 1.1.1.1 (Fast, Privacy-focused)
• Google: 8.8.8.8 (Reliable, Fast)
• Quad9: 9.9.9.9 (Security-focused)
• OpenDNS: 208.67.222.222 (Family-safe)\n\n`;

    // Practical testing tips
    results += `🔧 Manual Testing Tips:
• Open DevTools (F12) → Network tab
• Try opening target site in new tab
• Check browser console for errors
• Test with/without VPN if available
• Try different browsers
• Clear DNS cache: ipconfig /flushdns (Windows)

⚠️ Note: Browser security prevents direct DNS testing
Use these manual methods for accurate results`;

    setResult(results);
  };

  const findMirrors = () => {
    if (!searchQuery) return;
    
    setResult(`🔍 Finding alternatives for: "${searchQuery}"

🪞 Mirror Site Methods:
• Add 'mirror' to search: "${searchQuery} mirror site"
• Try different TLDs: .org, .net, .info, .me
• Use proxy sites (be careful!)
• Check if site has official mirrors

🔗 Alternative access methods:
• Google Cache: cache:${searchQuery}
• Archive.org: web.archive.org
• Google Translate proxy
• Bing translator proxy

📚 Educational alternatives:
• Wikipedia for general info
• Khan Academy for learning
• MIT OpenCourseWare 
• Coursera/edX for courses
• Library databases

🛡️ Safety tips:
• Verify official mirror sites
• Avoid suspicious redirects
• Use school-approved resources first
• Check with teachers for alternatives`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkPrivacy = async () => {
    try {
      // Get IP info
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();

      const connectionInfo = `🌐 Your Connection Information:

📍 Location & Network:
• IP Address: ${ipData.ip || 'Unable to detect'}
• Location: ${ipData.city || 'Unknown'}, ${ipData.region || 'Unknown'}, ${ipData.country_name || 'Unknown'}
• ISP/Organization: ${ipData.org || 'Unknown'}
• Network Type: ${ipData.network || 'Unknown'}
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
• Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}
• JavaScript Enabled: Yes (obviously)
• Local Storage: ${typeof(Storage) !== "undefined" ? 'Available' : 'Not Available'}
• Online Status: ${navigator.onLine ? 'Online' : 'Offline'}
• Do Not Track: ${navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled'}

⏰ Time Information:
• Local Time: ${new Date().toLocaleString()}
• UTC Time: ${new Date().toUTCString()}
• Timezone Offset: UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`;

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
• Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}
• JavaScript Enabled: Yes
• Local Storage: ${typeof(Storage) !== "undefined" ? 'Available' : 'Not Available'}
• Online Status: ${navigator.onLine ? 'Online' : 'Offline'}
• Do Not Track: ${navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled'}

⏰ Time Information:
• Local Time: ${new Date().toLocaleString()}
• UTC Time: ${new Date().toUTCString()}
• Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
• Timezone Offset: UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}

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
                <label className="text-sm font-medium mb-2 block">DNS Server:</label>
                <select 
                  value={dnsServer}
                  onChange={(e) => setDnsServer(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="8.8.8.8">Google DNS (8.8.8.8)</option>
                  <option value="1.1.1.1">Cloudflare DNS (1.1.1.1)</option>
                  <option value="208.67.222.222">OpenDNS (208.67.222.222)</option>
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

          {selectedTool === "urltools" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter URL or text to process"
                value={urlToolsInput}
                onChange={(e) => setUrlToolsInput(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => processUrlTools("encode")}
                  variant="outline"
                >
                  URL Encode
                </Button>
                <Button
                  onClick={() => processUrlTools("decode")}
                  variant="outline"
                >
                  URL Decode
                </Button>
                <Button
                  onClick={() => processUrlTools("base64encode")}
                  variant="outline"
                >
                  Base64 Encode
                </Button>
                <Button
                  onClick={() => processUrlTools("base64decode")}
                  variant="outline"
                >
                  Base64 Decode
                </Button>
              </div>
              <Button
                onClick={() => processUrlTools("analyze")}
                className="w-full"
              >
                Analyze URL
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
                <label className="text-sm font-medium mb-2 block">Study Time (minutes):</label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={studyTime}
                  onChange={(e) => setStudyTime(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-center text-sm text-muted-foreground">{studyTime} minutes</p>
              </div>
              
              {timerRunning && (
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <div className="text-4xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Focus time remaining</p>
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

          {selectedTool === "networktester" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter website to test (e.g., google.com) or leave empty"
                value={networkTestUrl}
                onChange={(e) => setNetworkTestUrl(e.target.value)}
              />
              <Button onClick={testNetworkConnectivity} className="w-full">
                Test Network Connectivity
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "mirrorfinder" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter website or content to find alternatives"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={findMirrors} className="w-full">
                Find Alternative Access
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "studynotes" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Type your study notes here. They'll be saved locally in your browser."
                value={studyNotes}
                onChange={(e) => {
                  setStudyNotes(e.target.value);
                  localStorage.setItem('study-notes', e.target.value);
                }}
                className="min-h-[200px]"
                onFocus={() => {
                  const saved = localStorage.getItem('study-notes');
                  if (saved) setStudyNotes(saved);
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    const blob = new Blob([studyNotes], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'study-notes.txt';
                    a.click();
                  }}
                  variant="outline"
                >
                  Download Notes
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem('study-notes');
                    setStudyNotes('');
                    setResult('Notes cleared!');
                  }}
                  variant="outline"
                >
                  Clear Notes
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                💡 Tip: Your notes are saved locally in your browser. Download them to keep permanently!
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
