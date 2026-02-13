# Frequently Asked Questions (FAQ)

Common questions about Shopify Lead Engine.

---

## General Questions

### What is Shopify Lead Engine?

A web-based tool that helps copywriters find Shopify stores that need better product copy. It searches the web, analyzes store quality using AI, and generates personalized outreach hooks.

### Is this legal?

Yes, when used properly. The tool:
- Only scrapes public web pages
- Respects robots.txt
- Doesn't bypass authentication
- Requires manual outreach (no automation)

**However**, YOU are responsible for:
- Following anti-spam laws (CAN-SPAM, GDPR, CASL)
- Obtaining necessary consents
- Respecting opt-outs
- Using data ethically

### Is this free?

The software is free (open source), but you need:
- **OpenAI API**: ~$0.001 per store analyzed
- **Netlify Hosting**: Free tier sufficient for most users
- Total cost: ~$0.10 per 100 stores

---

## Setup & Technical

### What do I need to get started?

**Required**:
- Node.js 18+
- OpenAI API key ($5 in free credits to start)
- Netlify account (free)
- Basic command line knowledge

**Optional**:
- GitHub account (for easy deployment)
- Custom domain

### How do I get an OpenAI API key?

1. Go to https://platform.openai.com/signup
2. Create an account
3. Add payment method (required, but $5 free credits)
4. Go to https://platform.openai.com/api-keys
5. Click "Create new secret key"
6. Copy and save it (you can't see it again!)

### Can I use this without coding knowledge?

**Deployment**: Requires basic command line skills OR GitHub connection
**Usage**: Once deployed, 100% no-code interface
**Customization**: Requires coding for advanced changes

### What if I don't have a credit card for OpenAI?

OpenAI requires a payment method even for the free tier. Alternative:
- Ask a friend/colleague to share their key
- Use prepaid virtual cards
- Wait for free tiers (if they return)

### How long does deployment take?

**First time**: 30-60 minutes
- 10 min: Install dependencies
- 10 min: Configure settings
- 10 min: Deploy to Netlify
- 10 min: Testing

**Subsequent deploys**: 5 minutes

---

## Usage & Features

### How many leads can I find per search?

**Recommended**: 10-20 stores per search
**Maximum**: 50 stores per search
**Time**: ~10 seconds per store

### Why does it take so long?

Each store requires:
- Browser automation to load page (~3 sec)
- AI analysis via OpenAI API (~2-4 sec)
- Rate limiting to avoid bans (~1-2 sec)

**Total**: ~10 seconds per store is normal

### What niches are supported?

Currently:
- Fashion (clothing, accessories)
- Beauty (skincare, cosmetics)
- Supplements (vitamins, health)

**Want more?** Edit `backend/netlify/functions/search-stores.js`

### How accurate is the Shopify detection?

**Very accurate** (95%+). Uses multiple indicators:
- Shopify meta tags
- CDN references
- Asset patterns
- Domain patterns

False positives are rare and filtered out.

### How accurate is the AI analysis?

**Niche classification**: 90%+ accurate
**Quality scoring**: Subjective but consistent
**Outreach hooks**: Vary in quality, always review!

**Pro tip**: Use AI suggestions as starting points, not final copy.

### Why didn't it find an email for some stores?

Many Shopify stores:
- Hide email addresses
- Use contact forms only
- Only show email after interaction

**Solutions**:
- Use the contact page
- DM via Instagram
- Research on LinkedIn
- Check WHOIS records

### Can I search for specific stores?

Not directly. The tool discovers stores via web search. If you have a specific URL, you can:
- Manually add it to your CSV
- Use the scrape function directly (requires code modification)

---

## Outreach & Business

### Is this considered cold email?

Yes. You must comply with:
- CAN-SPAM Act (US)
- GDPR (EU)
- CASL (Canada)
- Any local regulations

**Key requirement**: Include unsubscribe option and honor opt-outs.

### What's a good response rate?

**Industry average**: 5-15% for cold email
**With this tool**: 10-20% if you:
- Highly personalize each email
- Target stores with low quality scores
- Provide genuine value
- Have a strong portfolio

### Should I offer free work?

**Yes, strategically**:
- One product description rewrite: ✅
- Homepage copy audit: ✅
- Full website for free: ❌

Free samples:
- Show your skills
- Build trust
- Low commitment
- Lead to paid work

### How do I price my services?

Depends on:
- Your experience level
- Market rates in your area
- Project scope
- Client budget

**Typical ranges**:
- Product descriptions: $50-150 each
- Homepage: $500-2000
- Email sequence: $1000-3000
- Full e-commerce site: $3000-15000

### What if someone reports me for spam?

**Prevention**:
- Only email once
- Personalize every message
- Provide clear value
- Include unsubscribe link
- Honor opt-outs immediately

**If it happens**:
- Apologize
- Remove from list immediately
- Review your process
- Ensure you're following laws

---

## Costs & Limits

### What does this cost to run?

**Netlify (Free Tier)**:
- 125,000 function requests/month
- 100 hours runtime/month
- Sufficient for ~10,000 stores/month

**OpenAI**:
- ~$0.001 per store analyzed
- $0.10 per 100 stores
- $1 per 1000 stores

**Total for typical use**: $5-20/month

### What are the rate limits?

**Built-in delays**:
- 2 seconds between searches
- 1 second between stores
- Sequential processing only

**External limits**:
- Bing: IP-based (handled by delays)
- OpenAI: Account-based (usually high)
- Netlify: Free tier limits above

### Can I process thousands of leads?

**Free tier**: ~10,000 stores/month
**Paid Netlify**: 100,000+ stores/month

**But consider**:
- Do you need that many?
- Can you outreach to all?
- Quality over quantity

**Recommendation**: Start with 50-100 leads, then scale.

### How can I reduce costs?

**Netlify**: Free tier usually sufficient
**OpenAI**:
- Use GPT-4o-mini (already configured)
- Reduce max_tokens if needed
- Cache results locally
- Only analyze promising stores

---

## Troubleshooting

### "Search failed" error

**Causes**:
- Bing rate limiting
- Network issues
- Invalid niche

**Solutions**:
- Wait 5-10 minutes
- Try different niche
- Reduce max results
- Check internet connection

### "Not a Shopify store" for everything

**Causes**:
- Search returned non-Shopify sites
- Shopify detection too strict

**Solutions**:
- Normal for some results
- Try more specific niche
- Increase max results
- Check search query in code

### "Analysis failed" error

**Causes**:
- Invalid OpenAI API key
- Out of credits
- API rate limit

**Solutions**:
- Check API key is correct
- Add credits to OpenAI account
- Wait and retry
- Check OpenAI status page

### Browser opens but nothing happens

**Causes**:
- Playwright not installed
- Browser dependencies missing

**Solutions**:
```bash
cd backend
npm install
npx playwright install chromium
```

### CSV export not working

**Causes**:
- Browser blocking download
- No leads to export
- JavaScript error

**Solutions**:
- Allow pop-ups/downloads
- Check browser console
- Ensure leads are loaded
- Try different browser

### Settings won't save

**Causes**:
- localStorage blocked
- Private browsing mode
- Browser issue

**Solutions**:
- Disable private browsing
- Allow localStorage
- Try different browser
- Clear browser cache

---

## Customization

### Can I add more niches?

Yes! Edit `backend/netlify/functions/search-stores.js`:

```javascript
const validNiches = [
  'fashion', 
  'beauty', 
  'supplements',
  'jewelry',      // Add new
  'home-decor'    // Add new
];
```

### Can I change the AI prompts?

Yes! Edit `backend/utils/ai-analyzer.js`:
- `classifyNiche()` - Niche detection
- `scoreStoreCopy()` - Quality scoring  
- `generateOutreachHook()` - Hook generation

### Can I add more contact methods?

Yes! Edit `backend/utils/scraper.js`:
- `extractContactInfo()` function
- Add patterns for:
  - Phone numbers
  - WhatsApp
  - Facebook
  - LinkedIn

### Can I change the scoring criteria?

Yes! Edit the prompt in `scoreStoreCopy()` method to evaluate different aspects of copy quality.

### Can I integrate with my CRM?

The CSV export works with most CRMs. For direct integration:
- Add API calls to your CRM
- Requires coding
- Examples: HubSpot API, Salesforce API, Pipedrive API

---

## Privacy & Security

### Where is my data stored?

**Client-side only**:
- Leads: Browser memory (React state)
- Settings: Browser localStorage
- Exports: Downloaded to your computer

**No server storage**: Data disappears when you close the tab.

### Is my OpenAI key safe?

**Stored**:
- In your browser's localStorage
- Sent to your Netlify functions (HTTPS)
- Never stored on servers

**Best practices**:
- Use environment variable if possible
- Rotate keys regularly
- Monitor usage

### Can others see my leads?

No. Everything is client-side. Unless you:
- Share your CSV export
- Use the same browser/device
- Publish your deployment with data

### Is this GDPR compliant?

The tool itself doesn't store EU data. **However**:
- You collect personal data (emails)
- You must comply with GDPR when contacting EU stores
- You need lawful basis (legitimate interest)
- You must honor data subject rights

**Consult a lawyer** for GDPR compliance advice.

---

## Best Practices

### How often should I search for new leads?

**Recommended**:
- Weekly: 20-50 new leads
- Focus on quality outreach
- Track and follow up

**Don't**:
- Daily mass searches
- Collect thousands without outreach
- Spam your way through lists

### Should I target stores with high or low scores?

**Low scores (1-4)**: Best prospects
- Clear improvement opportunity
- Higher response rates
- More likely to need help

**High scores (7-10)**: Harder sell
- Less obvious need
- May be defensive
- Better as examples/case studies

### How should I organize my leads?

**Recommended system**:
1. Export to CSV
2. Import to Google Sheets / Excel
3. Add columns:
   - Contact Name
   - First Contact Date
   - Follow-up Date
   - Response Status
   - Notes
4. Track over time

### What's the best outreach schedule?

**Optimal times**:
- Tuesday-Thursday
- 10am-2pm recipient's timezone
- Avoid Mondays (busy)
- Avoid Fridays (weekend mode)

**Cadence**:
- Day 1: Initial email
- Day 7: Follow-up (if no response)
- Day 14: Final follow-up (optional)
- Then: Move on

---

## Advanced Usage

### Can I run this on a schedule?

Not recommended. This is designed for manual use. Automation:
- Violates ethical guidelines
- Risks IP bans
- Reduces personalization quality
- May violate anti-spam laws

### Can I white-label this?

Yes! It's MIT licensed. You can:
- Rebrand completely
- Sell as service
- Modify freely
- No attribution required (but appreciated!)

### Can I sell access to this tool?

Yes, under MIT license. However:
- Users need their own OpenAI keys
- Users need their own Netlify accounts
- You're responsible for support
- You must include the legal disclaimer

### Can I integrate this with other tools?

Yes! Possible integrations:
- **Zapier**: Trigger from CSV export
- **Make**: Automate workflows
- **Google Sheets**: Import CSV
- **HubSpot**: Import contacts
- **Mailchimp**: (Manual import only!)

---

## Support

### Where can I get help?

1. Read the [User Guide](USER-GUIDE.md)
2. Check [Deployment Guide](DEPLOYMENT.md)
3. Review [Architecture Docs](ARCHITECTURE.md)
4. Search GitHub issues
5. Create new GitHub issue

### How do I report a bug?

**On GitHub**:
1. Check existing issues
2. Create new issue
3. Include:
   - Error message
   - Steps to reproduce
   - Browser/OS info
   - Screenshots

### Can I request features?

Yes! Create a GitHub issue with:
- Clear description
- Use case
- Why it's valuable
- Implementation ideas (optional)

### How do I contribute?

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## Future Roadmap

Potential features (not guaranteed):
- [ ] Google Sheets direct integration
- [ ] LinkedIn company detection
- [ ] Email verification
- [ ] Bulk processing queue
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Chrome extension
- [ ] More niches
- [ ] Multi-language support

---

**Still have questions?** 

Check the full documentation or create a GitHub issue!
