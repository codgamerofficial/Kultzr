# KULTZR Quick Start Guide
## Get Your Streetwear Platform Running in 10 Minutes

---

## 🎯 What You're Building

A complete modern streetwear e-commerce platform with:
- 🌐 **Responsive website** (React + Tailwind)
- 📱 **Mobile app** (React Native)
- 🗄️ **Backend** (Supabase)
- 📦 **Drop shipping** (Printful integration)
- 💳 **Payments** (Ready for Razorpay/Stripe)

---

## ⚡ Super Quick Start (3 Commands)

Already have everything setup? Jump right in:

```bash
# 1. Update your Supabase credentials
# Edit /utils/supabase/info.tsx with your projectId and publicAnonKey

# 2. Install dependencies
npm install

# 3. Run the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - Done! 🎉

---

## 🚀 Full Setup (First Time - 10 mins)

### Step 1: Clone & Install (2 mins)

```bash
# If you don't have the code yet
git clone https://github.com/your-username/kultzr.git
cd kultzr

# Install dependencies
npm install
```

### Step 2: Setup Supabase (3 mins)

1. Go to [supabase.com](https://supabase.com) → Create project
2. Copy your Project URL and Anon Key
3. Edit `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id-here';
export const publicAnonKey = 'your-anon-key-here';
```

### Step 3: Create Database (2 mins)

1. In Supabase dashboard → SQL Editor
2. Copy SQL from `/supabase/SETUP.md`
3. Run it (click ⚡ Run)
4. Done! Tables created ✅

### Step 4: Run the App (1 min)

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

### Step 5: Explore (2 mins)

- Browse products (mock data by default)
- Add items to cart
- Complete checkout
- View your profile
- Upload products (admin)

---

## 📱 Want the Mobile App Too?

```bash
# Create mobile app
npx create-expo-app kultzr-mobile
cd kultzr-mobile

# Install key dependencies
npm install @supabase/supabase-js zustand
npx expo install @react-native-async-storage/async-storage react-native-url-polyfill

# Start it
npx expo start
```

Scan QR code with Expo Go app on your phone!

Full mobile setup: See `/REACT-NATIVE-SETUP.md`

---

## 🖨️ Adding Printful (Optional - 5 mins)

Want real products that ship automatically?

1. **Sign up:** [printful.com](https://www.printful.com/) (free)
2. **Get API key:** Settings → API
3. **Set secrets:**
   ```bash
   supabase secrets set PRINTFUL_API_KEY=your_key
   supabase secrets set PRINTFUL_STORE_ID=your_id
   ```
4. **Deploy function:**
   ```bash
   supabase functions deploy server
   ```

Done! Now you can sync products from Printful.

Full integration: See `/INTEGRATION-GUIDE.md`

---

## 📁 Project Structure

```
kultzr/
├── App.tsx                      ← Main application
├── components/
│   ├── Header.tsx              ← Navigation
│   ├── ProductCard.tsx         ← Product display
│   ├── icons.tsx               ← Icon library
│   └── ui/                     ← 35+ UI components
├── hooks/
│   ├── useProducts.ts          ← Fetch products
│   └── useOrders.ts            ← Handle orders
├── utils/supabase/
│   ├── client.ts               ← Supabase client
│   └── info.tsx                ← ⚠️ ADD YOUR KEYS HERE
├── styles/
│   └── globals.css             ← KULTZR design system
├── supabase/
│   ├── SETUP.md                ← Database schema
│   └── functions/server/       ← Backend API
│       └── index.tsx
└── Design & Docs/
    ├── design-tokens.json      ← Complete design system
    ├── KULTZR-README.md        ← Full documentation
    ├── INTEGRATION-GUIDE.md    ← Supabase + Printful
    ├── REACT-NATIVE-SETUP.md   ← Mobile app guide
    └── DEPLOYMENT.md           ← Production deployment
