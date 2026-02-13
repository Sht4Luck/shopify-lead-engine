# Quick Start Guide

Get up and running in 5 minutes.

---

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- Git ([download](https://git-scm.com))
- OpenAI API key ([get one](https://platform.openai.com/api-keys))

---

## Local Development (5 Steps)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd shopify-lead-engine
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 3. Start Development Server

```bash
cd backend
netlify dev
```

This starts:
- Frontend: http://localhost:8888
- API: http://localhost:8888/.netlify/functions

### 4. Open in Browser

```
http://localhost:8888
```

### 5. Configure in App

1. Click "Launch Dashboard"
2. Click "⚙️ Settings"
3. Add:
   - **OpenAI API Key**: Your key
   - **API Endpoint**: `http://localhost:8888/.netlify/functions`
4. Save and test!

---

## Production Deployment (3 Steps)

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
netlify login
```

### 2. Initialize Site

```bash
netlify init
# Follow prompts, accept defaults
```

### 3. Deploy

```bash
netlify deploy --prod
```

Get your live URL and you're done! 🚀

---

## File Structure

```
shopify-lead-engine/
├── backend/
│   ├── netlify/functions/     # API endpoints
│   ├── utils/                 # Scraping & AI logic
│   └── package.json
├── frontend/
│   ├── pages/                 # Next.js pages
│   ├── styles/                # Tailwind CSS
│   └── package.json
├── docs/                      # Documentation
├── netlify.toml              # Deployment config
└── README.md
```

---

## Testing Checklist

After deployment, verify:

- [ ] Landing page loads
- [ ] Dashboard accessible
- [ ] Settings can be saved
- [ ] Search function works
- [ ] Store scraping works
- [ ] AI analysis works
- [ ] CSV export works
- [ ] No console errors

---

## Common Issues

**"Module not found"**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**"API endpoint not configured"**
- Go to Settings
- Enter: `https://your-site.netlify.app/.netlify/functions`
- Save

**"OpenAI API error"**
- Check API key is correct
- Verify you have credits
- Check usage limits

---

## Next Steps

1. Read the [User Guide](docs/USER-GUIDE.md)
2. Review [Legal Disclaimer](docs/LEGAL.md)
3. Check [Architecture Docs](docs/ARCHITECTURE.md)
4. Start finding leads!

---

**Need help?** Check the full [README.md](README.md) or [Deployment Guide](docs/DEPLOYMENT.md).
