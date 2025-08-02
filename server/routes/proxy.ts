import { RequestHandler } from "express";

// About:blank emulation system
const aboutBlankRequestMap = new Map<string, number>();
const EMULATION_DELAY = 2000; // 2 second delay for about:blank requests to Google

const detectAboutBlank = (req: any): boolean => {
  const referer = req.headers.referer || "";
  const origin = req.headers.origin || "";

  // Only detect about:blank if we have strong indicators
  return (
    referer === "https://www.google.com/" ||
    origin === "https://www.google.com"
  );
};

const generateRealHeaders = (hostname: string, isAboutBlank: boolean) => {
  const realReferrers = [
    "https://www.bing.com/",
    "https://duckduckgo.com/",
    "https://search.yahoo.com/",
    "https://www.ecosia.org/",
    "https://startpage.com/",
    "https://en.wikipedia.org/",
    "https://news.ycombinator.com/",
    "https://reddit.com/r/all"
  ];

  const realUserAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  ];

  if (isAboutBlank && hostname.includes("google")) {
    // Make about:blank requests look like they're coming from a real search engine
    const randomReferrer = realReferrers[Math.floor(Math.random() * realReferrers.length)];
    const randomUA = realUserAgents[Math.floor(Math.random() * realUserAgents.length)];

    return {
      "User-Agent": randomUA,
      "Referer": randomReferrer,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0"
    };
  }

  return null;
};

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const { url, referrer_rotation } = req.query;
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    console.log(`[PROXY] Request for: ${url} from IP: ${clientIP}`);

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

    const hostname = targetUrl.hostname.toLowerCase();

    // Detect about:blank and apply emulation
    const isAboutBlank = detectAboutBlank(req);
    const isGoogleRequest = hostname.includes("google.com") || hostname.includes("google.");

    // Apply rate limiting for about:blank Google requests
    if (isAboutBlank && isGoogleRequest) {
      const requestKey = `${clientIP}-aboutblank-google`;
      const lastRequest = aboutBlankRequestMap.get(requestKey) || 0;
      const timeSinceLastRequest = Date.now() - lastRequest;

      if (timeSinceLastRequest < EMULATION_DELAY) {
        const waitTime = EMULATION_DELAY - timeSinceLastRequest;
        console.log(`[PROXY] About:blank emulation delay for ${clientIP}: ${waitTime}ms`);

        return res.status(200).send(`
          <html>
            <head>
              <meta charset="utf-8">
              <title>Loading...</title>
              <script>
                setTimeout(() => window.location.reload(), ${waitTime});
              </script>
            </head>
            <body style="font-family: system-ui; padding: 20px; text-align: center; background: #f8fafc;">
              <div style="background: white; border-radius: 8px; padding: 20px; max-width: 300px; margin: 100px auto;">
                <div style="font-size: 24px; margin-bottom: 12px;">🔄</div>
                <h3 style="margin: 0 0 8px 0;">Loading...</h3>
                <div style="width: 100%; height: 3px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                  <div style="width: 0%; height: 100%; background: #10b981; animation: progress ${waitTime}ms linear forwards;"></div>
                </div>
                <style>@keyframes progress { to { width: 100%; } }</style>
              </div>
            </body>
          </html>
        `);
      }

      aboutBlankRequestMap.set(requestKey, Date.now());
    }

    // Fetch the content with better error handling
    const controller = new AbortController();
    // Standard timeout for all requests
    const timeout = hostname.includes("google") ? 8000 : 10000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`[PROXY] Fetching: ${targetUrl.toString()}`);
      // Build more realistic headers with randomization
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      ];

      // Check if we should use emulated headers for about:blank
      const emulatedHeaders = generateRealHeaders(hostname, isAboutBlank);

      let headers: Record<string, string>;

      if (emulatedHeaders) {
        // Use emulated headers for about:blank Google requests
        headers = emulatedHeaders;
        console.log(`[PROXY] Using emulated headers for about:blank Google request`);
      } else {
        // Standard headers for normal requests
        const randomUA = hostname.includes("google")
          ? userAgents[Math.floor(Date.now() / 10000) % userAgents.length]
          : userAgents[Math.floor(Math.random() * userAgents.length)];

        // Simple referrer rotation
        let dynamicReferrer = "";
        if (referrer_rotation === "true") {
          const referrers = [
            "https://www.google.com/",
            "https://duckduckgo.com/",
            "https://en.wikipedia.org/",
            "https://www.bing.com/",
            "https://www.youtube.com/",
            "https://github.com/",
          ];
          const rotationIndex = Math.floor(Date.now() / 10000) % referrers.length;
          dynamicReferrer = referrers[rotationIndex];
          console.log(`[PROXY] Using rotating referrer: ${dynamicReferrer}`);
        }

        headers = {
          "User-Agent": randomUA,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": dynamicReferrer ? "cross-site" : "none",
          "Sec-Fetch-User": "?1",
          "Sec-Ch-Ua":
            '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
        };

        // Add dynamic referrer if rotation is enabled
        if (referrer_rotation === "true" && dynamicReferrer) {
          headers["Referer"] = dynamicReferrer;
        }
      }

      // YouTube-specific headers and handling
      if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
        headers["Origin"] = "https://www.youtube.com";
        headers["Referer"] = "https://www.youtube.com/";
        headers["X-YouTube-Client-Name"] = "1";
        headers["X-YouTube-Client-Version"] = "2.20231214.04.00";
        headers["X-Requested-With"] = "XMLHttpRequest";
        headers["DNT"] = "1";

        // Use mobile YouTube for better compatibility
        if (
          targetUrl.hostname === "www.youtube.com" ||
          targetUrl.hostname === "youtube.com"
        ) {
          targetUrl.hostname = "m.youtube.com";
        }
      }

      // Google-specific headers - standard for all requests
      if (
        hostname.includes("google.com") ||
        hostname.includes("google.") ||
        hostname === "google.com"
      ) {
        // Standard Google headers that work for all environments
        headers["Referer"] = dynamicReferrer || "https://www.google.com/";
        headers["Sec-Fetch-Site"] = dynamicReferrer ? "cross-site" : "same-origin";
        headers["Sec-Fetch-Mode"] = "navigate";
        headers["Sec-Fetch-User"] = "?1";
        headers["Sec-Fetch-Dest"] = "document";
        headers["Cache-Control"] = "no-cache";

        headers["DNT"] = "1";
        headers["Accept"] =
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8";
        headers["Accept-Language"] = "en-US,en;q=0.9";
        headers["Connection"] = "keep-alive";
        headers["Upgrade-Insecure-Requests"] = "1";

        // Standard Google search parameters for all requests
        if (targetUrl.pathname.includes("/search")) {
          const searchParams = new URLSearchParams(targetUrl.search);

          // Check if we have a search query
          const query = searchParams.get("q");
          if (!query) {
            // If no query, redirect to homepage to avoid empty search
            targetUrl.pathname = "/";
            targetUrl.search = "";
          } else {
            // Clean, standard search parameters
            searchParams.set("safe", "active");
            searchParams.set("lr", "lang_en");
            searchParams.set("hl", "en");
            searchParams.set("num", "10");
            searchParams.set("start", "0");
            searchParams.set("client", "firefox-b-d");
            searchParams.set("source", "hp");

            // Remove tracking parameters
            const paramsToRemove = [
              "ved",
              "uact",
              "gs_lcp",
              "sclient",
              "sourceid",
              "ei",
              "iflsig",
            ];
            paramsToRemove.forEach((param) => searchParams.delete(param));

            targetUrl.search = searchParams.toString();
          }
        }
      }

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
        // Standard error handling for all requests
        return res.status(200).send(`
          <html>
            <body style="font-family: sans-serif; padding: 40px; text-align: center;">
              <h2>⚠️ Website Error</h2>
              <p>Failed to load: <strong>${targetUrl.hostname}</strong></p>
              <p>Status: ${response.status} ${response.statusText}</p>
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

        // Fast-track Google search results with minimal processing
        if (
          hostname.includes("google") &&
          targetUrl.pathname.includes("/search")
        ) {
          content = processGoogleSearchFast(content, targetUrl);
        } else {
          // Enhanced HTML processing for other sites
          content = processHTML(content, targetUrl);
        }

        // Set security headers
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        // Site-specific CSP optimizations
        if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
          res.setHeader(
            "Content-Security-Policy",
            "frame-ancestors *; default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; media-src *; img-src *; connect-src *; object-src *; child-src *;",
          );
        } else if (
          hostname.includes("google.com") ||
          hostname.includes("google.")
        ) {
          res.setHeader(
            "Content-Security-Policy",
            "frame-ancestors *; default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; connect-src *; frame-src *; child-src *; object-src *; media-src *;",
          );

          // Additional headers to improve Google compatibility
          res.setHeader("X-Content-Type-Options", "nosniff");
          res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
          res.setHeader(
            "Permissions-Policy",
            "camera=*, microphone=*, geolocation=*",
          );
        } else {
          res.setHeader(
            "Content-Security-Policy",
            "frame-ancestors *; default-src * data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';",
          );
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // Better caching for static content
        if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else if (
          hostname.includes("google") &&
          targetUrl.pathname.includes("/search")
        ) {
          res.setHeader("Cache-Control", "private, max-age=60"); // 1 minute for search results
        } else if (
          hostname.includes("google.com") ||
          hostname.includes("google.")
        ) {
          res.setHeader("Cache-Control", "private, max-age=180"); // 3 minutes for other Google pages
        } else {
          res.setHeader("Cache-Control", "public, max-age=300"); // 5 minutes
        }

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

function processGoogleSearchFast(content: string, targetUrl: URL): string {
  try {
    // Minimal, fast processing for Google search results

    // Remove frame blockers
    content = content.replace(
      /<meta[^>]*http-equiv[^>]*["\']?x-frame-options[^>]*>/gi,
      "",
    );
    content = content.replace(
      /<meta[^>]*http-equiv[^>]*["\']?content-security-policy[^>]*>/gi,
      "",
    );

    // Set base tag for relative URLs
    const baseTag = `<base href="/api/proxy?url=${encodeURIComponent(targetUrl.origin + "/")}" target="_self">`;
    if (content.includes("<head>")) {
      content = content.replace("<head>", `<head>${baseTag}`);
    }

    // Minimal iframe optimizations
    const fastStyles = `
      <style>
        body { margin: 0 !important; }
        .fixed, [style*="position: fixed"] { position: relative !important; }
        #gb { position: relative !important; }
      </style>
    `;

    if (content.includes("</head>")) {
      content = content.replace("</head>", fastStyles + "</head>");
    }

    // Fast URL rewriting for search results
    content = content.replace(/href\s*=\s*["']([^"']+)["']/gi, (match, url) => {
      if (
        !url ||
        url.startsWith("/api/proxy") ||
        url.startsWith("data:") ||
        url.startsWith("javascript:")
      ) {
        return match;
      }
      try {
        if (url.startsWith("/")) {
          return `href="/api/proxy?url=${encodeURIComponent(targetUrl.origin + url)}"`;
        } else if (url.startsWith("http")) {
          return `href="/api/proxy?url=${encodeURIComponent(url)}"`;
        }
      } catch (e) {}
      return match;
    });

    return content;
  } catch (error) {
    console.error("Fast Google processing error:", error);
    return content;
  }
}

function processHTML(content: string, targetUrl: URL): string {
  try {
    const hostname = targetUrl.hostname.toLowerCase();
    const isYouTube =
      hostname.includes("youtube.com") || hostname.includes("youtu.be");
    const isGoogle =
      hostname.includes("google.com") || hostname.includes("google.");

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

    // Site-specific meta tag removal
    if (isYouTube) {
      content = content.replace(
        /<meta[^>]*name[^>]*["\']?viewport[^>]*>/gi,
        "",
      );
      content = content.replace(
        /<meta[^>]*property[^>]*["\']?og:url[^>]*>/gi,
        "",
      );
    }

    if (isGoogle) {
      // Remove Google's viewport restrictions for better iframe display
      content = content.replace(
        /<meta[^>]*name[^>]*["\']?viewport[^>]*>/gi,
        "",
      );
      // Remove Google's specific frame options
      content = content.replace(
        /<meta[^>]*http-equiv[^>]*["\']?X-UA-Compatible[^>]*>/gi,
        "",
      );
    }

    // Add iframe-friendly styles with site-specific optimizations
    let proxyEnhancements = `
      <style>
        /* Iframe-friendly styles */
        * { box-sizing: border-box !important; }
        body { margin: 0 !important; overflow-x: auto !important; min-height: 100vh !important; }
        .fixed, [style*="position: fixed"], [style*="position:fixed"] { position: absolute !important; }
        a, button, [onclick], [role="button"] { pointer-events: auto !important; }`;

    if (isYouTube) {
      proxyEnhancements += `
        /* YouTube-specific fixes */
        #masthead, .ytd-masthead { position: relative !important; top: 0 !important; }
        .ytd-app { padding-top: 0 !important; }
        ytd-popup-container { z-index: 9999 !important; }`;
    }

    if (isGoogle) {
      proxyEnhancements += `
        /* Google Search optimizations for iframe compatibility */
        #searchform { position: relative !important; }
        #gb { position: relative !important; }
        .g { margin-bottom: 15px !important; }`;
    }

    proxyEnhancements += `
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    `;

    // Add DNS prefetch and preconnect for performance
    if (isYouTube) {
      proxyEnhancements += `
        <link rel="dns-prefetch" href="//i.ytimg.com">
        <link rel="dns-prefetch" href="//s.ytimg.com">
        <link rel="dns-prefetch" href="//googleads.g.doubleclick.net">
        <link rel="preconnect" href="https://www.youtube.com">
      `;
    }

    if (isGoogle) {
      proxyEnhancements += `
        <link rel="dns-prefetch" href="//www.gstatic.com">
        <link rel="dns-prefetch" href="//encrypted-tbn0.gstatic.com">
        <link rel="dns-prefetch" href="//ssl.gstatic.com">
        <link rel="dns-prefetch" href="//fonts.gstatic.com">
        <link rel="preconnect" href="https://www.google.com">
        <link rel="preconnect" href="https://www.gstatic.com">
      `;
    }

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
