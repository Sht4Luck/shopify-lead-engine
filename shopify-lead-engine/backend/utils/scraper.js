const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Search Bing for Shopify stores
 * Uses public HTML scraping (no API needed)
 */
async function searchBingForShopifyStores(niche, maxResults = 20) {
  const queries = [
    `"powered by shopify" ${niche}`,
    `site:myshopify.com ${niche}`,
    `shopify store ${niche}`
  ];

  const stores = new Set();
  
  for (const query of queries) {
    if (stores.size >= maxResults) break;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limit
      
      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract URLs from search results
      $('li.b_algo h2 a').each((i, elem) => {
        const url = $(elem).attr('href');
        if (url && isValidShopifyUrl(url)) {
          stores.add(cleanUrl(url));
        }
      });
      
    } catch (error) {
      console.error(`Search error for "${query}":`, error.message);
    }
  }

  return Array.from(stores).slice(0, maxResults);
}

/**
 * Validate if URL could be a Shopify store
 */
function isValidShopifyUrl(url) {
  try {
    const parsed = new URL(url);
    // Exclude Shopify's own domains
    const excluded = ['shopify.com', 'myshopify.com/admin', 'apps.shopify.com'];
    
    if (excluded.some(domain => parsed.hostname.includes(domain) && !parsed.hostname.endsWith('.myshopify.com'))) {
      return false;
    }
    
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Clean URL to base domain
 */
function cleanUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return url;
  }
}

/**
 * Detect if a website is using Shopify
 */
async function detectShopify(html, url) {
  const $ = cheerio.load(html);
  
  // Check multiple indicators
  const indicators = {
    metaGenerator: $('meta[name="generator"]').attr('content'),
    shopifyCheckout: html.includes('cdn.shopify.com'),
    shopifyScripts: html.includes('shopify.com/s/files'),
    shopifyAssets: html.includes('/shopifycloud/'),
    myshopifyDomain: url.includes('.myshopify.com')
  };

  const isShopify = 
    (indicators.metaGenerator && indicators.metaGenerator.toLowerCase().includes('shopify')) ||
    indicators.shopifyCheckout ||
    indicators.shopifyScripts ||
    indicators.shopifyAssets ||
    indicators.myshopifyDomain;

  return {
    isShopify,
    confidence: Object.values(indicators).filter(Boolean).length / Object.keys(indicators).length,
    indicators
  };
}

/**
 * Extract contact information from HTML
 */
function extractContactInfo(html, baseUrl) {
  const $ = cheerio.load(html);
  const info = {
    email: null,
    contactPage: null,
    instagram: null
  };

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const pageText = $('body').text();
  const emails = pageText.match(emailRegex);
  
  if (emails && emails.length > 0) {
    // Filter out common false positives
    const validEmails = emails.filter(email => 
      !email.includes('example.com') && 
      !email.includes('domain.com') &&
      !email.includes('sentry.io')
    );
    info.email = validEmails[0] || null;
  }

  // Find contact page
  $('a').each((i, elem) => {
    const href = $(elem).attr('href');
    const text = $(elem).text().toLowerCase();
    
    if (href && (text.includes('contact') || href.includes('contact'))) {
      try {
        info.contactPage = new URL(href, baseUrl).href;
      } catch {
        // Invalid URL
      }
    }
  });

  // Extract Instagram
  $('a[href*="instagram.com"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && !info.instagram) {
      info.instagram = href;
    }
  });

  return info;
}

/**
 * Extract store content for AI analysis
 */
function extractStoreContent(html) {
  const $ = cheerio.load(html);
  
  // Remove scripts, styles, and non-content elements
  $('script, style, nav, footer, header').remove();
  
  const content = {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    headings: [],
    productDescriptions: [],
    bodyText: ''
  };

  // Get headings
  $('h1, h2, h3').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text && text.length < 200) {
      content.headings.push(text);
    }
  });

  // Try to find product descriptions
  $('.product-description, .product-details, [class*="product"]').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text && text.length > 50 && text.length < 1000) {
      content.productDescriptions.push(text);
    }
  });

  // Get general body text (limited)
  const bodyText = $('body').text()
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 3000);
  
  content.bodyText = bodyText;

  return content;
}

module.exports = {
  searchBingForShopifyStores,
  detectShopify,
  extractContactInfo,
  extractStoreContent,
  isValidShopifyUrl,
  cleanUrl
};
