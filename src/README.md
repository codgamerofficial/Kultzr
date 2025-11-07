# [KULTZR] - Modern Streetwear E-Commerce Platform

<div align="center">

**A complete, production-ready streetwear platform with React, React Native, Supabase, and Printful dropshipping integration.**

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

*Bold. Minimal. Urban. Street culture meets code.*

[**Live Demo**](#) • [**Get Started**](#-quick-start) • [**Documentation**](#-documentation)

![KULTZR Hero](https://images.unsplash.com/photo-1695827163486-b86eac571321?w=1200&h=400&fit=crop)

</div>

---

## 🎯 What is KULTZR?

KULTZR is a **complete e-commerce solution** for modern streetwear brands. It includes:

- 🌐 **Responsive Website** - React + Tailwind CSS, mobile-first design
- 📱 **Native Mobile App** - React Native with Expo for iOS & Android
- 🗄️ **Backend & Database** - Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- 📦 **Dropshipping Ready** - Printful integration for on-demand printing
- 💳 **Payment Integration** - Ready for Razorpay (India) or Stripe (Global)
- 🎨 **Complete Design System** - Design tokens, component library, style guide
- 📊 **Admin Dashboard** - Product management, order tracking, inventory sync

### Perfect For:

- 👕 Streetwear brands
- 🎨 Independent designers
- 🛍️ Print-on-demand businesses
- 🚀 E-commerce startups
- 💼 Agency projects

---

## ✨ Features

### Customer Experience

- ✅ Product browsing with grid/list views
- ✅ Real-time search and filtering
- ✅ Product detail pages with image galleries
- ✅ Size and color selection
- ✅ Shopping cart with quantity controls
- ✅ Multi-step checkout flow
- ✅ Order tracking with shipping updates
- ✅ Wishlist functionality
- ✅ User profiles and order history
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and micro-interactions
- ✅ Toast notifications for user feedback

### Admin Features

- ✅ Product upload with image management
- ✅ Printful sync for automated fulfillment
- ✅ Order management dashboard
- ✅ Inventory tracking
- ✅ Design mockup generation
- ✅ Real-time webhook handling
- ✅ Customer data management

### Technical

- ✅ TypeScript for type safety
- ✅ Row Level Security (RLS) for data protection
- ✅ Real-time updates via Supabase
- ✅ Optimized images and lazy loading
- ✅ SEO-friendly structure
- ✅ Edge functions for backend logic
- ✅ Webhook integration for Printful
- ✅ State management with Zustand
- ✅ Form validation with Zod
- ✅ Accessibility (WCAG AA compliant)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git
- Supabase account (free)
- Printful account (free, optional)

### 3-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/kultzr.git
cd kultzr

# 2. Install dependencies
npm install

# 3. Update Supabase credentials
# Edit /utils/supabase/info.tsx with your credentials

# 4. Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - you're live! 🎉

> **📘 New to this?** Start with [`QUICKSTART.md`](./QUICKSTART.md) for a guided tour.

---

## 📚 Documentation

| Document | Description | Time to Read |
|----------|-------------|--------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Get running in 10 minutes | ⚡ 10 min |
| **[KULTZR-README.md](./KULTZR-README.md)** | Complete technical documentation | 📖 30 min |
| **[INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md)** | Connect Supabase + Printful | 🔌 20 min |
| **[REACT-NATIVE-SETUP.md](./REACT-NATIVE-SETUP.md)** | Build the mobile app | 📱 30 min |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Deploy to production | 🚀 60 min |
| **[design-tokens.json](./design-tokens.json)** | Complete design system | 🎨 Reference |
| **[supabase/SETUP.md](./supabase/SETUP.md)** | Database schema & setup | 🗄️ 5 min |

---

## 🎨 Design System

KULTZR includes a complete, production-ready design system:

### Colors

```css
Primary:       #0B0B0D (Jet Black)
Surface:       #1E1E20 (Charcoal)
Accent:        #A4FF00 (Neon Green)
Accent Orange: #FF6A00 (Electric Orange)
Text:          #F5F5F5 (White Smoke)
Muted:         #A8A8A8 (Light Gray)
```

### Typography

- **Display:** Anton, Space Grotesk (headings, hero text)
- **Body:** Inter, Poppins (paragraphs, UI)
- **Scale:** H1 (48px) → XS (12px)

### Components

35+ pre-built UI components using Shadcn/ui:
- Buttons (primary, secondary, ghost, icon)
- Inputs, textareas, selects
- Cards, badges, tabs
- Modals, dialogs, sheets
- And more...

**View full design system:** [`design-tokens.json`](./design-tokens.json)

---

## 🏗️ Tech Stack

### Frontend (Web)

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS 4.0
- **Animation:** Framer Motion (motion/react)
- **UI Components:** Shadcn/ui
- **Icons:** Custom SVG library + Lucide React
- **Forms:** React Hook Form + Zod validation
- **State:** React hooks + Zustand (optional)
- **Build Tool:** Vite
- **Deployment:** Vercel / Netlify

### Mobile

- **Framework:** React Native with Expo
- **Navigation:** React Navigation v6
- **State:** Zustand
- **Animation:** React Native Reanimated
- **Forms:** React Hook Form
- **Build:** EAS (Expo Application Services)
- **Distribution:** TestFlight (iOS), Play Store (Android)

### Backend

- **Platform:** Supabase
- **Database:** PostgreSQL with Row Level Security
- **Auth:** Supabase Auth (email, social login)
- **Storage:** Supabase Storage (images, files)
- **Functions:** Edge Functions (Deno runtime)
- **Real-time:** WebSocket subscriptions
- **API:** RESTful + GraphQL ready

### Integrations

- **Dropshipping:** Printful API
- **Payments:** Razorpay / Stripe (ready)
- **Email:** Ready for SendGrid / Resend
- **Analytics:** Ready for PostHog / Mixpanel

---

## 📁 Project Structure

```
kultzr/
├── App.tsx                          ← Main app entry point
├── components/
│   ├── Header.tsx                   ← Navigation bar
│   ├── ProductCard.tsx              ← Product display
│   ├── icons.tsx                    ← Icon library (20+ icons)
│   └── ui/                          ← Shadcn components (35+)
├── hooks/
│   ├── useProducts.ts               ← Product data fetching
│   └── useOrders.ts                 ← Order management
├── utils/supabase/
│   ├── client.ts                    ← Supabase client setup
│   └── info.tsx                     ← 🔑 Config (add your keys here)
├── styles/
│   └── globals.css                  ← Design system, tokens
├── supabase/
│   ├── SETUP.md                     ← Database schema (SQL)
│   └── functions/server/
│       └── index.tsx                ← Backend API routes
├── public/                          ← Static assets
├── design-tokens.json               ← Complete design tokens
├── QUICKSTART.md                    ← ⚡ Start here!
├── KULTZR-README.md                 ← Full documentation
├── INTEGRATION-GUIDE.md             ← Supabase + Printful setup
├── REACT-NATIVE-SETUP.md            ← Mobile app guide
├── DEPLOYMENT.md                    ← Production deployment
└── package.json
```

---

## 🔌 Backend API

The Supabase Edge Function provides these endpoints:

```
Base URL: https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab

GET    /health                       # Health check
GET    /products                     # List products
GET    /products/:id                 # Get product details
POST   /products                     # Create product (admin)
POST   /products/sync                # Sync from Printful (admin)
POST   /orders                       # Create order
POST   /orders/:id/fulfill           # Fulfill with Printful
GET    /user/orders                  # Get user's orders
GET    /user/wishlist                # Get wishlist
POST   /user/wishlist                # Add to wishlist
DELETE /user/wishlist/:id            # Remove from wishlist
POST   /webhooks/printful            # Printful webhook handler
POST   /designs/upload               # Upload custom design
```

**Authentication:** JWT tokens via Supabase Auth

---

## 🗄️ Database Schema

The Supabase database includes these tables:

| Table | Purpose |
|-------|---------|
| `products` | Product catalog with images, prices, variants |
| `product_variants` | Size/color options for products |
| `orders` | Customer orders with status tracking |
| `user_profiles` | User account information |
| `wishlists` | User wishlists (many-to-many) |
| `design_uploads` | Custom design uploads by users/admin |
| `printful_webhooks` | Webhook event log for debugging |

**All tables** have Row Level Security (RLS) policies for data protection.

**View schema:** [`supabase/SETUP.md`](./supabase/SETUP.md)

---

## 🛠️ Development

### Run Development Server

```bash
npm run dev          # Start web app
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

### Mobile Development

```bash
cd kultzr-mobile
npx expo start       # Start Expo dev server
npx expo start -c    # Clear cache and start
```

### Edge Functions

```bash
supabase functions serve server         # Local development
supabase functions deploy server        # Deploy to production
supabase functions logs server          # View logs
```

---

## 🚀 Deployment

### Web App → Vercel (Recommended)

```bash
# Connect GitHub repo
# Push code
git push origin main

# Deploy via Vercel dashboard
# 1. Import repository
# 2. Configure build settings
# 3. Add environment variables
# 4. Deploy
```

**Your site:** `https://your-app.vercel.app`

### Mobile App → App Stores

```bash
# Build for production
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

**Full guide:** [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## 💰 Pricing & Costs

### Free Tier (Perfect for Starting)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Supabase** | ✅ Free | 500MB DB, 1GB storage, 2GB bandwidth |
| **Vercel** | ✅ Free | Unlimited projects, 100GB bandwidth |
| **Expo** | ✅ Free | Build apps, publish updates |
| **Printful** | ✅ Free | No monthly fee, pay per order only |

**Total: $0/month** to get started! 🎉

### Paid Tier (When Scaling)

| Service | Paid | When to Upgrade |
|---------|------|-----------------|
| Supabase Pro | $25/mo | 8GB DB, 100GB storage, better performance |
| Vercel Pro | $20/mo | Team features, analytics |
| Expo Priority | $29/mo | Faster builds, priority support |

**Total: ~$75/month** for a growing business.

**Revenue Example:**  
50 orders/month @ $50 avg = $2,500 revenue  
Printful cost @ $25/item = $1,250  
Platform costs = $75  
**Net profit: $1,175/month** 💰

---

## 🎯 Use Cases

### 1. Streetwear Brand

Launch your clothing line with:
- Print-on-demand (no inventory)
- Custom designs
- Automated fulfillment via Printful
- Mobile shopping experience

### 2. Artist/Designer Store

Sell your designs on:
- T-shirts, hoodies, hats
- Posters, stickers
- Phone cases, bags
- Auto-generated mockups

### 3. Agency Client Project

White-label solution for clients:
- Rebrand in minutes
- Custom domain
- Full source code
- Production-ready

### 4. Learning Project

Perfect for learning:
- Modern React patterns
- Supabase backend
- Mobile app development
- E-commerce flows
- Full-stack TypeScript

---

## 🤝 Contributing

This is a complete, ready-to-use platform. Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Fork and customize
- ⭐ Star the repo if you find it useful!

---

## 📖 Learn More

### Tutorials & Guides

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Printful API](https://developers.printful.com/)

### Community

- [Supabase Discord](https://discord.supabase.com/)
- [Expo Discord](https://chat.expo.dev/)
- [r/reactjs](https://reddit.com/r/reactjs)
- [r/reactnative](https://reddit.com/r/reactnative)
- [r/ecommerce](https://reddit.com/r/ecommerce)

---

## 📄 License

This project is provided as-is for educational and commercial use.  
Feel free to use it for your business!

---

## 🙏 Acknowledgments

Built with these amazing tools:

- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Backend platform
- [Printful](https://www.printful.com/) - Print on demand
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Expo](https://expo.dev/) - React Native platform

---

## 🎉 Ready to Launch?

You have everything you need:

- ✅ Complete web application
- ✅ Mobile app (React Native)
- ✅ Backend infrastructure
- ✅ Design system & tokens
- ✅ Documentation & guides
- ✅ Deployment instructions

**Start here:** [`QUICKSTART.md`](./QUICKSTART.md)

---

<div align="center">

### [KULTZR] - Where Culture Meets Code

**Built for the streets. Powered by modern tech. Ready for your brand.**

[Get Started](./QUICKSTART.md) • [View Docs](./KULTZR-README.md) • [Deploy Now](./DEPLOYMENT.md)

Made with ❤️ for streetwear culture

</div>
