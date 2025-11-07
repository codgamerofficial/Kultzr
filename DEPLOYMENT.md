# 🚀 KULTZR Deployment Guide

Complete deployment guide for KULTZR streetwear e-commerce platform (Web + Mobile).

---

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free)
- Printful account (free, optional)
- Vercel account (free, for web)
- Expo account (free, for mobile)

---

## 🌐 Web App Deployment (Vercel)

### 1. Setup Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your actual values
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - etc.
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
# ... add all other env vars
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Deploy

**Your site will be live at:** `https://your-project-name.vercel.app`

### 3. Custom Domain (Optional)

1. Go to Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

---

## 📱 Mobile App Deployment (Expo)

### 1. Setup EAS Build

```bash
# Install EAS CLI globally
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure
```

### 2. Environment Configuration

Create `kultzr-mobile/app.config.js`:

```javascript
export default {
  expo: {
    // ... existing config
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "kultzr-mobile-project"
      }
    }
  }
};
```

### 3. Build for Different Platforms

#### Development Build
```bash
# Start development server
cd kultzr-mobile
npm start

# Build for internal testing
eas build --profile development --platform all
```

#### Preview Build (for testing)
```bash
# Build for TestFlight (iOS) and Play Store testing (Android)
eas build --profile preview --platform all
```

#### Production Build
```bash
# Build for App Store and Google Play
eas build --profile production --platform all
```

### 4. Submit to App Stores

#### iOS (App Store)
```bash
# Submit to TestFlight
eas submit --platform ios

# For App Store Connect
eas submit --platform ios --type app-store
```

#### Android (Google Play)
```bash
# Submit to Google Play Store
eas submit --platform android
```

---

## 🗄️ Supabase Backend Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name: `kultzr`
4. Set database password (save this!)
5. Choose region (closest to your users)
6. Click "Create new project"

### 2. Database Setup

1. In Supabase dashboard, go to SQL Editor
2. Run the setup script from `supabase/SETUP.md`
3. Verify all tables are created:
   - `products`
   - `product_variants`
   - `orders`
   - `user_profiles`
   - `wishlists`
   - `design_uploads`
   - `printful_webhooks`

### 3. Edge Functions Deployment

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Deploy Edge Functions
supabase functions deploy server

# Set environment variables
supabase secrets set PRINTFUL_API_KEY=your_printful_api_key
supabase secrets set PRINTFUL_STORE_ID=your_store_id
```

### 4. Configure Authentication

1. In Supabase dashboard → Authentication → Settings
2. Configure:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`
3. Enable providers:
   - Email (default)
   - Google (optional)
   - Apple (optional)

---

## 🛒 Printful Integration

### 1. Create Printful Account

1. Go to [printful.com](https://printful.com)
2. Create account and verify email
3. Go to Stores → API → Create API Key
4. Copy your API key

### 2. Setup Product Sync

1. In Printful, create your products or import designs
2. Get the sync product ID from URL: `/dashboard/stores/SYNC_PRODUCT_ID`
3. Use the admin upload feature to sync products

### 3. Webhook Configuration

1. In Printful dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-project-id.supabase.co/functions/v1/server/webhooks/printful`
3. Select events:
   - Order created
   - Order shipped
   - Order delivered
   - Order failed
   - Stock updated

---

## 💳 Payment Integration

### Razorpay (India)

1. Go to [razorpay.com](https://razorpay.com)
2. Create account and complete KYC
3. Get API keys from dashboard
4. Add to environment variables

### Stripe (Global)

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Get API keys from dashboard
4. Add to environment variables

---

## 🔧 Environment Variables Reference

### Web App (.env.local)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
PRINTFUL_API_KEY=your_printful_key
PRINTFUL_STORE_ID=your_store_id
RAZORPAY_KEY_ID=your_razorpay_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
PRODUCTION_URL=https://yourdomain.com
```

### Mobile App (expo secrets)
```bash
eas secret:create --scope project --name SUPABASE_URL --value your_supabase_url
eas secret:create --scope project --name SUPABASE_ANON_KEY --value your_anon_key
# ... add other secrets
```

### Supabase Edge Functions
```bash
supabase secrets set PRINTFUL_API_KEY=your_printful_key
supabase secrets set PRINTFUL_STORE_ID=your_store_id
supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy KULTZR

on:
  push:
    branches: [ main ]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: cd kultzr-mobile && npm ci
      
      - name: Build and submit
        run: |
          cd kultzr-mobile
          eas build --profile production --platform all --non-interactive
          eas submit --profile production --platform all --non-interactive
        env:
          EAS_BUILD_PROFILE: production
          EAS_SUBMIT_PROFILE: production
```

---

## 🎯 Production Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Edge functions deployed
- [ ] Authentication working
- [ ] Payment integration tested
- [ ] Printful webhook configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Mobile app submitted to stores

### Testing
- [ ] User registration/login
- [ ] Product browsing and search
- [ ] Add to cart and checkout
- [ ] Payment processing
- [ ] Order confirmation
- [ ] Admin product upload
- [ ] Printful sync
- [ ] Mobile app on iOS/Android

### Post-Launch
- [ ] Monitor Supabase usage
- [ ] Monitor payment processing
- [ ] Monitor Printful webhooks
- [ ] Set up analytics
- [ ] Configure error tracking
- [ ] Set up backup strategy

---

## 💰 Estimated Costs

### Free Tier (Perfect for starting)
- **Supabase:** Free (500MB DB, 1GB storage)
- **Vercel:** Free (unlimited projects)
- **Expo:** Free (build apps, publish updates)
- **Printful:** Free (pay per order only)

**Total: $0/month** to get started! 🎉

### Paid Tier (When scaling)
- **Supabase Pro:** $25/month (8GB DB, 100GB storage)
- **Vercel Pro:** $20/month (team features, analytics)
- **Expo Priority:** $29/month (faster builds, support)

**Total: ~$75/month** for a growing business

---

## 🆘 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
```bash
npm run build -- --mode production
```

**Supabase connection issues:**
- Check environment variables
- Verify project ID is correct
- Ensure RLS policies are set

**Mobile app won't start:**
```bash
cd kultzr-mobile
npx expo start -c
```

**Printful sync not working:**
- Verify API key is correct
- Check webhook URL is accessible
- Review edge function logs

### Get Help

- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [Printful API Documentation](https://developers.printful.com)

---

## 🎉 You're Live!

Once deployment is complete, you'll have:

✅ **Professional streetwear e-commerce website**  
✅ **Native iOS & Android mobile app**  
✅ **Automated dropshipping with Printful**  
✅ **Secure payment processing**  
✅ **Admin dashboard for product management**  
✅ **Real-time order tracking**  
✅ **Complete design system**  
✅ **Production-ready infrastructure**  

**Your customers can now shop for your streetwear brand anywhere, anytime!** 🚀

---

*Built with ❤️ for streetwear culture*