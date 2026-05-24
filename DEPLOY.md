# AI Brand Studio — Deployment Guide

## Quick Deploy (Pick One)

---

### Option 1: Vercel (Recommended — 30 seconds)

1. Go to **[vercel.com](https://vercel.com)**
2. Sign up / Log in with GitHub
3. Click **"Add New..." → Import Repository**
4. Upload this `www/` folder as a repo (or drag & drop the folder at [vercel.com/new](https://vercel.com/new))
5. Vercel auto-detects static HTML — click **Deploy**
6. Get your **shareable .vercel.app link** instantly

**No config needed** — `vercel.json` is already in the folder.

---

### Option 2: Netlify

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag the entire `www/` folder onto the page
3. Done — get your **Netlify link immediately**

**No config needed** — `netlify.toml` is already in the folder.

---

### Option 3: GitHub Pages (Free Forever)

1. Push `www/` to a GitHub repo
2. Go to **Settings → Pages**
3. Select the branch containing `www/`
4. Get `username.github.io/repo-name` link

---

## File Structure

```
www/
├── index.html          ← Homepage
├── demo.html           ← VŌID Case Study
├── services.html       ← Service deep-dive
├── pricing.html        ← Subscription tiers
├── contact.html        ← Client intake form
├── css/
│   └── style.css       ← Dark architectural styling
├── js/
├── demo_img/           ← All VŌID mockup PNGs
├── img/
├── vercel.json         ← Vercel config
├── netlify.toml        ← Netlify config
└── _redirects          ← Netlify redirect rules
```

---

## Preview Locally

```bash
cd www
python3 -m http.server 8080
# Open http://localhost:8080
```

---

## Custom Domain

Both Vercel and Netlify let you attach a custom domain (e.g. `aibrand.studio`) for free in their free tiers.

---