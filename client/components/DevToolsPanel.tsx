import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  ChevronDown,
  ChevronRight,
  Monitor,
  FileText,
  Bug,
} from "lucide-react";

interface DevToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  iframeUrl: string;
}

export default function DevToolsPanel({
  isOpen,
  onClose,
  iframeUrl,
}: DevToolsPanelProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [inspectMode, setInspectMode] = useState(false);
  const [domTree, setDomTree] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Capture console logs
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = (...args) => {
        setLogs((prev) => [...prev, `[LOG] ${args.join(" ")}`]);
        originalLog(...args);
      };

      console.error = (...args) => {
        setLogs((prev) => [...prev, `[ERROR] ${args.join(" ")}`]);
        originalError(...args);
      };

      console.warn = (...args) => {
        setLogs((prev) => [...prev, `[WARN] ${args.join(" ")}`]);
        originalWarn(...args);
      };

      // Try to inspect iframe content
      try {
        const iframe = document.querySelector("iframe");
        if (iframe) {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            setDomTree(buildDomTree(iframeDoc.documentElement));
          } else {
            setLogs((prev) => [
              ...prev,
              "[INFO] Cross-origin iframe - DOM inspection limited",
            ]);
          }
        }
      } catch (e) {
        setLogs((prev) => [
          ...prev,
          `[ERROR] Cannot access iframe content: ${e}`,
        ]);
      }

      return () => {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      };
    }
  }, [isOpen]);

  const buildDomTree = (element: Element): any => {
    return {
      tagName: element.tagName.toLowerCase(),
      attributes: Array.from(element.attributes).map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),
      children: Array.from(element.children).map((child) =>
        buildDomTree(child),
      ),
      textContent: element.textContent?.slice(0, 100),
      id: element.id,
      className: element.className,
    };
  };

  const renderDomNode = (node: any, depth = 0) => {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    return (
      <div
        key={`${node.tagName}-${depth}`}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        <div
          className="flex items-center gap-1 hover:bg-accent/50 rounded px-1 py-0.5 cursor-pointer text-sm"
          onClick={() => setSelectedElement(node)}
        >
          {node.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="text-blue-600 dark:text-blue-400">
            &lt;{node.tagName}
          </span>
          {node.attributes.slice(0, 2).map((attr: any) => (
            <span
              key={attr.name}
              className="text-green-600 dark:text-green-400 text-xs"
            >
              {attr.name}="{attr.value.slice(0, 20)}
              {attr.value.length > 20 ? "..." : ""}"
            </span>
          ))}
          <span className="text-blue-600 dark:text-blue-400">&gt;</span>
          {node.textContent && (
            <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
              {node.textContent.trim()}
            </span>
          )}
        </div>
        {isExpanded &&
          node.children.map((child: any) => renderDomNode(child, depth + 1))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <div className="w-2/3 bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Developer Tools</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="elements" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="elements" className="gap-2">
              <FileText className="h-4 w-4" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="console" className="gap-2">
              <Bug className="h-4 w-4" />
              Console
            </TabsTrigger>
            <TabsTrigger value="network" className="gap-2">
              <Monitor className="h-4 w-4" />
              Network
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="flex-1 flex">
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                {domTree ? (
                  renderDomNode(domTree)
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p>Unable to access iframe DOM</p>
                    <p className="text-sm">Cross-origin restrictions apply</p>
                  </div>
                )}
              </ScrollArea>
            </div>
            {selectedElement && (
              <div className="w-1/3 border-l border-border p-4">
                <h3 className="font-semibold mb-2">Element Properties</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Tag:</strong> {selectedElement.tagName}
                  </div>
                  {selectedElement.id && (
                    <div>
                      <strong>ID:</strong> {selectedElement.id}
                    </div>
                  )}
                  {selectedElement.className && (
                    <div>
                      <strong>Class:</strong> {selectedElement.className}
                    </div>
                  )}
                  <div>
                    <strong>Attributes:</strong>
                  </div>
                  <div className="ml-4 space-y-1">
                    {selectedElement.attributes.map((attr: any) => (
                      <div key={attr.name} className="text-xs">
                        <span className="text-blue-600 dark:text-blue-400">
                          {attr.name}
                        </span>
                        :
                        <span className="text-green-600 dark:text-green-400 ml-1">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="console" className="flex-1 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-1 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  Console Output:
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  Inspecting: {iframeUrl}
                </div>
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`${
                      log.includes("[ERROR]")
                        ? "text-red-600 dark:text-red-400"
                        : log.includes("[WARN]")
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-foreground"
                    }`}
                  >
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-muted-foreground">
                    No console output yet...
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="network" className="flex-1 p-4">
            <div className="text-center py-8 text-muted-foreground">
              <Monitor className="h-8 w-8 mx-auto mb-2" />
              <p>Network monitoring would appear here</p>
              <p className="text-sm">Feature in development</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
