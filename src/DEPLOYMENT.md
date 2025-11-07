# KULTZR - Complete Deployment Guide
## From Zero to Production in 60 Minutes

---

## 🎯 Overview

This guide will take you from setup to a fully deployed streetwear platform with:
- ✅ Live website (React)
- ✅ Mobile app (React Native)  
- ✅ Backend (Supabase)
- ✅ Dropshipping (Printful)
- ✅ Payments (Razorpay/Stripe)

---

## ⏱️ Quick Start Timeline

- **0-15 min:** Supabase setup & database
- **15-25 min:** Printful integration
- **25-35 min:** Deploy web app
- **35-50 min:** Configure mobile app
- **50-60 min:** Testing & launch

---

## 📋 Prerequisites

### Required Accounts (All Free to Start)

1. **Supabase** - [supabase.com](https://supabase.com)
   - ✅ Free tier: 500MB database, 1GB storage
   - ✅ Credit card NOT required

2. **Printful** - [printful.com](https://www.printful.com/)
   - ✅ No monthly fees
   - ✅ Pay per order only

3. **Vercel** - [vercel.com](https://vercel.com) (for web)
   - ✅ Free tier: Unlimited projects
   - ✅ Auto SSL, CDN included

4. **Expo** - [expo.dev](https://expo.dev) (for mobile)
   - ✅ Free tier: Build apps
   - ✅ TestFlight/PlayStore ready

5. **GitHub** - [github.com](https://github.com)
   - ✅ Free tier: Unlimited repos
   - ✅ Used for deployment

### Optional (for payments)

6. **Razorpay** - [razorpay.com](https://razorpay.com) (India)
7. **Stripe** - [stripe.com](https://stripe.com) (Global)

---

## 🗄️ STEP 1: Supabase Setup (15 mins)

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project:
   - Name: `kultzr`
   - Database Password: (save this!)
   - Region: Closest to your users
   - Plan: Free

### 1.2 Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Create new query
3. Copy entire contents from `/supabase/SETUP.md`
4. Run the query (⚡ Run button)
5. Verify tables created: `products`, `orders`, `user_profiles`, etc.

**Expected result:** 7 tables + indexes + RLS policies

### 1.3 Storage Buckets

1. Go to **Storage** in dashboard
2. Create bucket: `product-images`
   - Public: ✅ Yes
   - File size limit: 5MB
3. Create bucket: `design-uploads`
   - Public: ❌ No
   - File size limit: 10MB
4. Create bucket: `order-receipts`
   - Public: ❌ No
   - File size limit: 2MB

### 1.4 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (save them!):
   ```
   Project URL: https://xxxxx.supabase.co
   Project ID: xxxxx
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (SECRET!)
   ```

### 1.5 Update Your Code

Edit `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'xxxxx'; // Your project ID
export const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your anon key
```

---

## 🖨️ STEP 2: Printful Setup (10 mins)

### 2.1 Create Account

1. Go to [printful.com](https://www.printful.com/)
2. Sign up (free)
3. Complete business profile
4. Choose plan: **Starter** (free)

### 2.2 Get API Key

1. Go to **Settings** → **API**
2. Click "Enable API Access"
3. Create API key
4. Copy the key (save it!)
5. Note your Store ID (also on API page)

### 2.3 Configure Webhooks

1. In Printful, go to **Settings** → **Webhooks**
2. Add new webhook:
   ```
   URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-891a09ab/webhooks/printful
   
   Events to enable:
   ✅ package_shipped
   ✅ package_returned  
   ✅ order_failed
   ✅ stock_updated
   ```
3. Save webhook

### 2.4 Create Sample Product (Optional)

1. Go to **Stores** → **Add Product**
2. Choose product type (e.g., "Unisex Hoodie")
3. Upload design/mockup
4. Set prices
5. Publish
6. Note the **Sync Product ID** (you'll use this later)

### 2.5 Set Environment Variables

In your terminal:

```bash
# Navigate to project
cd your-project-folder

# Set Printful secrets (requires Supabase CLI)
supabase secrets set PRINTFUL_API_KEY=your_printful_api_key
supabase secrets set PRINTFUL_STORE_ID=your_store_id
```

---

## 🌐 STEP 3: Deploy Web App (10 mins)

### 3.1 Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - KULTZR streetwear platform"

# Create GitHub repo
# Go to github.com → New Repository → kultzr-web
# Copy the remote URL

# Push code
git remote add origin https://github.com/YOUR_USERNAME/kultzr-web.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Select `kultzr-web` repository
5. Configure:
   - Framework Preset: **Vite** (or auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click **"Deploy"**

**Wait 2-3 minutes...**

✅ Your website is now live!

Example: `https://kultzr-web.vercel.app`

### 3.3 Add Environment Variables

1. In Vercel dashboard → Your project
2. Go to **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = your_anon_key
   ```
4. Redeploy (trigger with a new commit or manual redeploy)

---

## 📱 STEP 4: Mobile App Setup (15 mins)

### 4.1 Install Expo CLI

```bash
npm install -g eas-cli
npm install -g expo-cli
```

### 4.2 Create Mobile App

```bash
# Create new Expo app
npx create-expo-app kultzr-mobile
cd kultzr-mobile

# Install dependencies (from REACT-NATIVE-SETUP.md)
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install zustand
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install expo-image expo-image-picker expo-font
```

### 4.3 Copy Components

Copy from your web project:
- `/REACT-NATIVE-SETUP.md` - Follow this guide
- Create folder structure as shown
- Implement screens and components
- Configure theme with KULTZR colors

### 4.4 Configure Supabase

Edit `src/services/supabase.ts`:

```typescript
const supabaseUrl = 'https://xxxxx.supabase.co';
const supabaseAnonKey = 'your_anon_key';
```

### 4.5 Build & Test

```bash
# Start development server
npx expo start

# Scan QR code with Expo Go app on your phone
# Test the app
```

### 4.6 Production Build

```bash
# Initialize EAS
eas init

# Configure builds
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Wait 10-20 minutes for builds...
```

---

## 🚀 STEP 5: Deploy Edge Functions (5 mins)

### 5.1 Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

### 5.2 Login & Link

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_id
```

### 5.3 Deploy

```bash
# Deploy edge function
supabase functions deploy server

# Verify
curl https://your_project_id.supabase.co/functions/v1/make-server-891a09ab/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-07T..."
}
```

---

## 🧪 STEP 6: Testing (10 mins)

### Test 1: Product Sync

```bash
# Get a Printful sync product ID from your dashboard
# Then call the sync endpoint

curl -X POST \
  https://your_project_id.supabase.co/functions/v1/make-server-891a09ab/products/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"sync_product_id": 123456789}'
```

### Test 2: Browse Products

1. Open your Vercel URL
2. Should see products (mock or real)
3. Click on a product
4. Add to cart
5. Proceed to checkout

### Test 3: Create Order

Complete checkout flow:
1. Fill shipping address
2. Select shipping method
3. Choose payment (mock for now)
4. Confirm order

Check Supabase:
1. Go to **Table Editor**
2. Open `orders` table
3. Should see your order

### Test 4: Mobile App

1. Open Expo Go on phone
2. Scan QR code
3. Navigate through screens
4. Test add to cart
5. Test wishlist

---

## 💳 STEP 7: Add Payments (Optional - 10 mins)

### Option A: Razorpay (India)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get test API keys
3. Add to Supabase secrets:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
   supabase secrets set RAZORPAY_KEY_SECRET=xxx
   ```
4. Install in project:
   ```bash
   npm install razorpay
   ```
5. Implement payment gateway (see INTEGRATION-GUIDE.md)

### Option B: Stripe (Global)

1. Sign up at [stripe.com](https://stripe.com)
2. Get test API keys
3. Add to Supabase secrets:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
   ```
4. Install in project:
   ```bash
   npm install stripe
   ```
5. Implement payment gateway

---

## ✅ Launch Checklist

### Pre-Launch

- [ ] All database tables created
- [ ] RLS policies working
- [ ] Storage buckets configured
- [ ] Printful connected & tested
- [ ] Products synced
- [ ] Web app deployed
- [ ] Mobile app built
- [ ] Edge functions deployed
- [ ] Webhooks configured
- [ ] Payment gateway integrated (if using)
- [ ] Test orders placed
- [ ] Tracking working

### Marketing Materials

- [ ] Custom domain connected (optional)
- [ ] Google Analytics added
- [ ] Social media accounts created
- [ ] Brand assets ready
- [ ] Product photos optimized
- [ ] SEO metadata added

### Legal & Compliance

- [ ] Privacy policy
- [ ] Terms of service
- [ ] Shipping policy
- [ ] Return policy
- [ ] Contact information

---

## 🎉 You're Live!

### Your Platform URLs

- **Website:** `https://kultzr-web.vercel.app` (or custom domain)
- **Admin:** Same website, click "+" button
- **API:** `https://xxxxx.supabase.co/functions/v1/make-server-891a09ab`
- **Database:** Supabase dashboard

### Next Steps

1. **Customize branding:** Update colors, fonts, logo
2. **Add more products:** Upload designs to Printful
3. **Market your brand:** Social media, influencers
4. **Monitor performance:** Check Supabase logs
5. **Collect feedback:** From early customers
6. **Iterate:** Based on data and feedback

---

## 📊 Monitoring

### Daily Checks

```sql
-- Check new orders
SELECT * FROM orders 
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- Check pending fulfillment
SELECT * FROM orders 
WHERE status IN ('pending', 'processing');

-- Check revenue
SELECT SUM(total) as revenue
FROM orders 
WHERE payment_status = 'paid'
AND created_at > NOW() - INTERVAL '7 days';
```

### Weekly Reviews

- View analytics (if added)
- Check Printful order status
- Review customer feedback
- Update product inventory
- Analyze top-selling items

---

## 🐛 Common Issues & Fixes

### Issue: "Failed to fetch products"

**Fix:**
1. Check Supabase URL in code
2. Verify anon key is correct
3. Check RLS policies allow public read
4. Add sample products manually

```sql
INSERT INTO products (name, price, category, images, sizes, colors, is_active)
VALUES ('Test Product', 999, 'T-Shirts', 
  '["https://via.placeholder.com/800"]', 
  '["S","M","L"]', 
  '["#000000"]', 
  true);
```

### Issue: "Order creation failed"

**Fix:**
1. Verify edge function is deployed
2. Check function logs: `supabase functions logs server`
3. Test endpoint with curl
4. Verify product IDs exist

### Issue: "Printful sync not working"

**Fix:**
1. Verify API key is correct
2. Check sync product ID exists in Printful
3. View function logs for errors
4. Test Printful API directly:
   ```bash
   curl https://api.printful.com/stores \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

---

## 💰 Pricing Calculator

### Monthly Costs (Starting)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Supabase | ✅ 500MB DB, 1GB storage | $25/mo Pro |
| Vercel | ✅ Unlimited projects | $20/mo Pro |
| Printful | ✅ No monthly fee | Pay per order |
| Expo | ✅ Build apps | $29/mo for priority |
| **Total** | **$0/month** | **$74/month** |

### Revenue Potential

**Example:** 
- 50 orders/month @ ₹3,000 avg = ₹1,50,000 revenue
- Printful cost: ~₹1,500/item = ₹75,000
- Platform costs: ₹5,000
- **Net profit:** ₹70,000/month

---

## 🎓 Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Printful API](https://developers.printful.com/)
- [React Docs](https://react.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [Expo Discord](https://chat.expo.dev/)
- [Reddit r/ecommerce](https://reddit.com/r/ecommerce)

### Tutorials
- This guide!
- `/INTEGRATION-GUIDE.md`
- `/REACT-NATIVE-SETUP.md`
- `/KULTZR-README.md`

---

## 🚀 Ready to Scale?

When you hit 100+ orders/month:

1. **Upgrade Supabase:** Pro plan for better performance
2. **Add CDN:** Cloudflare for faster images
3. **Implement caching:** Redis for frequent queries
4. **Add analytics:** PostHog or Mixpanel
5. **Hire help:** Virtual assistant for customer support
6. **Automate marketing:** Email campaigns, retargeting

---

## 🎯 Success Metrics

Track these KPIs:

- **Conversion rate:** Visitors → Customers
- **Average order value:** Revenue / Orders
- **Customer acquisition cost:** Marketing / New customers
- **Lifetime value:** Repeat purchases
- **Cart abandonment rate:** Started checkout but didn't complete
- **Return rate:** Returns / Orders

---

## 🤝 Support

Need help?

1. Check documentation above
2. Review code comments
3. Check Supabase/Printful status pages
4. Search GitHub issues
5. Ask in Discord communities

---

**Congratulations! 🎉**

You've successfully deployed your streetwear platform!

[KULTZR] - Where culture meets code.

Now go build something amazing! 🚀
