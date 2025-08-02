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
  Calculator,
  Hash,
  FileText,
  QrCode,
  Palette,
  Clock,
} from "lucide-react";

const toolsList = [
  {
    name: "Calculator",
    icon: Calculator,
    description: "Basic arithmetic operations",
    category: "Math",
  },
  {
    name: "Hash Generator",
    icon: Hash,
    description: "Generate MD5, SHA1, SHA256 hashes",
    category: "Security",
  },
  {
    name: "Text Encoder/Decoder",
    icon: FileText,
    description: "Base64, URL encoding/decoding",
    category: "Text",
  },
  {
    name: "QR Code Generator",
    icon: QrCode,
    description: "Generate QR codes for text or URLs",
    category: "Utility",
  },
  {
    name: "Color Picker",
    icon: Palette,
    description: "Pick and convert colors between formats",
    category: "Design",
  },
  {
    name: "Timestamp Converter",
    icon: Clock,
    description: "Convert between timestamps and dates",
    category: "Time",
  },
];

interface ToolsProps {}

export default function Tools({}: ToolsProps) {
  const [calculatorInput, setCalculatorInput] = useState("");
  const [calculatorResult, setCalculatorResult] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [textEncodeInput, setTextEncodeInput] = useState("");
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [colorValue, setColorValue] = useState("#3b82f6");
  const [timestampInput, setTimestampInput] = useState("");
  const [selectedTool, setSelectedTool] = useState("calculator");

  const calculateResult = (expression: string) => {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, "");
      if (!sanitized) return "Error: Empty expression";
      const result = Function('"use strict"; return (' + sanitized + ")")();
      return isNaN(result) ? "Error: Invalid calculation" : result.toString();
    } catch {
      return "Error: Invalid expression";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
          {selectedTool === "calculator" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter calculation (e.g., 2 + 3 * 4)"
                value={calculatorInput}
                onChange={(e) => setCalculatorInput(e.target.value)}
                className="text-lg"
              />
              <Button
                onClick={() =>
                  setCalculatorResult(calculateResult(calculatorInput))
                }
                className="w-full"
              >
                Calculate
              </Button>
              {calculatorResult && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-lg font-mono">{calculatorResult}</p>
                </div>
              )}
            </div>
          )}

          {selectedTool === "hashgenerator" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter text to hash"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="grid gap-2">
                <Button
                  onClick={async () => {
                    if (hashInput) {
                      const encoder = new TextEncoder();
                      const data = encoder.encode(hashInput);
                      const hashBuffer = await crypto.subtle.digest(
                        "SHA-256",
                        data,
                      );
                      const hashArray = Array.from(new Uint8Array(hashBuffer));
                      const hashHex = hashArray
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                      setCalculatorResult(`SHA-256: ${hashHex}`);
                    }
                  }}
                  variant="outline"
                >
                  Generate SHA-256
                </Button>
              </div>
              {calculatorResult && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono break-all">
                    {calculatorResult}
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedTool === "textencoderdecoder" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter text to encode/decode"
                value={textEncodeInput}
                onChange={(e) => setTextEncodeInput(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    if (textEncodeInput) {
                      const encoded = btoa(textEncodeInput);
                      setCalculatorResult(`Base64 Encoded: ${encoded}`);
                    }
                  }}
                  variant="outline"
                >
                  Base64 Encode
                </Button>
                <Button
                  onClick={() => {
                    try {
                      const decoded = atob(textEncodeInput);
                      setCalculatorResult(`Base64 Decoded: ${decoded}`);
                    } catch {
                      setCalculatorResult("Error: Invalid Base64");
                    }
                  }}
                  variant="outline"
                >
                  Base64 Decode
                </Button>
                <Button
                  onClick={() => {
                    const encoded = encodeURIComponent(textEncodeInput);
                    setCalculatorResult(`URL Encoded: ${encoded}`);
                  }}
                  variant="outline"
                >
                  URL Encode
                </Button>
                <Button
                  onClick={() => {
                    try {
                      const decoded = decodeURIComponent(textEncodeInput);
                      setCalculatorResult(`URL Decoded: ${decoded}`);
                    } catch {
                      setCalculatorResult("Error: Invalid URL encoding");
                    }
                  }}
                  variant="outline"
                >
                  URL Decode
                </Button>
              </div>
              {calculatorResult && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono break-all">
                    {calculatorResult}
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedTool === "qrcodegenerator" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter text or URL for QR code"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (qrCodeInput) {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeInput)}`;
                    setCalculatorResult(qrUrl);
                  }
                }}
                className="w-full"
              >
                Generate QR Code
              </Button>
              {calculatorResult && calculatorResult.startsWith("https://") && (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <img
                    src={calculatorResult}
                    alt="QR Code"
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          {selectedTool === "colorpicker" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border"
                  style={{ backgroundColor: colorValue }}
                ></div>
                <div className="flex-1">
                  <Input
                    type="color"
                    value={colorValue}
                    onChange={(e) => setColorValue(e.target.value)}
                    className="w-full h-12"
                  />
                </div>
              </div>
              <Input
                type="text"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                placeholder="#3b82f6"
              />
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium mb-1">HEX</p>
                  <p className="font-mono">{colorValue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">RGB</p>
                  <p className="font-mono">
                    {(() => {
                      const hex = colorValue.replace("#", "");
                      const r = parseInt(hex.substr(0, 2), 16);
                      const g = parseInt(hex.substr(2, 2), 16);
                      const b = parseInt(hex.substr(4, 2), 16);
                      return `${r}, ${g}, ${b}`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTool === "timestampconverter" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter timestamp or date"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    if (timestampInput) {
                      const timestamp = parseInt(timestampInput);
                      const date = new Date(timestamp * 1000);
                      setCalculatorResult(`Date: ${date.toLocaleString()}`);
                    }
                  }}
                  variant="outline"
                >
                  Timestamp to Date
                </Button>
                <Button
                  onClick={() => {
                    const now = Math.floor(Date.now() / 1000);
                    setCalculatorResult(`Current timestamp: ${now}`);
                  }}
                  variant="outline"
                >
                  Current Timestamp
                </Button>
              </div>
              {calculatorResult && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono">{calculatorResult}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
