const { searchBingForShopifyStores } = require('../utils/scraper');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
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

  try {
    const { niche, maxResults = 20 } = JSON.parse(event.body);

    // Validate input
    if (!niche || typeof niche !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Niche is required' })
      };
    }

    const validNiches = ['fashion', 'beauty', 'supplements', 'skincare'];
    if (!validNiches.some(v => niche.toLowerCase().includes(v))) {
      console.warn(`Unusual niche: ${niche}`);
    }

    // Search for stores
    console.log(`Searching for ${niche} stores, max ${maxResults}`);
    const stores = await searchBingForShopifyStores(niche, Math.min(maxResults, 50));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: stores.length,
        stores: stores.map(url => ({ url, status: 'pending' }))
      })
    };

  } catch (error) {
    console.error('Search error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Search failed',
        message: error.message
      })
    };
  }
};