```

---

## 🎨 Design System

All styling is in `/styles/globals.css` using CSS variables:

```css
--kultzr-primary: #0B0B0D        /* Jet Black */
--kultzr-accent-neon: #A4FF00    /* Neon Green */
--kultzr-accent-orange: #FF6A00  /* Electric Orange */
```

Use in components:
```tsx
<div className="bg-[var(--kultzr-primary)] text-[var(--kultzr-accent-neon)]">
  Your content
</div>
```

Full design tokens: `/design-tokens.json`

---

## 🔥 Key Features Already Built

### ✅ Web App Features

- **Home page** with hero, categories, product grid
- **Product detail** with size selector, color picker
- **Shopping cart** with quantity controls
- **Checkout flow** (address → shipping → payment)
- **Profile & orders** with wishlist
- **Search & filter** products
- **Admin upload** for new products
- **Responsive design** (mobile, tablet, desktop)
- **Animations** using Framer Motion
- **Toast notifications** for UX feedback

### ✅ Backend Features

- **Product management** (CRUD operations)
- **Order processing** with status tracking
- **User authentication** (ready for Supabase Auth)
- **Wishlist** per user
- **Printful integration** for dropshipping
- **Webhook handling** for order updates
- **File uploads** to Supabase Storage
- **Row Level Security** (RLS) for data protection

### ✅ Ready for You to Add

- Payment gateway (Razorpay/Stripe)
- Email notifications
- Social login (Google/Apple)
- Product reviews & ratings
- Discount codes & coupons
- Affiliate program
- Analytics integration

---

## 🎯 Using the App

### As a Customer

1. **Browse** products on home page
2. **Filter** by category
3. **Click** product for details
4. **Select** size and color
5. **Add to cart**
6. **Checkout** with shipping info
7. **Track** order in profile

### As Admin

1. **Click** the orange "+" button (bottom right)
2. **Upload** product images
3. **Enter** product details
4. **Sync** with Printful (optional)
5. **Publish** to storefront
6. **View** orders in Supabase dashboard

---

## 📊 Database Tables

Your Supabase database has these tables:

| Table | Purpose |
|-------|---------|
| `products` | Product catalog |
| `product_variants` | Size/color options |
| `orders` | Customer orders |
| `user_profiles` | User accounts |
| `wishlists` | Saved products |
| `design_uploads` | Custom designs |
| `printful_webhooks` | Order tracking |

View data: Supabase dashboard → Table Editor

---

## 🔌 API Endpoints

Your backend has these endpoints:

```
GET  /products              # List all products
GET  /products/:id          # Get single product
POST /products/sync         # Sync from Printful
POST /products              # Create product (admin)

POST /orders                # Create order
POST /orders/:id/fulfill    # Send to Printful
GET  /user/orders           # User's orders

GET  /user/wishlist         # Get wishlist
POST /user/wishlist         # Add to wishlist
DELETE /user/wishlist/:id   # Remove from wishlist

POST /webhooks/printful     # Printful webhooks
POST /designs/upload        # Upload design
```

Base URL: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab`

---

## 🧪 Test It Out

### Test 1: View Products

```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/products
```

### Test 2: Create Order

```bash
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@kultzr.com",
    "customer_name": "Test User",
    "shipping_address": {...},
    "items": [...],
    "total": 4999
  }'
```

### Test 3: Check Database

Go to Supabase dashboard → Table Editor → `orders` table

---

## 🚀 Deploy to Production

### Web App → Vercel (2 mins)

```bash
# Push to GitHub
git push origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Click Deploy
# 4. Done! ✅
```

Your site: `https://your-app.vercel.app`

### Mobile App → App Stores (15 mins)

```bash
# Install EAS
npm install -g eas-cli

# Build for iOS/Android
eas build --platform all

# Submit to stores
eas submit
```

Full deployment guide: `/DEPLOYMENT.md`

---

## 💡 Pro Tips

