# Architecture Documentation

Detailed technical architecture of the Shopify Lead Engine.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Next.js Frontend (Static HTML/JS)           │   │
│  │  • Landing Page                                      │   │
│  │  • Dashboard UI                                      │   │
│  │  • Lead Management                                   │   │
│  │  • CSV Export                                        │   │
│  └────────────────┬────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │ HTTPS/REST
                    │
┌───────────────────▼─────────────────────────────────────────┐
│              NETLIFY SERVERLESS FUNCTIONS                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Layer (Node.js Functions)                      │   │
│  │  • POST /search-stores                              │   │
│  │  • POST /scrape-store                               │   │
│  │  • POST /analyze-store                              │   │
│  │  • POST /generate-hook                              │   │
│  └────┬────────────────────────────────────────┬───────┘   │
│       │                                         │            │
│  ┌────▼───────────┐                      ┌────▼──────────┐ │
│  │ Scraping Layer │                      │   AI Layer    │ │
│  │ • Bing Search  │                      │ • OpenAI API  │ │
│  │ • Playwright   │                      │ • GPT-4o-mini │ │
│  │ • Cheerio      │                      │ • JSON Mode   │ │
│  └────────────────┘                      └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Complete Lead Generation Flow

```
1. User Input
   └─> Dashboard: Select niche, max results
   
2. Search Phase
   └─> POST /search-stores
       └─> Bing HTML scraping
           └─> Extract Shopify store URLs
               └─> Return: [{url: "...", status: "pending"}]

3. Scrape Phase (per store)
   └─> POST /scrape-store {url}
       └─> Playwright browser automation
           └─> Load page with human-like behavior
               └─> Extract HTML content
                   └─> Detect Shopify indicators
                       └─> Extract contact info
                           └─> Parse content for AI
                               └─> Return: {isShopify, contactInfo, storeContent}

4. Analysis Phase
   └─> POST /analyze-store {storeContent}
       └─> OpenAI API calls (parallel)
           ├─> Classify niche (Fashion/Beauty/Supplements)
           ├─> Score copy quality (1-10)
           └─> Generate outreach hook
               └─> Return: {niche, score, hook, offer}

5. Display & Export
   └─> Frontend receives complete lead object
       └─> Display in table
           └─> User can:
               ├─> Filter by niche/score
               ├─> Update status
               └─> Export to CSV
```

---

## Component Details

### Frontend Components

**Technology**: Next.js 14 (Static Export)

**Key Files**:
- `pages/index.js` - Landing page
- `pages/dashboard.js` - Main application
- `styles/globals.css` - Tailwind styles

**State Management**:
- React useState for local state
- localStorage for API keys
- No external state library needed

**Features**:
- Responsive design (mobile-friendly)
- Real-time progress tracking
- Client-side filtering
- CSV generation

### Backend Functions

**Technology**: Node.js 18+ Serverless Functions

**Function Structure**:
```javascript
exports.handler = async (event, context) => {
  // CORS headers
  // Input validation
  // Business logic
  // Error handling
  // JSON response
}
```

**Rate Limiting**:
- Search: 2 second delays between queries
- Scraping: 1 second delays between stores
- No concurrent requests (sequential processing)

### Scraping Layer

**Bing Search**:
```javascript
// Uses public HTML scraping (no API)
// Queries: "powered by shopify" + niche
// Extracts URLs from search results
// Respects rate limits
```

**Playwright Browser**:
```javascript
// Headless Chromium
// Human-like behavior:
// - Realistic viewport
// - User agent spoofing
// - Wait for page load
// - Delay before scraping
```

**Shopify Detection**:
```javascript
// Multiple indicators:
// 1. <meta name="generator" content="Shopify">
// 2. cdn.shopify.com in HTML
// 3. shopifycloud assets
// 4. .myshopify.com domain
// 5. Shopify checkout URLs
```

**Content Extraction**:
```javascript
// Cheerio HTML parsing
// Extracts:
// - Title, description
// - Headings (H1, H2, H3)
// - Product descriptions
// - Email via regex
// - Contact page links
// - Instagram links
```

### AI Layer

**OpenAI Integration**:
```javascript
const client = new OpenAI({ apiKey });

// Uses GPT-4o-mini for cost efficiency
// JSON mode for structured output
// Low temperature (0.3) for consistency
```

**Niche Classification**:
```
Input: Store title, description, headings, content sample
Output: {niche: "Fashion|Beauty|Supplements|Other", confidence, reasoning}
Token usage: ~200 tokens
```

**Quality Scoring**:
```
Input: Product descriptions, copy samples
Evaluation: Benefits vs features, emotional appeal, clarity
Output: {score: 1-10, reason: "explanation"}
Token usage: ~250 tokens
```

**Outreach Hook Generation**:
```
Input: Store content, quality score, weaknesses
Output: {hook: "personalized sentence", offer: "free sample"}
Token usage: ~150 tokens
```

---

## Security Architecture

### Authentication & Authorization

**API Keys**:
- OpenAI key stored client-side (localStorage)
- Passed in request body to functions
- Never exposed in frontend code
- Can be set via env vars for shared deployment

**No User Accounts**:
- Single-user application
- No authentication required
- Settings stored locally

### Data Security

**No Database**:
- All data client-side only
- Leads stored in React state
- Exports to CSV (client-side)
- No server-side persistence

**HTTPS Only**:
- Netlify provides automatic SSL
- All requests encrypted

**CORS**:
- Functions allow cross-origin requests
- Required for static frontend

### Rate Limiting

