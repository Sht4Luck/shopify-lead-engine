const { getBrowserScraper } = require('../utils/browser');
const { detectShopify, extractContactInfo, extractStoreContent } = require('../utils/scraper');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const scraper = getBrowserScraper();

  try {
    const { url } = JSON.parse(event.body);

    if (!url || typeof url !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid URL format' })
      };
    }

    console.log(`Scraping: ${url}`);

    // Scrape the page
    const pageData = await scraper.scrapePage(url);

    // Detect Shopify
    const shopifyDetection = await detectShopify(pageData.html, url);

    if (!shopifyDetection.isShopify) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          url,
          isShopify: false,
          message: 'Not a Shopify store'
        })
      };
    }

    // Extract information
    const contactInfo = extractContactInfo(pageData.html, url);
    const storeContent = extractStoreContent(pageData.html);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url,
        isShopify: true,
        confidence: shopifyDetection.confidence,
        contactInfo,
        storeContent: {
          title: storeContent.title,
          description: storeContent.description,
          headings: storeContent.headings.slice(0, 10),
          productDescriptions: storeContent.productDescriptions.slice(0, 3),
          bodyText: storeContent.bodyText.substring(0, 2000)
        }
      })
    };

  } catch (error) {
    console.error('Scrape error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Scraping failed',
        message: error.message
      })
    };
  }
};
