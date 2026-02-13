const AIAnalyzer = require('../utils/ai-analyzer');

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

  try {
    const { storeContent, apiKey } = JSON.parse(event.body);

    if (!storeContent) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Store content is required' })
      };
    }

    // Use provided API key or environment variable
    const openaiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key is required' })
      };
    }

    const analyzer = new AIAnalyzer(openaiKey);

    console.log(`Analyzing store: ${storeContent.title}`);

    // Analyze the store
    const analysis = await analyzer.analyzeStore(storeContent);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        analysis
      })
    };

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Analysis failed',
        message: error.message
      })
    };
  }
};
