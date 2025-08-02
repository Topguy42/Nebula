import { RequestHandler } from "express";

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;
    console.log(`[PROXY] Request for: ${url}`);

    if (!url || typeof url !== "string") {
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>❌ Error</h2>
            <p>URL parameter is required</p>
            <button onclick="history.back()">Go Back</button>
          </body>
        </html>
      `);
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>❌ Invalid URL</h2>
            <p>The URL "${url}" is not valid</p>
            <button onclick="history.back()">Go Back</button>
          </body>
        </html>
      `);
    }

    // Fetch the content with better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log(`[PROXY] Fetching: ${targetUrl.toString()}`);
      // Build more realistic headers
      const headers: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Sec-Ch-Ua": '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
      };

      // Copy some headers from the original request if they exist
      const originalHeaders = req.headers;
      if (originalHeaders['accept-language']) {
        headers['Accept-Language'] = originalHeaders['accept-language'] as string;
      }
      if (originalHeaders['referer']) {
        headers['Referer'] = originalHeaders['referer'] as string;
      }

      const response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers,
        redirect: "follow",
      });

      clearTimeout(timeoutId);
      console.log(`[PROXY] Response: ${response.status} ${response.statusText} for ${targetUrl.toString()}`);

      if (!response.ok) {
        return res.status(200).send(`
          <html>
            <body style="font-family: sans-serif; padding: 40px; text-align: center;">
              <h2>⚠️ Website Error</h2>
              <p>Failed to load: <strong>${targetUrl.hostname}</strong></p>
              <p>Status: ${response.status} ${response.statusText}</p>
              <p><small>Some websites may block proxy access</small></p>
              <button onclick="history.back()">Go Back</button>
              <br><br>
              <a href="${targetUrl.toString()}" target="_blank" rel="noopener noreferrer">
                Open in New Tab Instead
              </a>
            </body>
          </html>
        `);
      }

      const contentType = response.headers.get("content-type") || "text/html";

      // Handle different content types
      if (contentType.includes("text/html")) {
        let content = await response.text();

        // Enhanced HTML processing
        content = processHTML(content, targetUrl);

        // Set security headers
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        res.setHeader(
          "Content-Security-Policy",
          "frame-ancestors *; default-src * data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';",
        );
        res.setHeader("Access-Control-Allow-Origin", "*");

        return res.send(content);
      } else if (contentType.includes("text/css")) {
        // Handle CSS files - rewrite url() references
        let cssContent = await response.text();

        cssContent = cssContent.replace(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi, (match, url) => {
          if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
            return match;
          }

          try {
            let fullUrl: string;
            if (url.startsWith('//')) {
              fullUrl = targetUrl.protocol + url;
            } else if (url.startsWith('http://') || url.startsWith('https://')) {
              fullUrl = url;
            } else {
              fullUrl = new URL(url, targetUrl.href).href;
            }
            return `url("/api/proxy?url=${encodeURIComponent(fullUrl)}")`;
          } catch (e) {
            return match;
          }
        });

        res.setHeader("Content-Type", "text/css; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=3600");

        return res.send(cssContent);
      } else if (contentType.includes("application/javascript") || contentType.includes("text/javascript")) {
        // Handle JavaScript files
        let jsContent = await response.text();

        // Basic JS URL rewriting for common patterns (fetch, XMLHttpRequest, etc.)
        // Note: This is limited - sophisticated JS apps may still have issues
        jsContent = jsContent.replace(/(["'`])((https?:)?\/\/[^"'`\s]+)(["'`])/gi, (match, quote1, url, protocol, quote2) => {
          try {
            let fullUrl = url.startsWith('//') ? targetUrl.protocol + url : url;
            return `${quote1}/api/proxy?url=${encodeURIComponent(fullUrl)}${quote2}`;
          } catch (e) {
            return match;
          }
        });

        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=3600");

        return res.send(jsContent);
      } else {
        // For other content types (images, etc.)
        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        res.setHeader("Content-Type", contentType);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=3600");

        return res.send(Buffer.from(uint8Array));
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return res.status(200).send(`
          <html>
            <body style="font-family: sans-serif; padding: 40px; text-align: center;">
              <h2>⏰ Timeout</h2>
              <p>The website took too long to respond</p>
              <p><strong>${targetUrl.hostname}</strong></p>
              <button onclick="history.back()">Go Back</button>
              <br><br>
              <a href="${targetUrl.toString()}" target="_blank" rel="noopener noreferrer">
                Try Opening in New Tab
              </a>
            </body>
          </html>
        `);
      }

      return res.status(200).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>🌐 Connection Error</h2>
            <p>Could not connect to <strong>${targetUrl.hostname}</strong></p>
            <p><small>${fetchError instanceof Error ? fetchError.message : "Unknown error"}</small></p>
            <button onclick="history.back()">Go Back</button>
            <br><br>
            <a href="${targetUrl.toString()}" target="_blank" rel="noopener noreferrer">
              Try Opening in New Tab
            </a>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>💥 Server Error</h2>
          <p>Something went wrong with the proxy</p>
          <button onclick="history.back()">Go Back</button>
        </body>
      </html>
    `);
  }
};

function processHTML(content: string, targetUrl: URL): string {
  try {
    // Remove existing base tags to avoid conflicts
    content = content.replace(/<base[^>]*>/gi, '');

    // Add our proxy-aware base tag
    const baseTag = `<base href="/api/proxy?url=${encodeURIComponent(targetUrl.origin + '/')}" target="_self">`;

    // Insert base tag after <head>
    if (content.includes("<head>")) {
      content = content.replace("<head>", `<head>${baseTag}`);
    } else if (content.includes("<HEAD>")) {
      content = content.replace("<HEAD>", `<HEAD>${baseTag}`);
    } else {
      // If no head tag, add it
      content = content.replace(
        /<html[^>]*>/i,
        "$&<head>" + baseTag + "</head>",
      );
    }

    // Remove problematic headers and meta tags
    content = content.replace(
      /<meta[^>]*http-equiv[^>]*["\']?x-frame-options[^>]*>/gi,
      "",
    );
    content = content.replace(
      /<meta[^>]*http-equiv[^>]*["\']?content-security-policy[^>]*>/gi,
      "",
    );
    content = content.replace(/<meta[^>]*name[^>]*["\']?referrer[^>]*>/gi, "");

    // Add iframe-friendly styles
    const proxyStyles = `
      <style>
        /* Proxy Enhancement Styles */
        * {
          box-sizing: border-box !important;
        }
        body {
          margin: 0 !important;
          overflow-x: auto !important;
          min-height: 100vh !important;
        }
        /* Fix common layout issues */
        .fixed, [style*="position: fixed"], [style*="position:fixed"] {
          position: absolute !important;
        }
        /* Ensure clickable elements work */
        a, button, [onclick], [role="button"] {
          pointer-events: auto !important;
        }
      </style>
    `;

    // Insert styles before closing head tag
    if (content.includes("</head>")) {
      content = content.replace("</head>", proxyStyles + "</head>");
    } else if (content.includes("</HEAD>")) {
      content = content.replace("</HEAD>", proxyStyles + "</HEAD>");
    }

    // Helper function to rewrite URLs
    const rewriteUrl = (url: string, baseUrl: URL): string => {
      if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        return url;
      }

      try {
        let fullUrl: string;
        if (url.startsWith('//')) {
          fullUrl = baseUrl.protocol + url;
        } else if (url.startsWith('http://') || url.startsWith('https://')) {
          fullUrl = url;
        } else {
          // Relative URL - resolve against base
          fullUrl = new URL(url, baseUrl.href).href;
        }
        return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
      } catch (e) {
        // If URL parsing fails, return original
        return url;
      }
    };

    // Rewrite href attributes (links)
    content = content.replace(/href\s*=\s*["']([^"']+)["']/gi, (match, url) => {
      const rewritten = rewriteUrl(url, targetUrl);
      return `href="${rewritten}" target="_self"`;
    });

    // Rewrite src attributes (images, scripts, iframes, etc.)
    content = content.replace(/src\s*=\s*["']([^"']+)["']/gi, (match, url) => {
      const rewritten = rewriteUrl(url, targetUrl);
      return `src="${rewritten}"`;
    });

    // Rewrite action attributes (forms)
    content = content.replace(/action\s*=\s*["']([^"']+)["']/gi, (match, url) => {
      const rewritten = rewriteUrl(url, targetUrl);
      return `action="${rewritten}"`;
    });

    // Rewrite CSS url() references
    content = content.replace(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi, (match, url) => {
      const rewritten = rewriteUrl(url, targetUrl);
      return `url("${rewritten}")`;
    });

    // Rewrite srcset attributes (responsive images)
    content = content.replace(/srcset\s*=\s*["']([^"']+)["']/gi, (match, srcset) => {
      const rewrittenSrcset = srcset.replace(/([^\s,]+)/g, (url) => {
        if (url.match(/^\d+[wx]$/)) return url; // Skip size descriptors
        return rewriteUrl(url, targetUrl);
      });
      return `srcset="${rewrittenSrcset}"`;
    });

    return content;
  } catch (error) {
    console.error("HTML processing error:", error);
    return content; // Return original content if processing fails
  }
}
