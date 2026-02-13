# Deployment Guide

Complete step-by-step instructions for deploying Shopify Lead Engine to Netlify.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed ([download](https://nodejs.org))
- [ ] Git installed ([download](https://git-scm.com))
- [ ] OpenAI API key ([get here](https://platform.openai.com/api-keys))
- [ ] Netlify account ([sign up free](https://app.netlify.com/signup))
- [ ] GitHub account (optional but recommended)

---

## Method 1: Deploy via Netlify CLI (Recommended)

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd shopify-lead-engine

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### Step 2: Install Netlify CLI

```bash
# Install globally
npm install -g netlify-cli

# Verify installation
netlify --version
```

### Step 3: Login to Netlify

```bash
netlify login
```

This will open your browser. Log in to Netlify and authorize the CLI.

### Step 4: Initialize Your Site

```bash
# From project root
netlify init
```

Follow the prompts:
1. **Create & configure a new site**
2. Choose your team
3. Enter a site name (or leave blank for random)
4. Build command: `cd frontend && npm run build` (auto-detected)
5. Directory to deploy: `frontend/out` (auto-detected)
6. Functions directory: `backend/netlify/functions` (auto-detected)

### Step 5: Set Environment Variables

```bash
# Set your OpenAI API key
netlify env:set OPENAI_API_KEY "sk-your-actual-key-here"
```

### Step 6: Deploy

```bash
# Deploy to production
netlify deploy --prod
```

Wait for the build to complete. You'll get a URL like:
```
https://your-site-name.netlify.app
```

### Step 7: Test Your Deployment

1. Open the URL from step 6
2. Click "Launch Dashboard"
3. Click "⚙️ Settings"
4. Add:
   - **OpenAI API Key**: Your key
   - **API Endpoint**: `https://your-site-name.netlify.app/.netlify/functions`
5. Click "Save Settings"
6. Test by finding leads!

---

## Method 2: Deploy via GitHub

### Step 1: Push to GitHub

```bash
# Initialize git repo (if not done)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/shopify-lead-engine.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access your repos
5. Select your repository

### Step 3: Configure Build Settings

Netlify will auto-detect settings from `netlify.toml`:

- **Build command**: `cd frontend && npm run build`
- **Publish directory**: `frontend/out`
- **Functions directory**: `backend/netlify/functions`

Click "Deploy site"

### Step 4: Add Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
4. Save

### Step 5: Redeploy

Since you added env vars after initial deploy:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

### Step 6: Configure Frontend

Same as Method 1, Step 7.

---

## Method 3: Manual Netlify Drop

### Step 1: Build Locally

```bash
# Install dependencies
cd frontend
npm install

# Build
npm run build

# This creates frontend/out/ directory
```

### Step 2: Prepare Functions

```bash
cd ../backend
npm install

# Package functions
mkdir -p ../deploy/functions
cp -r netlify/functions/* ../deploy/functions/
cp -r utils ../deploy/functions/
```

### Step 3: Deploy via Netlify Drop

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag `frontend/out` folder
3. Wait for deployment
4. Note the URL

### Step 4: Add Functions Manually

This method doesn't support functions easily. **Not recommended** - use Method 1 or 2 instead.

---

## Post-Deployment Configuration

### Required Setup in the App

After deployment, every user needs to:

1. Open your site
2. Navigate to Dashboard
3. Click **Settings**
4. Enter:
   - OpenAI API Key
   - API Endpoint (your Netlify URL + `/.netlify/functions`)
5. Save

Settings are stored in browser localStorage.

### Testing Your Functions

Test each function individually:

```bash
# Test search-stores
curl -X POST https://your-site.netlify.app/.netlify/functions/search-stores \
  -H "Content-Type: application/json" \
  -d '{"niche":"fashion","maxResults":5}'

# Should return: {"success":true,"count":5,"stores":[...]}
```

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI features | `sk-proj-...` |
| `BUILTWITH_API_KEY` | No | Enhanced Shopify detection | `...` |

---

## Troubleshooting Deployment

### Build Fails

**Error**: `Module not found`

**Solution**:
```bash
# Make sure all dependencies are in package.json
cd frontend
npm install
cd ../backend
npm install
```

### Functions Don't Work

**Error**: `500 Internal Server Error`

**Solution**:
1. Check Netlify function logs
2. Verify environment variables are set
3. Test locally with `netlify dev` first

### Frontend Shows But No API

**Error**: API endpoint not configured

**Solution**:
1. Go to Settings in the app
2. Enter: `https://your-actual-site.netlify.app/.netlify/functions`
3. Don't forget the `/.netlify/functions` part!

### CORS Errors

**Error**: `Access-Control-Allow-Origin` error

**Solution**: Already handled in function headers. If persisting:
1. Check you're using correct endpoint URL
2. Ensure no browser extensions blocking requests
3. Check Netlify function logs for actual error

---

## Monitoring & Maintenance

### View Logs

1. Netlify Dashboard → Your Site
2. **Functions** tab
3. Click on any function
4. View logs in real-time

### Usage Limits

**Netlify Free Tier**:
- 125k function requests/month
- 100 hours function runtime/month

**OpenAI**:
- Depends on your plan
- ~$0.10 per 100 stores analyzed (approx)

### Scaling Up

If you hit limits:

1. **Netlify**: Upgrade to Pro ($19/month)
2. **OpenAI**: Add credits to your account
3. **Optimization**: Cache results, batch requests

---

## Custom Domain Setup

Want `leads.yourdomain.com`?

1. Netlify Dashboard → Your Site
2. **Domain settings**
3. **Add custom domain**
4. Follow DNS configuration steps

---

## Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Add secrets via Netlify dashboard only

2. **Rotate API keys regularly**
   - Change OpenAI key every 3-6 months
   - Update in Netlify env vars

3. **Monitor usage**
   - Check OpenAI usage dashboard
   - Set up billing alerts

4. **Rate limiting**
   - Already built into the app
   - Don't remove delays

---

## Updating Your Deployment

### Via CLI

```bash
# Make changes to code
# Commit changes
git add .
git commit -m "Update feature X"

# Deploy
netlify deploy --prod
```

### Via GitHub

Just push to main:
```bash
git push origin main
```

Netlify auto-deploys on push.

---

## Rollback

If deployment breaks:

1. Netlify Dashboard → **Deploys**
2. Find last working deploy
3. Click **⋮** → **Publish deploy**

---

## Complete Deployment Checklist

- [ ] Dependencies installed
- [ ] Code tested locally with `netlify dev`
- [ ] Pushed to GitHub (if using Method 2)
- [ ] Netlify site created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Frontend accessible
- [ ] Settings configured in app
- [ ] Test search function works
- [ ] Test AI analysis works
- [ ] CSV export works
- [ ] All functions responding
- [ ] No console errors

---

**You're ready to generate leads! 🚀**

For questions, check the main [README.md](README.md) or Netlify documentation.