**Application Level**:
```javascript
// Between searches
await sleep(2000);

// Between store scrapes  
await sleep(1000);

// No concurrent processing
// Sequential only
```

**External APIs**:
- OpenAI: Org-level rate limits
- Bing: IP-based (handled by delays)

### Ethical Safeguards

**Code-Level Restrictions**:
- Cannot scrape logged-in pages
- Cannot bypass CAPTCHAs
- Cannot auto-send emails
- Cannot scrape Instagram
- Respects robots.txt (Playwright default)

---

## Performance Characteristics

### Processing Speed

**Single Store**:
- Search: 2-3 seconds
- Scrape: 3-5 seconds (browser load)
- Analysis: 2-4 seconds (AI calls)
- **Total**: ~10 seconds per store

**10 Stores**:
- Sequential processing
- Total time: ~2 minutes

**Bottlenecks**:
1. Browser automation (slowest)
2. AI API calls
3. Network latency

### Optimization Opportunities

**Current**:
- Sequential processing (safe, simple)
- Full page loads
- Individual AI calls

**Potential Improvements**:
- Parallel scraping (2-3 concurrent)
- Batch AI analysis
- Cache Shopify detection results
- Use lighter scraping (no browser) when possible

### Resource Usage

**Netlify Functions**:
- Each request: ~5-10 seconds
- Memory: 1024 MB default
- 10 stores ≈ 10 function invocations

**OpenAI Costs**:
- Per store: ~600 tokens ($0.001)
- 100 stores: ~$0.10
- Very cost-efficient

---

## Scalability

### Current Limits

**Netlify Free Tier**:
- 125,000 function requests/month
- 100 hours runtime/month
- Sufficient for ~10,000 stores/month

**OpenAI Free Tier**:
- $5 free credits (first time)
- Then pay-as-you-go
- ~5,000 stores per $5

### Scaling Strategies

**Horizontal Scaling**:
- Deploy multiple instances
- Different Netlify accounts
- Distribute niches

**Vertical Scaling**:
- Upgrade Netlify plan
- Increase function concurrency
- Add Redis cache layer

**Cost Scaling**:
- At 1000 stores/day:
  - Netlify: $19/month (Pro)
  - OpenAI: ~$30/month
  - **Total**: ~$50/month

---

## Error Handling

### Function Level

```javascript
try {
  // Business logic
} catch (error) {
  console.error('Error:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: 'Friendly message',
      message: error.message
    })
  };
}
```

### Frontend Level

```javascript
try {
  const response = await axios.post(...);
  // Handle success
} catch (error) {
  console.error(error);
  alert(`Error: ${error.message}`);
  // Continue processing other stores
}
```

### Graceful Degradation

- If Shopify detection fails → Skip store
- If email not found → Show "No contact"
- If AI fails → Use fallback values
- If search fails → Show error, allow retry

---

## Monitoring & Logging

### Frontend Logging

```javascript
// Browser console only
console.log('Processing store:', url);
console.error('Failed:', error);
```

### Backend Logging

```javascript
// Netlify function logs
console.log(`Scraping: ${url}`);
console.log(`Analysis complete: ${analysis.niche}`);
console.error('Error:', error);
```

### Metrics to Track

- Stores searched per run
- Shopify detection success rate
- Average quality scores
- Email found rate
- Processing time per store

---

## Testing Strategy

### Manual Testing

1. **Search Function**: Returns URLs
2. **Scrape Function**: Detects Shopify
3. **Analysis Function**: Returns scores
4. **Full Flow**: End-to-end test
5. **CSV Export**: Valid format

### Edge Cases

- Non-Shopify sites (filtered)
- Sites without contact info (handled)
- Slow-loading pages (timeout)
- Invalid URLs (validation)
- API rate limits (delays)

---

## Deployment Architecture

```
GitHub Repository
     │
     │ push to main
     ▼
Netlify Build System
     │
     ├─> Build Frontend (Next.js)
     │   └─> Output: Static files
     │
     └─> Package Functions
         └─> Output: Serverless functions
     
     │
     ▼
Netlify CDN
     │
     ├─> Static files → Edge servers
     └─> Functions → AWS Lambda
```

---

## Future Architecture Improvements

### Potential Enhancements

1. **Database Layer**
   - PostgreSQL/Supabase
   - Store leads permanently
   - Multi-user support

2. **Queue System**
   - Redis/BullMQ
   - Background processing
   - Better scalability

3. **Caching**
   - Redis cache
   - Store Shopify detection results
   - Reduce redundant scraping

4. **Webhooks**
   - Email notifications
   - Slack integration
   - Google Sheets auto-sync

5. **Analytics**
   - Usage tracking
   - Success metrics
   - ROI calculation

---

## Technology Choices Rationale

### Why Next.js?
- Static export for free hosting
- React ecosystem
- Easy deployment
- Great DX

### Why Netlify?
- Free tier sufficient
- Serverless functions included
- Auto SSL/CDN
- GitHub integration

### Why Playwright?
- Reliable browser automation
- Better than Puppeteer
- Active development
- Good documentation

### Why OpenAI?
- Best-in-class NLP
- JSON mode
- Cost-effective
- Easy API

### Why No Database?
- Simplicity
- Lower costs
- Privacy (client-side only)
- Easier deployment

---

**This architecture is designed for:**
- ✅ Simplicity
- ✅ Low cost
- ✅ Easy deployment
- ✅ Ethical compliance
- ✅ Solo operator use

**Not designed for:**
- ❌ Enterprise scale
- ❌ Multi-tenant SaaS
- ❌ Real-time collaboration
- ❌ Complex workflows
