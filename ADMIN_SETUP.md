# 📱 RATS WARS Mobile Content Manager

## Setup Instructions (One-time only - takes 5 minutes)

### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub.com and log in
2. Click your profile picture → **Settings**
3. Scroll down to **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token (classic)**
6. Name it: `RATS WARS Editor`
7. Check the **repo** checkbox (this gives full repository access)
8. Click **Generate token** at the bottom
9. **IMPORTANT**: Copy the token immediately (it starts with `ghp_`) - you won't see it again!

### Step 2: Configure the Admin Portal

1. Open `admin.html` in your browser (from any device)
2. Fill in the GitHub Connection Setup form:
   - **GitHub Username**: Your GitHub username
   - **Repository Name**: `ratswars` (or whatever your repo is called)
   - **Branch Name**: `claude/space-opera-website-fnVkw` (or your working branch)
   - **Personal Access Token**: Paste the token you copied in Step 1
3. Click **Save Configuration**
4. The portal will automatically load your website content!

### Step 3: Add to Your Phone's Home Screen (Optional but Recommended)

#### iPhone/iPad:
1. Open `admin.html` in Safari
2. Tap the Share button (square with arrow)
3. Tap **Add to Home Screen**
4. Name it "RATS WARS Editor"
5. Tap **Add**

#### Android:
1. Open `admin.html` in Chrome
2. Tap the menu (⋮)
3. Tap **Add to Home screen**
4. Name it "RATS WARS Editor"
5. Tap **Add**

Now you have an app icon on your phone! 🎉

## How to Use

### Editing Characters

1. Open the admin portal (admin.html or your home screen app)
2. Scroll to the character you want to edit
3. **Upload new image**: Click "Upload New Image" and select from your photos
4. **Edit description**: Type directly in the text boxes
5. Click **Publish Changes** at the bottom when done
6. Your website updates automatically! ✨

### How It Works

- Changes are saved directly to your GitHub repository
- Images are uploaded to `/images/characters/`
- Your index.html file is automatically updated
- If you have auto-deployment set up (GitHub Pages, Netlify, etc.), your live website will update within seconds!

## Security Notes

- Your GitHub token is stored in your browser's localStorage (secure)
- The token never leaves your device
- You can regenerate the token anytime from GitHub settings if needed
- Only you can access the admin portal with your token

## Troubleshooting

**"Setup Required" status won't go away**
- Check that all fields are filled in
- Make sure your token starts with `ghp_`
- Verify your GitHub username and repo name are correct

**"Error loading website"**
- Check your branch name is correct
- Make sure the token has `repo` permissions
- Verify you have access to the repository

**Image upload fails**
- Check your internet connection
- Make sure the image file is a valid format (JPG, PNG, GIF)
- Verify your GitHub token is still valid

## Need Help?

If you run into issues, you can:
1. Check the browser console for error messages (F12 or right-click → Inspect)
2. Regenerate your GitHub token and update it in the admin portal
3. Make sure you're on the correct branch

---

Enjoy editing your website from anywhere! 🚀
