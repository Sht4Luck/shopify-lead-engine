# Shopify Lead Engine

**Ethical AI-powered lead generation platform for copywriters targeting Shopify stores**

Find qualified Shopify stores in Fashion, Beauty, and Supplements niches. Get AI-powered quality scores, personalized outreach hooks, and contact information — all from public data.

---

## 🎯 What It Does

- **Discovers** Shopify stores automatically via ethical web search
- **Classifies** stores by niche (Fashion/Beauty/Supplements) using AI
- **Scores** product copy quality (1-10 scale) 
- **Extracts** public contact info (email, contact pages, Instagram)
- **Generates** personalized outreach hooks based on copy weaknesses
- **Exports** leads to CSV or Google Sheets
- **Supports** manual outreach workflow (no spam automation)

---

## 🏗️ Architecture

```
Frontend (Next.js)                Backend (Netlify Functions)
├── Landing Page                  ├── /search-stores
├── Dashboard                     ├── /scrape-store
├── Lead Table                    ├── /analyze-store
└── CSV Export                    └── /generate-hook
                                          ↓
                                  Scraping Layer
                                  ├── Bing Search
                                  ├── Playwright Browser
                                  └── Shopify Detection
                                          ↓
                                  AI Layer (OpenAI)
                                  ├── Niche Classification
                                  ├── Quality Scoring
                                  └── Outreach Personalization
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Netlify account (free tier works)
- Git installed

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd shopify-lead-engine

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Test Locally

```bash
# From the backend directory
cd backend
netlify dev

# This will start:
# - Frontend on http://localhost:8888
# - Functions on http://localhost:8888/.netlify/functions
```

Open http://localhost:8888 and test the application.

### 4. Deploy to Netlify

#### Option A: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Option B: Deploy via GitHub

1. Push code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Build settings are auto-detected from `netlify.toml`
6. Add environment variables in Netlify dashboard
7. Deploy!

### 5. Add Environment Variables in Netlify

Go to: **Site settings → Environment variables**

Add:
- `OPENAI_API_KEY` = your OpenAI API key

### 6. Configure Frontend

1. Open your deployed site
2. Click **Settings** button
3. Add:
   - **OpenAI API Key**: Your OpenAI key
   - **API Endpoint**: `https://your-site.netlify.app/.netlify/functions`
4. Click **Save Settings**

---

## 📖 User Guide

### Finding Leads

1. Go to the **Dashboard**
2. Select your target niche (Fashion, Beauty, or Supplements)
3. Set max results (recommended: 10-20)
4. Click **Find Leads**
5. Wait while the system:
   - Searches for stores
   - Confirms Shopify usage
   - Analyzes copy quality
   - Extracts contact info
   - Generates personalized hooks

### Understanding the Results

Each lead shows:

- **Store URL & Title**: Direct link to the store
- **Niche**: AI-classified category
- **Quality Score**: 1-10 rating of copy quality
  - 🟢 7-10: Good copy, harder sell
  - 🟡 5-6: Average copy, good opportunity
  - 🔴 1-4: Poor copy, best prospects
- **Contact Info**: 
  - 📧 Email (if found on site)
  - 📄 Contact page URL
  - 📷 Instagram handle
- **Outreach Hook**: AI-generated personalized opener
- **Offer**: Suggested free sample to offer

### Exporting Leads

Click **Export CSV** to download all leads with full details.

CSV includes:
- URL, Title, Niche
- Quality Score + Reasoning
- All contact information
- Outreach hook + offer
- Status tracking

### Manual Outreach Best Practices

**DO:**
- ✅ Personalize each message
- ✅ Reference specific pages/products
- ✅ Offer genuine value
- ✅ Follow up once (politely)
- ✅ Track responses

**DON'T:**
- ❌ Send automated emails
- ❌ Use the same template for everyone
- ❌ Spam multiple channels
- ❌ Ignore responses
- ❌ Be pushy or aggressive

---

## ⚙️ Technical Details

### Tech Stack

**Frontend:**
- Next.js 14 (React framework)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Deployed on Netlify

