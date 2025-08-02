import { useState } from "react";
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
  Link,
  Code,
  Image,
  Key,
  Monitor,
  MapPin,
  QrCode,
  FileText,
} from "lucide-react";

const toolsList = [
  {
    name: "URL Shortener",
    icon: Link,
    description: "Create short URLs and QR codes for any website",
    category: "Web",
  },
  {
    name: "HTML/CSS Formatter",
    icon: Code,
    description: "Format and minify HTML, CSS, and JavaScript code",
    category: "Development",
  },
  {
    name: "Image to Base64",
    icon: Image,
    description: "Convert images to Base64 for embedding",
    category: "Utility",
  },
  {
    name: "Password Generator",
    icon: Key,
    description: "Generate secure passwords with custom options",
    category: "Security",
  },
  {
    name: "User Agent Info",
    icon: Monitor,
    description: "View your browser and system information",
    category: "Info",
  },
  {
    name: "IP Geolocation",
    icon: MapPin,
    description: "Check IP address location and network info",
    category: "Network",
  },
  {
    name: "QR Code Tools",
    icon: QrCode,
    description: "Generate and decode QR codes",
    category: "Utility",
  },
  {
    name: "Text Tools",
    icon: FileText,
    description: "Text encoding, decoding, and manipulation",
    category: "Text",
  },
];

interface ToolsProps {}

