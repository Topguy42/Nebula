import { RequestHandler } from "express";

const referrerSources = [
  "https://www.google.com/search?q=",
  "https://www.bing.com/search?q=",
  "https://duckduckgo.com/?q=",
  "https://search.yahoo.com/search?p=",
  "https://www.facebook.com/",
  "https://twitter.com/",
  "https://www.reddit.com/",
  "https://en.wikipedia.org/",
  "https://www.youtube.com/",
  "https://github.com/",
  "https://stackoverflow.com/",
  "",
];

// Rate limiting for Google requests
const googleRequestTimes = new Map<string, number>();
const GOOGLE_RATE_LIMIT_MS = 1000; // 1 second between Google requests per IP
const MAX_GOOGLE_RETRIES = 2;
const requestCounts = new Map<string, { count: number; lastReset: number }>();

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

    // Rate limiting for Google
    if (hostname.includes('google.com') || hostname.includes('google.')) {
      const lastRequest = googleRequestTimes.get(clientIP) || 0;
      const timeSinceLastRequest = Date.now() - lastRequest;

      if (timeSinceLastRequest < GOOGLE_RATE_LIMIT_MS) {
        const waitTime = Math.ceil((GOOGLE_RATE_LIMIT_MS - timeSinceLastRequest) / 1000);
        return res.status(200).send(`
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Please Wait</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; text-align: center; background: #f8fafc; margin: 0;">
              <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 48px; margin-bottom: 16px;">⏱️</div>
                <h2 style="color: #1f2937; margin: 0 0 12px 0; font-size: 24px;">Rate Limited</h2>
                <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.5;">Please wait <strong>${waitTime} seconds</strong> before searching Google again to avoid being blocked.</p>
                <div style="margin: 24px 0;">
                  <button onclick="history.back()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-right: 12px; font-size: 14px;">Go Back</button>
                  <button onclick="setTimeout(() => window.location.reload(), ${waitTime * 1000})" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">Retry in ${waitTime}s</button>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <a href="${targetUrl.toString()}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-size: 14px;">🔗 Open in New Tab Instead</a>
                </div>
              </div>
            </body>
          </html>
        `);
      }

      // Track request count per IP
      const hourKey = Math.floor(Date.now() / (1000 * 60 * 60)); // Reset every hour
      const requestData = requestCounts.get(clientIP) || { count: 0, lastReset: hourKey };

      if (requestData.lastReset !== hourKey) {
        requestData.count = 0;
        requestData.lastReset = hourKey;
      }

      requestData.count++;
      requestCounts.set(clientIP, requestData);

      // If too many requests in an hour, show cooldown
      if (requestData.count > 20) {
        return res.status(200).send(`
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Cooldown Period</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; text-align: center; background: #f8fafc; margin: 0;">
              <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 48px; margin-bottom: 16px;">🛑</div>
                <h2 style="color: #dc2626; margin: 0 0 12px 0; font-size: 24px;">Too Many Requests</h2>
                <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.5;">You've made too many Google searches. Please wait an hour or try other search engines.</p>
                <div style="margin: 24px 0;">
                  <button onclick="history.back()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-right: 12px; font-size: 14px;">Go Back</button>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">Try these alternatives:</p>
                  <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                    <a href="/api/proxy?url=${encodeURIComponent('https://duckduckgo.com/?q=' + (targetUrl.searchParams.get('q') || 'search'))}" style="background: #f59e0b; color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px;">DuckDuckGo</a>
                    <a href="/api/proxy?url=${encodeURIComponent('https://www.bing.com/search?q=' + (targetUrl.searchParams.get('q') || 'search'))}" style="background: #3b82f6; color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px;">Bing</a>
                    <a href="/api/proxy?url=${encodeURIComponent('https://www.startpage.com/search?q=' + (targetUrl.searchParams.get('q') || 'search'))}" style="background: #10b981; color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px;">Startpage</a>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);
      }

      googleRequestTimes.set(clientIP, Date.now());
    }

    // Fetch the content with better error handling
    const controller = new AbortController();
    // Faster timeout for Google search, longer for other sites
    const timeout = hostname.includes("google") ? 6000 : 10000;
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

      // Use more conservative UA selection for Google to avoid patterns
      const randomUA = hostname.includes("google")
        ? userAgents[Math.floor(Date.now() / 30000) % userAgents.length] // Changes every 30 seconds (less frequent)
        : userAgents[Math.floor(Math.random() * userAgents.length)];

      // More conservative dynamic referrer rotation for Google
      let dynamicReferrer = "";
      if (referrer_rotation === "true") {
        if (hostname.includes("google")) {
          // For Google, use more conservative rotation (every 60 seconds)
          const rotationIndex = Math.floor(Date.now() / 60000) % 3; // Only use first 3 referrers
          const conservativeReferrers = [
            "https://www.google.com/",
            "https://en.wikipedia.org/",
            "https://www.youtube.com/"
          ];
          dynamicReferrer = conservativeReferrers[rotationIndex];
        } else {
          // For other sites, use normal rotation
          const rotationIndex = Math.floor(Date.now() / 5000) % referrerSources.length;
          dynamicReferrer = referrerSources[rotationIndex];
          if (dynamicReferrer && dynamicReferrer.includes("search?")) {
            const domain = new URL(targetUrl.toString()).hostname;
            dynamicReferrer = dynamicReferrer + encodeURIComponent(domain);
          }
        }
        console.log(
          `[PROXY] Using rotating referrer: ${dynamicReferrer || "none"}`,
        );
      }

      const headers: Record<string, string> = {
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

      // Google-specific optimizations for about:blank and proxy environments
      if (
        hostname.includes("google.com") ||
        hostname.includes("google.") ||
        hostname === "google.com"
      ) {
        headers["Origin"] = "https://www.google.com";
        headers["Referer"] = "https://www.google.com/";
        headers["DNT"] = "1";
        headers["Accept"] =
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
        headers["Accept-Language"] = "en-US,en;q=0.5";
        headers["Connection"] = "keep-alive";
        headers["Upgrade-Insecure-Requests"] = "1";

        // Conservative headers to avoid detection
        headers["Sec-Fetch-Site"] = "none"; // More conservative
        headers["Sec-Fetch-Mode"] = "navigate";
        headers["Sec-Fetch-User"] = "?1";
        headers["Sec-Fetch-Dest"] = "document";
        // Remove potentially suspicious headers
        delete headers["X-Requested-With"];
        delete headers["X-Forwarded-For"];
        delete headers["X-Real-IP"];

        // Override referrer for about:blank environments
        if (dynamicReferrer) {
          headers["Referer"] = dynamicReferrer;
        } else {
          headers["Referer"] = "https://www.google.com/";
        }

        // Use optimized Google parameters for proxy/about:blank environments
        if (targetUrl.pathname.includes("/search")) {
          const searchParams = new URLSearchParams(targetUrl.search);

          // Check if we have a search query
          const query = searchParams.get('q');
          if (!query) {
            // If no query, redirect to homepage to avoid empty search
            targetUrl.pathname = '/';
            targetUrl.search = '';
          } else {
            // Add parameters to reduce rate limiting risk
            searchParams.set("safe", "active");
            searchParams.set("lr", "lang_en");
            searchParams.set("hl", "en");
            searchParams.set("num", "10"); // Reduced from 20 to be less aggressive
            searchParams.set("start", "0");

            // Use more conservative client identifier
            searchParams.set("client", "safari"); // Safari is less likely to be blocked than Firefox
            searchParams.set("source", "hp");

            // Add randomization to avoid patterns
            const randomSeed = Math.floor(Math.random() * 1000);
            searchParams.set("gs_lcp", randomSeed.toString());

            // Remove tracking and potentially problematic parameters
            searchParams.delete("ved");
            searchParams.delete("uact");
            searchParams.delete("ei");
            searchParams.delete("iflsig");
            searchParams.delete("udm"); // Remove this as it might trigger detection

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
        // Enhanced handling for rate limiting
        if (response.status === 429) {
          // For Google, add to our internal rate limiting
          if (hostname.includes('google.com') || hostname.includes('google.')) {
            googleRequestTimes.set(clientIP, Date.now() + (GOOGLE_RATE_LIMIT_MS * 2)); // Extend cooldown
          }

          const retryDelay = hostname.includes('google') ? 10 : 5; // Longer delay for Google

          return res.status(200).send(`
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Rate Limited</title>
                <script>
                  let countdown = ${retryDelay};
                  function updateCountdown() {
                    const button = document.getElementById('retryBtn');
                    if (countdown > 0) {
                      button.textContent = 'Retry in ' + countdown + ' seconds';
                      button.disabled = true;
                      countdown--;
                      setTimeout(updateCountdown, 1000);
                    } else {
                      button.textContent = 'Retry Now';
                      button.disabled = false;
                      button.onclick = () => window.location.reload();
                    }
                  }
                  window.onload = updateCountdown;
                </script>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; text-align: center; background: #f8fafc; margin: 0;">
                <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <div style="font-size: 48px; margin-bottom: 16px;">🚦</div>
                  <h2 style="color: #dc2626; margin: 0 0 12px 0; font-size: 24px;">Rate Limited</h2>
                  <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.5;"><strong>${targetUrl.hostname}</strong> is temporarily limiting requests. This helps prevent your IP from being blocked.</p>
                  <div style="margin: 24px 0;">
                    <button onclick="history.back()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-right: 12px; font-size: 14px;">Go Back</button>
                    <button id="retryBtn" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">Retry in ${retryDelay} seconds</button>
                  </div>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <a href="${targetUrl.toString()}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-size: 14px;">🔗 Open in New Tab Instead</a>
                  </div>
                  ${hostname.includes('google') ? `
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">Try alternative search engines:</p>
                      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <a href="/api/proxy?url=${encodeURIComponent('https://duckduckgo.com/?q=' + (targetUrl.searchParams.get('q') || 'search'))}" style="background: #f59e0b; color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px;">DuckDuckGo</a>
                        <a href="/api/proxy?url=${encodeURIComponent('https://www.bing.com/search?q=' + (targetUrl.searchParams.get('q') || 'search'))}" style="background: #3b82f6; color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px;">Bing</a>
                        <a href="/api/proxy?url=${encodeURIComponent('https://www.startpage.com/search?q=' + (targetUrl.searchParams.get('q') || 'search'))}" style="background: #10b981; color: white; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px;">Startpage</a>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </body>
            </html>
          `);
        }

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
