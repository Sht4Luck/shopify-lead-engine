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
    const { storeContent, qualityScore, apiKey } = JSON.parse(event.body);

    if (!storeContent || !qualityScore) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Store content and quality score are required' })
      };
    }

    const openaiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key is required' })
      };
    }

    const analyzer = new AIAnalyzer(openaiKey);

    console.log(`Generating hook for: ${storeContent.title}`);

    const hook = await analyzer.generateOutreachHook(storeContent, qualityScore);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        hook
      })
    };

  } catch (error) {
    console.error('Hook generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Hook generation failed',
        message: error.message
      })
    };
  }
};