### Tip 1: Use Mock Data First

The app works with mock data by default. This lets you:
- Test the UI/UX
- Demo to stakeholders
- Develop without backend

When ready, just connect Supabase!

### Tip 2: Customize the Brand

All KULTZR branding is easy to change:

```css
/* /styles/globals.css */
--kultzr-accent-neon: #YOUR_COLOR;
```

```tsx
/* Header component */
<h1>
  [YOUR_BRAND]
</h1>
```

### Tip 3: Start Small

Focus on one product category first:
- T-shirts only
- Or hoodies only
- Or accessories

Expand as you grow!

### Tip 4: Use Test Mode

Both Printful and payment gateways have test modes:
- Test Printful orders (no actual printing)
- Test payments (no real charges)
- Debug everything before going live

---

## 📚 Documentation Index

| Document | Purpose | Time |
|----------|---------|------|
| `QUICKSTART.md` | This file! Get started fast | 10 min |
| `KULTZR-README.md` | Complete technical docs | 30 min read |
| `INTEGRATION-GUIDE.md` | Connect all services | 20 min setup |
| `REACT-NATIVE-SETUP.md` | Mobile app guide | 30 min setup |
| `DEPLOYMENT.md` | Production deployment | 60 min |
| `design-tokens.json` | Design system export | Reference |
| `supabase/SETUP.md` | Database schema | 5 min setup |

---

## 🎓 Learning Path

New to any of these technologies?

1. **React Basics** → [react.dev/learn](https://react.dev/learn) (2 hours)
2. **Tailwind CSS** → [tailwindcss.com/docs](https://tailwindcss.com/docs) (1 hour)
3. **Supabase** → [supabase.com/docs](https://supabase.com/docs) (1 hour)
4. **React Native** → [reactnative.dev](https://reactnative.dev) (2 hours)

Or just dive in and learn by doing! 🚀

---

## ❓ Common Questions

### Q: Do I need to know React?

**A:** Basic knowledge helps, but the code is well-commented. You can learn as you go!

### Q: Is this production-ready?

**A:** Yes! But add:
- Real payment gateway
- Custom domain
- Email service
- Error monitoring

### Q: How much does it cost?

**A:** Free to start! See `/DEPLOYMENT.md` for details.
- Supabase: Free tier
- Vercel: Free tier
- Printful: Pay per order only

### Q: Can I use my own designs?

**A:** Yes! Upload to Printful, sync to your store.

### Q: How do I add products?

**A:** Two ways:
1. Click "+" button in app (admin)
2. Sync from Printful dashboard

### Q: Where are orders stored?

**A:** In your Supabase database. You own all data.

### Q: Can I change the design?

**A:** 100% yes! All code is customizable. Change colors, fonts, layouts, anything.

---

## 🆘 Need Help?

### Issue: App won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Can't connect to Supabase"

1. Check internet connection
2. Verify credentials in `/utils/supabase/info.tsx`
3. Check Supabase dashboard is accessible

### Issue: Products not showing

1. App works with mock data by default ✅
2. To use real data: Add products in Supabase or sync from Printful
3. Check browser console for errors

### Issue: Build errors

```bash
# Update dependencies
npm update

# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

---

## ✅ Checklist: First Hour

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Run dev server (`npm run dev`)
- [ ] Explore the app
- [ ] Create Supabase project
- [ ] Update credentials in code
- [ ] Run database schema
- [ ] Test with real backend
- [ ] Deploy to Vercel (optional)
- [ ] Share with friends! 🎉

---

## 🎉 You're Ready!

Everything you need is here:
- ✅ Complete web app
- ✅ Backend infrastructure  
- ✅ Design system
- ✅ Documentation
- ✅ Deployment guides

**Now build your streetwear empire! 🚀**

[KULTZR] - Where culture meets code.

---

**Questions? Check the docs above or dive into the code!**

The best way to learn is to start building. Good luck! 💪
