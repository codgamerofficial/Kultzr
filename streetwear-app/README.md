# STREET CULTURE - Modern Streetwear E-Commerce Platform

A complete, production-ready streetwear e-commerce platform built with React, TypeScript, Tailwind CSS, and modern web technologies.

## 🚀 Features

### ✅ **Completed**
- **Modern Streetwear Design** - Electric lime and hot orange accents on jet black
- **Responsive Web App** - Mobile-first design with smooth animations
- **Product Catalog** - Grid/list views with filtering and search
- **Shopping Cart** - Full cart functionality with localStorage persistence
- **Product Details** - Detailed product pages with image galleries
- **User Authentication** - Supabase Auth integration (framework ready)
- **Context Management** - Zustand-style state management with React Context
- **TypeScript** - Full type safety throughout the application
- **Modern UI** - Framer Motion animations and Tailwind CSS
- **Component Library** - Reusable UI components
- **Routing** - React Router DOM with protected routes

### 🔧 **Ready for Integration**
- **Supabase Backend** - Database schema and client ready
- **Printful Integration** - Dropshipping setup framework
- **Payment Processing** - Razorpay/Stripe integration points
- **Admin Dashboard** - Admin interface structure
- **Real-time Features** - Supabase real-time subscriptions
- **Mobile App** - React Native structure (separate directory)

## 🎨 Design System

### Color Palette
```css
Primary:       #0B0B0D (Jet Black)
Secondary:     #1E1E20 (Charcoal)  
Accent:        #A4FF00 (Electric Lime)
Accent Orange: #FF6A00 (Hot Orange)
Text:          #F5F5F5 (White Smoke)
Text Muted:    #A8A8A8 (Light Gray)
```

### Typography
- **Display Fonts:** Anton, Space Grotesk (headings)
- **Body Fonts:** Inter, Poppins (content)
- **Scale:** Responsive sizing from mobile to desktop

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hot Toast** - User notifications

### State Management
- **React Context** - Global state
- **useReducer** - Complex state logic
- **localStorage** - Persistent cart data

### Backend Ready
- **Supabase** - PostgreSQL, Auth, Storage
- **Row Level Security** - Data protection
- **Real-time** - WebSocket subscriptions

## 📱 Pages & Features

### 🏠 **Homepage**
- Hero section with street culture branding
- Featured products showcase
- Call-to-action buttons
- Newsletter signup
- Brand values presentation

### 🛍 **Product Catalog**
- Grid and list view toggle
- Category filtering
- Price range filtering
- Sort by options (newest, price, name)
- Search functionality
- Product cards with quick add

### 📦 **Product Details**
- Image gallery with thumbnails
- Size and color selection
- Add to cart functionality
- Product specifications
- Customer reviews (structure)
- Related products

### 🛒 **Shopping Cart**
- Item management (add/remove/update)
- Quantity controls
- Price calculations
- Shipping estimates
- Tax calculations
- Order summary

### 🔐 **Authentication**
- Sign in/Sign up forms
- User profile management
- Protected routes
- Session management

### 👤 **User Profile**
- Personal information
- Order history
- Address management
- Wishlist

### ⚙️ **Admin Panel**
- Product management
- Order tracking
- User management
- Analytics dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd streetwear-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Add your Supabase credentials
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
streetwear-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Header, Footer
│   │   └── ProductCard.tsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ProductContext.tsx
│   ├── pages/             # Route components
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── AdminPage.tsx
│   │   └── AuthPage.tsx
│   ├── types/             # TypeScript definitions
│   │   ├── index.ts
│   │   └── database.ts
│   ├── utils/             # Utility functions
│   │   └── supabase.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🔌 API Integration Points

### Supabase Setup
```typescript
// src/utils/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

### Printful Integration
```typescript
// Ready for Printful API integration
// Add your API key to environment variables
```

### Payment Processing
```typescript
// Razorpay and Stripe integration points
// Add your API keys to environment variables
```

## 🎯 Next Steps

### 1. **Backend Integration**
- Set up Supabase project
- Run database migrations
- Configure authentication
- Set up real-time subscriptions

### 2. **Product Management**
- Sync with Printful API
- Implement product CRUD
- Set up inventory management
- Configure product variants

### 3. **Payment Integration**
- Implement Razorpay/Stripe
- Set up order processing
- Configure webhooks
- Test payment flows

### 4. **Admin Features**
- Build admin dashboard
- Implement user management
- Set up analytics
- Configure notifications

### 5. **Mobile App**
- Build React Native version
- Share business logic
- Implement push notifications
- App store deployment

## 📱 Mobile App

The mobile app is ready in the separate `kultzr-mobile` directory with:
- React Native with Expo
- Shared TypeScript types
- Native mobile navigation
- Platform-specific optimizations

## 🚀 Deployment

### Web App Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# Configure environment variables
```

### Mobile App Deployment
```bash
cd kultzr-mobile
eas build --platform all
eas submit --platform all
```

## 🛡 Security Features

- **Type Safety** - Full TypeScript coverage
- **Environment Variables** - Secure API key management
- **Row Level Security** - Supabase data protection
- **Input Validation** - Form validation with Zod
- **XSS Protection** - React's built-in protections
- **CORS Configuration** - Secure cross-origin requests

## 📊 Performance Features

- **Code Splitting** - Automatic with Vite
- **Image Optimization** - Lazy loading
- **Bundle Analysis** - Build optimization
- **Caching** - localStorage for cart data
- **Responsive Images** - Multiple sizes

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  street: {
    primary: '#0B0B0D',        // Main background
    accent: '#A4FF00',         // Primary accent
    'accent-orange': '#FF6A00', // Secondary accent
  }
}
```

### Fonts
Add new fonts in `index.html` and update `tailwind.config.js`:

```javascript
fontFamily: {
  display: ['YourFont', 'sans-serif'],
  body: ['YourBodyFont', 'sans-serif'],
}
```

## 📝 License

This project is available for commercial and educational use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Built for the streets. Powered by modern tech. Ready for your brand.** 🚀