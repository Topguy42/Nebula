import { RequestHandler } from "express";

export const handleProxyCheck: RequestHandler = async (req, res) => {
  try {
    const { url, referrer } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "URL parameter is required",
      });
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: `Invalid URL: ${url}`,
      });
    }

    // Build headers with referrer
    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
    };

    // Add referrer if provided
    if (referrer && typeof referrer === "string" && referrer !== "none") {
      headers["Referer"] = referrer;
      headers["Sec-Fetch-Site"] = "same-origin";
    }

    // Set timeout for faster testing
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const startTime = Date.now();
      console.log(
        `[PROXY-CHECK] Testing: ${url} with referrer: ${referrer || "none"}`,
      );

      const response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers,
        redirect: "follow",
        method: "HEAD", // Use HEAD request for faster testing
      });

      clearTimeout(timeoutId);
      const loadTime = Date.now() - startTime;

      console.log(
        `[PROXY-CHECK] Response: ${response.status} in ${loadTime}ms`,
      );

      return res.json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        loadTime: loadTime,
        url: targetUrl.toString(),
        referrer: referrer || "none",
        accessible: response.ok,
        timestamp: new Date().toISOString(),
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      let errorType = "unknown";
      let errorMessage = "Unknown error";

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          errorType = "timeout";
          errorMessage = "Request timed out";
        } else {
          errorType = "network";
          errorMessage = fetchError.message;
        }
      }

      console.log(`[PROXY-CHECK] Error: ${errorType} - ${errorMessage}`);

      return res.json({
        success: false,
        status: 0,
        statusText: errorType,
        loadTime: -1,
        url: targetUrl.toString(),
        referrer: referrer || "none",
        accessible: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("[PROXY-CHECK] Server error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      timestamp: new Date().toISOString(),
    });
  }
};
