const OpenAI = require('openai');

class AIAnalyzer {
  constructor(apiKey) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Classify store niche using AI
   */
  async classifyNiche(storeContent) {
    const prompt = `You are an ecommerce expert.
Classify this Shopify store into one niche: Fashion, Beauty, Supplements, or Other.

Store Information:
Title: ${storeContent.title}
Description: ${storeContent.description}
Headings: ${storeContent.headings.slice(0, 5).join(', ')}
Content Sample: ${storeContent.bodyText.substring(0, 500)}

Return JSON only in this exact format:
{"niche": "Fashion|Beauty|Supplements|Other", "confidence": 0.0-1.0, "reasoning": "brief explanation"}`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        niche: result.niche || 'Other',
        confidence: result.confidence || 0.5,
        reasoning: result.reasoning || 'Unable to classify'
      };
    } catch (error) {
      console.error('Niche classification error:', error.message);
      return { niche: 'Other', confidence: 0, reasoning: 'Classification failed' };
    }
  }

  /**
   * Score store copy quality (1-10)
   */
  async scoreStoreCopy(storeContent) {
    const sampleProducts = storeContent.productDescriptions.slice(0, 3).join('\n\n');
    
    const prompt = `Score this Shopify store (1–10) for product copy quality and conversion clarity.

Evaluate:
- Are benefits clearly stated (not just features)?
- Is there emotional appeal or outcome-focused language?
- Does copy drive action?
- Is it clear what makes products unique?

Store Title: ${storeContent.title}
Product Descriptions:
${sampleProducts || storeContent.bodyText.substring(0, 800)}

Return JSON only in this exact format:
{"score": 5.5, "reason": "brief specific explanation of strengths and weaknesses"}`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 250,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        score: Math.min(10, Math.max(1, parseFloat(result.score) || 5)),
        reason: result.reason || 'Unable to score'
      };
    } catch (error) {
      console.error('Copy scoring error:', error.message);
      return { score: 5, reason: 'Scoring failed' };
    }
  }

  /**
   * Generate personalized outreach hook
   */
  async generateOutreachHook(storeContent, qualityScore) {
    const prompt = `Write 1 personalized outreach sentence based on this store's weaknesses.
Also suggest a free sample offer related to copywriting improvement.
Keep under 40 words total.

Store: ${storeContent.title}
Quality Score: ${qualityScore.score}/10
Weakness: ${qualityScore.reason}
Niche Context: ${storeContent.description.substring(0, 200)}

Return JSON only:
{"hook": "personalized sentence", "offer": "free sample suggestion"}

Make it natural, helpful, and specific to their actual content.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        hook: result.hook || 'Custom copywriting could improve your conversions',
        offer: result.offer || 'Free product description rewrite sample'
      };
    } catch (error) {
      console.error('Hook generation error:', error.message);
      return {
        hook: 'I noticed your product copy focuses on features rather than benefits',
        offer: 'Free rewrite of one product description showing conversion improvements'
      };
    }
  }

  /**
   * Analyze complete store
   */
  async analyzeStore(storeContent) {
    try {
      // Run classifications in parallel
      const [nicheResult, qualityScore] = await Promise.all([
        this.classifyNiche(storeContent),
        this.scoreStoreCopy(storeContent)
      ]);

      // Generate hook based on results
      const outreachHook = await this.generateOutreachHook(storeContent, qualityScore);

      return {
        niche: nicheResult.niche,
        nicheConfidence: nicheResult.confidence,
        nicheReasoning: nicheResult.reasoning,
        qualityScore: qualityScore.score,
        qualityReason: qualityScore.reason,
        outreachHook: outreachHook.hook,
        outreachOffer: outreachHook.offer
      };
    } catch (error) {
      console.error('Store analysis error:', error.message);
      throw error;
    }
  }
}

module.exports = AIAnalyzer;
