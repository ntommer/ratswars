# Serverless Visitor Counter Setup

This guide explains how to set up the serverless visitor counter that tracks ALL visitors (not just authenticated admins).

## Overview

The visitor counter now uses a **serverless function** that:
- ✅ Counts ALL visitors automatically
- ✅ Requires NO authentication from visitors
- ✅ Keeps GitHub token secure (server-side only)
- ✅ Works with free hosting (Netlify/Vercel)

## Setup Instructions

### Option 1: Deploy to Netlify (Recommended - Free)

#### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account (easiest)
3. Click "New site from Git"

#### Step 2: Connect Your Repository
1. Choose "GitHub" as your Git provider
2. Select your `ratswars` repository
3. Netlify will auto-detect the configuration from `netlify.toml`

#### Step 3: Configure Build Settings
Netlify should auto-detect:
- **Build command**: Leave empty (static site)
- **Publish directory**: `.` (current directory)
- **Functions directory**: `netlify/functions` (auto-detected)

#### Step 4: Set Environment Variable
This is the most important step!

1. In your Netlify site dashboard, go to **Site settings** > **Environment variables**
2. Click **Add a variable**
3. Add the following:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Your GitHub Personal Access Token (the one from admin.html)
   - **Scopes**: Select all deploy contexts (Production, Deploy Previews, Branch deploys)
4. Click **Save**

**Creating a GitHub Token (if you don't have one):**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Netlify Visitor Counter"
4. Select scope: `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`) - you won't see it again!

#### Step 5: Deploy
1. Click **Deploy site**
2. Wait for the build to complete (~1-2 minutes)
3. Your site will be live at `https://[random-name].netlify.app`

#### Step 6: Test the Counter
1. Visit your new Netlify URL
2. Check the footer - you should see the visitor counter
3. Refresh the page - the count should increment!
4. Open the browser console (F12) - you should see: `Visitor count updated to X`

#### Step 7: Custom Domain (Optional)
1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Follow instructions to set up your domain

### Option 2: Deploy to Vercel (Alternative - Also Free)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Convert Netlify Function to Vercel
The current setup uses Netlify Functions. For Vercel, you'll need to:
1. Move `netlify/functions/increment-visitor.js` to `api/increment-visitor.js`
2. Update the function format slightly (Vercel uses different syntax)

**Let me know if you want to use Vercel instead, and I'll convert the function for you!**

## How It Works

### Architecture

```
Visitor's Browser
    ↓
[Website loads]
    ↓
script.js calls: POST /api/increment-visitor
    ↓
[Netlify Serverless Function]
    ↓
Uses GITHUB_TOKEN (from environment)
    ↓
Increments visitor-count.json on GitHub
    ↓
Returns new count to browser
    ↓
Display updates in footer
```

### Security Features

1. **GitHub Token Never Exposed**:
   - Token stored in Netlify environment variables
   - Never sent to user's browser
   - Can't be stolen from client-side code

2. **Server-Side Execution**:
   - Function runs on Netlify's servers
   - Only returns the new count to users
   - No authentication required from visitors

3. **CORS Enabled**:
   - Function allows requests from any origin
   - Works even if deployed on custom domain

## File Structure

```
ratswars/
├── netlify.toml                     # Netlify configuration
├── netlify/
│   └── functions/
│       └── increment-visitor.js     # Serverless function
├── package.json                     # Node dependencies
├── script.js                        # Updated to call serverless API
└── visitor-count.json              # Counter data (in repo)
```

## Troubleshooting

### Counter Not Incrementing

**Check Browser Console** (F12):
- Should see: `Visitor count updated to X`
- If you see an error, read the message

**Common Issues**:

1. **`Server configuration error`**
   - The `GITHUB_TOKEN` environment variable is not set
   - Go to Netlify → Site settings → Environment variables
   - Make sure `GITHUB_TOKEN` is added

2. **`Failed to increment visitor count`**
   - Check if the GitHub token has `repo` permissions
   - Try regenerating the token on GitHub

3. **`404 Not Found`**
   - Function deployment failed
   - Check Netlify deploy logs
   - Make sure `netlify/functions/increment-visitor.js` exists

4. **`403 Forbidden` from GitHub**
   - Token doesn't have write access to the repo
   - Generate a new token with `repo` scope

### Checking Function Logs

1. Go to Netlify dashboard
2. Click **Functions** in the sidebar
3. Click on `increment-visitor`
4. Click **Function log** to see execution logs
5. Look for errors or successful executions

### Local Testing

To test the function locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install dependencies
npm install

# Set environment variable (temporary)
export GITHUB_TOKEN=ghp_your_token_here

# Run local dev server
netlify dev
```

Then visit `http://localhost:8888` - the counter should work!

## Reverting to Old System

If you want to go back to the admin-only counter:

1. In `script.js`, replace the `incrementVisitorCount()` function with the old version
2. The display (`fetchAndDisplayCount()`) still works the same way
3. You can keep both systems if you want!

## Cost

- **Netlify Free Tier**:
  - 100GB bandwidth/month
  - 125K function invocations/month
  - More than enough for most sites!

- **Vercel Free Tier**:
  - 100GB bandwidth/month
  - 100K function invocations/month

**Example**: If you get 1,000 visitors/day:
- 30,000 visitors/month
- Well within free tier limits!

## Next Steps

After deployment:
1. Share your Netlify URL with others
2. Watch the counter increment for real visitors!
3. Consider adding analytics for more detailed tracking

## Support

If you run into issues:
1. Check Netlify deploy logs
2. Check function logs
3. Check browser console
4. Verify environment variables are set correctly

**Need help?** Check [Netlify's documentation](https://docs.netlify.com/functions/overview/) or open an issue on GitHub.
