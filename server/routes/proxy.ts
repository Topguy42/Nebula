import { RequestHandler } from "express";

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    // Fetch the content
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch content: ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    let content = await response.text();

    // For HTML content, modify it to work better in our proxy
    if (contentType.includes('text/html')) {
      // Add base tag to handle relative URLs
      const baseTag = `<base href="${targetUrl.origin}/">`;
      content = content.replace('<head>', `<head>${baseTag}`);
      
      // Remove X-Frame-Options and CSP headers that might block embedding
      content = content.replace(/<meta[^>]*http-equiv[^>]*>/gi, '');
      
      // Add some basic styles to make it work better in iframe
      const styles = `
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          * { 
            box-sizing: border-box; 
          }
        </style>
      `;
      content = content.replace('</head>', `${styles}</head>`);
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    
    res.send(content);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
