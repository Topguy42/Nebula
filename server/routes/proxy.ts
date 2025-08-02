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

    // Add small delay for certain sites to avoid rate limiting
    const hostname = targetUrl.hostname.toLowerCase();
    if (hostname.includes("speedtest") || hostname.includes("fast.com")) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000),
      );
    }

    // Fetch the content with better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log(`[PROXY] Fetching: ${targetUrl.toString()}`);
      // Build more realistic headers with randomization
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      ];

      const randomUA =
        userAgents[Math.floor(Math.random() * userAgents.length)];

      const headers: Record<string, string> = {
        "User-Agent": randomUA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Sec-Ch-Ua":
          '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
      };

      // Add referrer for subsequent requests
      const urlPath = targetUrl.pathname;
      if (urlPath !== "/" && urlPath !== "") {
        headers["Referer"] = targetUrl.origin + "/";
      }

      // Copy some headers from the original request if they exist
      const originalHeaders = req.headers;
      if (originalHeaders["accept-language"]) {
        headers["Accept-Language"] = originalHeaders[
          "accept-language"
        ] as string;
      }
      if (originalHeaders["cookie"]) {
        headers["Cookie"] = originalHeaders["cookie"] as string;
      }

      const response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers,
        redirect: "follow",
      });

      clearTimeout(timeoutId);
      console.log(
        `[PROXY] Response: ${response.status} ${response.statusText} for ${targetUrl.toString()}`,
      );

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
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        return res.send(content);
      } else if (contentType.includes("text/css")) {
        // Handle CSS files - rewrite url() references
        let cssContent = await response.text();

        cssContent = cssContent.replace(
          /url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi,
          (match, url) => {
            if (!url || url.startsWith("data:") || url.startsWith("blob:")) {
              return match;
            }

            try {
              let fullUrl: string;
              if (url.startsWith("//")) {
                fullUrl = targetUrl.protocol + url;
              } else if (
                url.startsWith("http://") ||
                url.startsWith("https://")
              ) {
                fullUrl = url;
              } else {
                fullUrl = new URL(url, targetUrl.href).href;
              }
              return `url("/api/proxy?url=${encodeURIComponent(fullUrl)}")`;
            } catch (e) {
              return match;
            }
          },
        );

        res.setHeader("Content-Type", "text/css; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Cache-Control", "public, max-age=3600");

        return res.send(cssContent);
      } else if (
        contentType.includes("application/javascript") ||
        contentType.includes("text/javascript")
      ) {
        // Handle JavaScript files - don't rewrite them, let our injected code handle everything
        const jsContent = await response.text();

        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Cache-Control", "public, max-age=3600");

        return res.send(jsContent);
      } else {
        // For other content types (images, etc.)
        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        res.setHeader("Content-Type", contentType);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
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
    content = content.replace(/<base[^>]*>/gi, "");

    // Set base tag to proxy the original domain
    const baseTag = `<base href="/api/proxy?url=${encodeURIComponent(targetUrl.origin + "/")}" target="_self">`;

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

    // Add simple iframe-friendly styles only
    const proxyEnhancements = `
      <style>
        /* Iframe-friendly styles */
        * { box-sizing: border-box !important; }
        body { margin: 0 !important; overflow-x: auto !important; min-height: 100vh !important; }
        .fixed, [style*="position: fixed"], [style*="position:fixed"] { position: absolute !important; }
        a, button, [onclick], [role="button"] { pointer-events: auto !important; }
      </style>
    `;

    // Insert enhancements before closing head tag
    if (content.includes("</head>")) {
      content = content.replace("</head>", proxyEnhancements + "</head>");
    } else if (content.includes("</HEAD>")) {
      content = content.replace("</HEAD>", proxyEnhancements + "</HEAD>");
    }

    // Simple HTML URL rewriting (avoiding infinite loops)
    const rewriteUrl = (url: string): string => {
      if (
        !url ||
        url.startsWith("/api/proxy") ||
        url.startsWith("data:") ||
        url.startsWith("blob:") ||
        url.startsWith("javascript:") ||
        url.startsWith("mailto:") ||
        url.startsWith("tel:")
      ) {
        return url;
      }

      try {
        let fullUrl: string;
        if (url.startsWith("//")) {
          fullUrl = targetUrl.protocol + url;
        } else if (url.startsWith("http://") || url.startsWith("https://")) {
          fullUrl = url;
        } else if (url.startsWith("/")) {
          fullUrl = targetUrl.origin + url;
        } else {
          fullUrl = new URL(url, targetUrl.href).href;
        }
        return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
      } catch (e) {
        return url;
      }
    };

    // Rewrite href attributes
    content = content.replace(/href\s*=\s*["']([^"']+)["']/gi, (match, url) => {
      return `href="${rewriteUrl(url)}"`;
    });

    // Rewrite src attributes
    content = content.replace(/src\s*=\s*["']([^"']+)["']/gi, (match, url) => {
      return `src="${rewriteUrl(url)}"`;
    });

    // Rewrite action attributes
    content = content.replace(
      /action\s*=\s*["']([^"']+)["']/gi,
      (match, url) => {
        return `action="${rewriteUrl(url)}"`;
      },
    );

    return content;
  } catch (error) {
    console.error("HTML processing error:", error);
    return content; // Return original content if processing fails
  }
}
