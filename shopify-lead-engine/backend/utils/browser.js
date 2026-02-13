const { chromium } = require('playwright');

class BrowserScraper {
  constructor() {
    this.browser = null;
    this.context = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US'
      });
    }
  }

  async scrapePage(url, timeout = 30000) {
    await this.initialize();
    
    const page = await this.context.newPage();
    
    try {
      // Navigate with realistic behavior
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout
      });

      // Wait for page to settle
      await page.waitForTimeout(2000);

      // Get page content
      const html = await page.content();
      
      // Get page title
      const title = await page.title();

      await page.close();

      return {
        html,
        title,
        url: page.url() // Final URL after redirects
      };
      
    } catch (error) {
      await page.close();
      throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }
}

// Singleton instance
let scraperInstance = null;

function getBrowserScraper() {
  if (!scraperInstance) {
    scraperInstance = new BrowserScraper();
  }
  return scraperInstance;
}

async function closeBrowserScraper() {
  if (scraperInstance) {
    await scraperInstance.close();
    scraperInstance = null;
  }
}

module.exports = {
  getBrowserScraper,
  closeBrowserScraper
};
