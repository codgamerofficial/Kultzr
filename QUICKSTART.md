# ⚡ KULTZR Quick Start Guide

Get your streetwear e-commerce platform running in 10 minutes!

---

## 🚀 3-Minute Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd kultzr

# Install dependencies
npm install
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your Supabase credentials
# Get these from: https://supabase.com → Project → Settings → API
```

**Minimum required variables:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Start Development

```bash
# Start the web app
npm run dev

# Open browser to: http://localhost:3000
```

**🎉 You're live! Start customizing your store.**

---

## 📱 Mobile App (Optional)

```bash
# Navigate to mobile app
cd kultzr-mobile

# Install dependencies
npm install

# Start mobile app
npm start

# Open in Expo Go app or emulator
```

---

## 🗄️ Backend Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Create project: `kultzr`
3. Get your project URL and API key
4. Update `.env.local` with your credentials

### 2. Setup Database

1. In Supabase dashboard → SQL Editor
2. Copy and run the SQL from `supabase/SETUP.md`
3. Verify tables are created

### 3. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-id

# Deploy functions
supabase functions deploy server
```

---

## 🎨 Customization (5 minutes)

### 1. Brand Colors

Edit `src/index.css` and update the CSS custom properties:

```css
:root {
  --kultzr-primary: #0B0B0D;      /* Your brand primary */
  --kultzr-accent-neon: #A4FF00;  /* Your brand accent */
  --kultzr-accent-orange: #FF6A00; /* Your brand secondary */
}
```

### 2. App Name

Update `package.json`:
```json
{
  "name": "your-brand-store",
  "displayName": "Your Brand"
}
```

### 3. Product Data

Replace mock products in `src/App.tsx`:
```javascript
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'YOUR PRODUCT NAME',
    price: 4999,
    image: 'your-product-image-url',
    // ... more fields
  }
];
```

---

## 🛒 Add Products (2 minutes)

### Option 1: Admin Upload
1. Click the orange "+" button in the app
2. Fill product details
3. Upload images
4. Save

### Option 2: Printful Sync
1. Setup Printful account
2. Create products in Printful
3. Use the sync feature in admin panel

---

## 🚀 Deploy to Production

### Web App (Vercel - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

**Your site will be live at:** `https://your-project.vercel.app`

### Mobile App (Expo - Free)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for iOS/Android
eas build --profile preview --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 💡 Pro Tips

### Performance
- Use optimized images (WebP format)
- Enable Vercel's automatic optimization
- Use Supabase CDN for assets

### Analytics
```bash
# Add Google Analytics
echo "VITE_GA_ID=GA_TRACKING_ID" >> .env.local
```

### SEO
- Update `index.html` meta tags
- Add sitemap.xml
- Configure custom domain

---

## 🆘 Need Help?

### Common Issues

**"Cannot find module" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection failed:**
- Check environment variables
- Verify project URL format
- Ensure database schema is created

**Mobile app won't start:**
```bash
cd kultzr-mobile
npx expo start -c
```

### Resources
- [📖 Full Documentation](KULTZR-README.md)
- [🚀 Deployment Guide](DEPLOYMENT.md)
- [🔌 Supabase Docs](https://supabase.com/docs)
- [📱 Expo Docs](https://docs.expo.dev)

---

## 🎯 Next Steps

1. **Customize your brand** (colors, logo, name)
2. **Add real products** (via admin or Printful)
3. **Setup payment processing** (Razorpay/Stripe)
4. **Configure email notifications** (SendGrid/Resend)
5. **Launch your store!** 🚀

---

## 💰 Free Tier Costs

- **Supabase:** Free (perfect for starting)
- **Vercel:** Free (unlimited projects)
- **Expo:** Free (build & publish)
- **Printful:** Free (pay per order only)

**Total: $0/month to start!** 🎉

---

*Ready to launch your streetwear empire? Let's go! 👑*