export default function Tools({}: ToolsProps) {
  const [urlInput, setUrlInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [passwordOptions, setPasswordOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [ipInput, setIpInput] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState("");
  const [selectedTool, setSelectedTool] = useState("urlshortener");

  const generatePassword = () => {
    const chars = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let charset = "";
    if (passwordOptions.lowercase) charset += chars.lowercase;
    if (passwordOptions.uppercase) charset += chars.uppercase;
    if (passwordOptions.numbers) charset += chars.numbers;
    if (passwordOptions.symbols) charset += chars.symbols;

    if (!charset) {
      setResult("Error: Please select at least one character type");
      return;
    }

    let password = "";
    for (let i = 0; i < passwordOptions.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setResult(`Generated Password: ${password}`);
  };

  const getUserAgentInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const cookieEnabled = navigator.cookieEnabled;
    const onLine = navigator.onLine;
    
    const info = `
Browser: ${userAgent}
Platform: ${platform}
Language: ${language}
Screen: ${window.screen.width}x${window.screen.height}
Viewport: ${window.innerWidth}x${window.innerHeight}
Cookies Enabled: ${cookieEnabled}
Online: ${onLine}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
    `.trim();
    
    setResult(info);
  };

  const checkIpLocation = async () => {
    try {
      const ip = ipInput || ""; // Use current IP if none specified
      const response = await fetch(ip ? `https://ipapi.co/${ip}/json/` : `https://ipapi.co/json/`);
      const data = await response.json();
      
      if (data.error) {
        setResult(`Error: ${data.reason}`);
        return;
      }
      
      const info = `
IP Address: ${data.ip}
Location: ${data.city}, ${data.region}, ${data.country_name}
ISP: ${data.org}
Timezone: ${data.timezone}
Postal Code: ${data.postal}
Coordinates: ${data.latitude}, ${data.longitude}
      `.trim();
      
      setResult(info);
    } catch (error) {
      setResult("Error: Unable to fetch IP information");
    }
  };

  const handleImageToBase64 = (file: File) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setResult(`Base64 Data URL:\n${base64}`);
    };
    reader.readAsDataURL(file);
  };

  const formatCode = (type: string) => {
    try {
      let formatted = "";
      
      switch (type) {
        case "json":
          formatted = JSON.stringify(JSON.parse(codeInput), null, 2);
          break;
        case "minify":
          formatted = codeInput.replace(/\s+/g, " ").trim();
          break;
        case "html":
          // Basic HTML formatting
          formatted = codeInput
            .replace(/></g, ">\n<")
            .replace(/^\s*\n/gm, "");
          break;
        default:
          formatted = codeInput;
      }
      
      setResult(formatted);
    } catch (error) {
      setResult("Error: Invalid format or syntax");
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
          {selectedTool === "urlshortener" && (
            <div className="space-y-4">
              <Input
                type="url"
                placeholder="Enter URL to shorten"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    if (urlInput) {
                      // Using tinyurl service
                      const shortUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlInput)}`;
                      fetch(shortUrl)
                        .then(response => response.text())
                        .then(data => setResult(`Short URL: ${data}`))
                        .catch(() => setResult("Error: Unable to shorten URL"));
                    }
                  }}
                  variant="outline"
                >
                  Shorten URL
                </Button>
                <Button
                  onClick={() => {
                    if (urlInput) {
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(urlInput)}`;
                      setResult(`QR Code: ${qrUrl}`);
                    }
                  }}
                  variant="outline"
                >
                  Generate QR
                </Button>
              </div>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  {result.includes("QR Code:") ? (
                    <div className="text-center">
                      <img src={result.split("QR Code: ")[1]} alt="QR Code" className="mx-auto mb-2" />
                      <p className="text-sm">QR Code for: {urlInput}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-mono break-all">{result}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedTool === "htmlcssformatter" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your HTML, CSS, or JavaScript code here"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="min-h-[150px] font-mono"
              />
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => formatCode("json")}
                  variant="outline"
                >
                  Format JSON
                </Button>
                <Button
                  onClick={() => formatCode("html")}
                  variant="outline"
                >
                  Format HTML
                </Button>
                <Button
                  onClick={() => formatCode("minify")}
                  variant="outline"
                >
                  Minify
                </Button>
              </div>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-all overflow-auto max-h-60">
                    {result}
                  </pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "imagetobase64" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      handleImageToBase64(file);
                    }
                  }}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Select an image file to convert to Base64
                </p>
              </div>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Base64 Output:</p>
                  <textarea
                    value={result}
                    readOnly
                    className="w-full h-32 text-xs font-mono bg-background border rounded p-2"
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="mt-2"
                    size="sm"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedTool === "passwordgenerator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Length: {passwordOptions.length}</label>
                  <input
                    type="range"
                    min="4"
                    max="50"
                    value={passwordOptions.length}
                    onChange={(e) => setPasswordOptions({...passwordOptions, length: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'uppercase', label: 'Uppercase (A-Z)' },
                    { key: 'lowercase', label: 'Lowercase (a-z)' },
                    { key: 'numbers', label: 'Numbers (0-9)' },
                    { key: 'symbols', label: 'Symbols (!@#$...)' },
                  ].map(option => (
                    <label key={option.key} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={passwordOptions[option.key as keyof typeof passwordOptions] as boolean}
                        onChange={(e) => setPasswordOptions({
                          ...passwordOptions,
                          [option.key]: e.target.checked
                        })}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={generatePassword} className="w-full">
                Generate Password
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-lg font-mono break-all">{result}</p>
                  <Button
                    onClick={() => navigator.clipboard.writeText(result.split(": ")[1])}
                    className="mt-2"
                    size="sm"
                  >
                    Copy Password
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedTool === "useragentinfo" && (
            <div className="space-y-4">
              <Button onClick={getUserAgentInfo} className="w-full">
                Get Browser Information
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "ipgeolocation" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter IP address (leave empty for your current IP)"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
              />
              <Button onClick={checkIpLocation} className="w-full">
                Check IP Location
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          )}

          {selectedTool === "qrcodetools" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter text or URL for QR code"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    if (qrInput) {
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrInput)}`;
                      setResult(qrUrl);
                    }
                  }}
                  variant="outline"
                >
                  Generate QR Code
                </Button>
                <Button
                  onClick={() => {
                    // QR code scanner would require camera access
                    setResult("QR Scanner: Use your device's camera to scan QR codes");
                  }}
                  variant="outline"
                >
                  QR Scanner Info
                </Button>
              </div>
              {result && (
                <div className="p-4 bg-muted rounded-lg text-center">
                  {result.startsWith("https://") ? (
                    <img src={result} alt="QR Code" className="mx-auto" />
                  ) : (
                    <p className="text-sm">{result}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedTool === "texttools" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter text to encode/decode"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    if (textInput) {
                      const encoded = btoa(textInput);
                      setResult(`Base64 Encoded: ${encoded}`);
                    }
                  }}
                  variant="outline"
                >
                  Base64 Encode
                </Button>
                <Button
                  onClick={() => {
                    try {
                      const decoded = atob(textInput);
                      setResult(`Base64 Decoded: ${decoded}`);
                    } catch {
                      setResult("Error: Invalid Base64");
                    }
                  }}
                  variant="outline"
                >
                  Base64 Decode
                </Button>
                <Button
                  onClick={() => {
                    const encoded = encodeURIComponent(textInput);
                    setResult(`URL Encoded: ${encoded}`);
                  }}
                  variant="outline"
                >
                  URL Encode
                </Button>
                <Button
                  onClick={() => {
                    try {
                      const decoded = decodeURIComponent(textInput);
                      setResult(`URL Decoded: ${decoded}`);
                    } catch {
                      setResult("Error: Invalid URL encoding");
                    }
                  }}
                  variant="outline"
                >
                  URL Decode
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    const wordCount = textInput.trim().split(/\s+/).length;
                    const charCount = textInput.length;
                    setResult(`Words: ${wordCount}, Characters: ${charCount}`);
                  }}
                  variant="outline"
                >
                  Word Count
                </Button>
                <Button
                  onClick={() => {
                    const reversed = textInput.split('').reverse().join('');
                    setResult(`Reversed: ${reversed}`);
                  }}
                  variant="outline"
                >
                  Reverse Text
                </Button>
              </div>
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono break-all">{result}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