**Backend:**
- Node.js serverless functions
- Playwright (browser automation)
- Cheerio (HTML parsing)
- OpenAI API (GPT-4o-mini)

**APIs & Services:**
- OpenAI for AI analysis
- Bing for web search (no API needed)
- Playwright for realistic scraping

### Rate Limiting

The system includes built-in rate limiting:
- 2 second delay between searches
- 1 second delay between store processing
- Respects robots.txt
- Human-like browser behavior

### Data Privacy

- ✅ Only scrapes PUBLIC web pages
- ✅ No login or authentication bypass
- ✅ Does not scrape Instagram directly
- ✅ Stores data locally only
- ✅ No third-party data sharing

---

## 🔒 Legal & Ethical Compliance

### What This Tool Does

✅ **Ethical:**
- Searches public web pages only
- Respects robots.txt
- Uses rate limiting
- No automation of outreach
- Requires manual human review

### What This Tool Does NOT Do

❌ **Prohibited:**
- Auto-send emails or DMs
- Scrape private/logged-in content
- Bypass CAPTCHAs
- Scrape Instagram directly
- Violate any Terms of Service

### Your Responsibilities

As a user, you must:
1. Manually review each lead
2. Personalize all outreach
3. Respect opt-outs immediately
4. Follow CAN-SPAM Act (if in US)
5. Comply with GDPR (if targeting EU)
6. Never spam or harass prospects

**This tool is for lead discovery, not automation.**

---

## 🛠️ Customization

### Adding New Niches

Edit `backend/netlify/functions/search-stores.js`:

```javascript
const validNiches = ['fashion', 'beauty', 'supplements', 'jewelry', 'fitness'];
```

### Adjusting Quality Scoring

Edit `backend/utils/ai-analyzer.js` → `scoreStoreCopy()` method to change evaluation criteria.

### Custom Outreach Hooks

Edit the AI prompt in `backend/utils/ai-analyzer.js` → `generateOutreachHook()` to change tone and style.

---

## 🐛 Troubleshooting

### "Search failed" Error

**Cause:** Bing may have rate-limited your IP  
**Solution:** Wait 5-10 minutes, reduce max results, try different niche

### "Not a Shopify store" Results

**Cause:** Search returned non-Shopify sites  
**Solution:** Normal - system filters these out automatically

### "Analysis failed" Error

**Cause:** Invalid OpenAI API key or quota exceeded  
**Solution:** Check API key, verify account has credits

### Slow Performance

**Cause:** Processing each store takes 3-5 seconds  
**Solution:** Reduce max results, run during off-peak hours

### No Email Found

**Cause:** Many stores hide contact info  
**Solution:** Use Contact Page link or Instagram DMs

---

## 📊 Sample CSV Output

```csv
URL,Title,Niche,Quality Score,Email,Contact Page,Instagram,Outreach Hook,Offer,Status
https://example.com,Example Store,Fashion,5.5,info@example.com,https://example.com/contact,https://instagram.com/example,"Your product pages list features without outcomes - quick rewrite could boost conversions","Free rewrite of your best-seller page",Not Contacted
```

---

## 🤝 Support & Contributing

### Getting Help

- Check the [Troubleshooting](#troubleshooting) section
- Review Netlify deployment logs
- Test functions individually in Netlify dashboard

### Contributing

This is a production-ready tool. To contribute:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit pull request with clear description

---

## 📄 License

MIT License - Use commercially, modify freely, no warranty provided.

---

## ⚠️ Disclaimer

This software is provided for legitimate business development purposes. Users are solely responsible for their use of this tool and must comply with all applicable laws, including:

- CAN-SPAM Act (US)
- GDPR (EU)
- CASL (Canada)
- Website Terms of Service
- Anti-spam regulations

**The authors assume no liability for misuse.**

---

## 🎯 Roadmap

Potential future features:
- [ ] Google Sheets direct integration
- [ ] LinkedIn company page detection
- [ ] Competitor analysis
- [ ] Email verification service
- [ ] Chrome extension
- [ ] Bulk processing queue
- [ ] Team collaboration features

---

**Built for ethical growth. Use responsibly. 🚀**
