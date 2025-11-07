# KULTZR Integration Setup Guide

This guide will help you obtain the necessary API keys and credentials for the KULTZR streetwear e-commerce platform.

## 🛍️ 1. Printful Integration (Dropshipping)

### Getting Your Printful API Key:
1. **Create Account**: Go to [printful.com](https://www.printful.com) and create a free account
2. **Navigate to Settings**: Go to your account settings
3. **API Section**: Look for "API" in the left sidebar
4. **Generate Key**: Click "Create API key" and copy the key
5. **Set Permissions**: Enable "Read" and "Write" permissions

**Location**: `VITE_PRINTFUL_API_KEY=your_printful_api_key`

**Example**: `VITE_PRINTFUL_API_KEY=pk_1234567890abcdef`

---

## 💳 2. Razorpay Integration (India Payments)

### Getting Razorpay Keys:
1. **Create Account**: Go to [razorpay.com](https://www.razorpay.com) and sign up
2. **Business Verification**: Complete KYC and business verification
3. **Dashboard Access**: Access your Razorpay dashboard
4. **API Keys**: Go to "Settings" → "API Keys"
5. **Generate Keys**: 
   - **Test Keys** (for development): Click "Generate Test Key"
   - **Live Keys** (for production): Click "Generate Live Key" (after verification)

**Location**: 
- `VITE_RAZORPAY_KEY_ID=your_razorpay_key_id`
- `VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret`

**Example**: 
- `VITE_RAZORPAY_KEY_ID=rzp_test_123456789`
- `VITE_RAZORPAY_KEY_SECRET=shp_live_1234567890abcdef`

---

## 🌍 3. Stripe Integration (International Payments)

### Getting Stripe Keys:
1. **Create Account**: Go to [stripe.com](https://stripe.com) and create account
2. **Dashboard Access**: Access your Stripe dashboard
3. **API Keys**: Go to "Developers" → "API Keys"
4. **Secret Key**: Copy the "Secret key" (starts with `sk_`)
5. **Publishable Key**: Copy the "Publishable key" (starts with `pk_`)

**Location**: 
- `VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key`
- `VITE_STRIPE_SECRET_KEY=your_stripe_secret_key`

**Example**: 
- `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef`
- `VITE_STRIPE_SECRET_KEY=sk_test_1234567890abcdef`

---

## 📧 4. Email Service Integration

### Recommended: Resend (Easy Setup)
1. **Create Account**: Go to [resend.com](https://resend.com) and sign up
2. **Dashboard Access**: Access your Resend dashboard
3. **API Keys**: Go to "API Keys" section
4. **Create Key**: Click "Create API Key"
5. **Permissions**: Select "Sending access" and "Domains verification"

**Location**: `VITE_EMAIL_SERVICE_API_KEY=your_email_service_api_key`

**Example**: `VITE_EMAIL_SERVICE_API_KEY=re_1234567890abcdef`

### Alternative: SendGrid
1. **Create Account**: Go to [sendgrid.com](https://sendgrid.com) and sign up
2. **API Keys**: Go to "Settings" → "API Keys"
3. **Create Key**: Click "Create API Key"
4. **Permissions**: Select "Mail Send" permission

---

## 📊 5. Analytics Integration

### Google Analytics 4 (Recommended)
1. **Create Account**: Go to [analytics.google.com](https://analytics.google.com)
2. **Create Property**: Create a new GA4 property for your site
3. **Get Measurement ID**: Go to "Data Streams" → Select your web stream
4. **Copy ID**: Copy the "Measurement ID" (format: G-XXXXXXXXXX)

**Location**: `VITE_ANALYTICS_ID=your_analytics_id`

**Example**: `VITE_ANALYTICS_ID=G-1234567890`

### Alternative: PostHog
1. **Create Account**: Go to [posthog.com](https://posthog.com) and sign up
2. **Get Project ID**: Copy your project ID from dashboard
3. **Get API Key**: Go to "Settings" → "Project API Keys"

---

## 🔐 Environment Variables Setup

### Step 1: Update .env File
Replace the placeholders in your `streetwear-app/.env` file with actual values:

```bash
# Supabase Configuration (Already configured)
VITE_SUPABASE_URL=https://vqtfpwiecppdegrwaadk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Printful Integration
VITE_PRINTFUL_API_KEY=pk_1234567890abcdef

# Payment Gateway - Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_123456789
VITE_RAZORPAY_KEY_SECRET=shp_test_1234567890abcdef

# Payment Gateway - Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef
VITE_STRIPE_SECRET_KEY=sk_test_1234567890abcdef

# Email Service
VITE_EMAIL_SERVICE_API_KEY=re_1234567890abcdef

# Analytics
VITE_ANALYTICS_ID=G-1234567890

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
```

### Step 2: Restart Development Server
After updating the .env file, restart your development server:
```bash
cd streetwear-app
npm run dev
```

---

## 🧪 Testing Integration

### Test Each Service:
1. **Printful**: Check product sync in admin dashboard
2. **Razorpay**: Test payment flow with test keys
3. **Stripe**: Test payment with test card numbers
4. **Email**: Check confirmation emails
5. **Analytics**: Verify tracking in Google Analytics

### Test Card Numbers:
- **Stripe**: Use `4242 4242 4242 4242` (Visa test card)
- **Razorpay**: Use `4111 1111 1111 1111` (test card)

---

## 💰 Cost Estimates

### Free Tiers Available:
- **Printful**: Free (pay per item only)
- **Razorpay**: Free (no setup fees)
- **Stripe**: Free (pay 2.9% + ₹0.30 per transaction)
- **Resend**: 100 emails/day free
- **Google Analytics**: Completely free

### When to Upgrade:
- **Printful Pro**: ₹1,100/month (advanced features)
- **Razorpay Business**: After verification (lowest fees)
- **Stripe**: Only when making real payments
- **Resend Pro**: $20/month (higher limits)

---

## 🔄 Production Deployment

### For Live Deployment:
1. **Use Live Keys**: Switch to production API keys
2. **Environment Setup**: Configure environment variables in Vercel/Netlify
3. **Domain Setup**: Update CORS and allowed domains in each service
4. **Testing**: Thoroughly test with small transactions
5. **Monitoring**: Set up error tracking and monitoring

### Vercel Environment Variables:
In your Vercel dashboard, go to:
- Project Settings → Environment Variables
- Add each key with the same `VITE_` prefix
- Deploy to apply changes

---

## 📞 Support & Help

### Documentation Links:
- [Printful API Docs](https://developers.printful.com/)
- [Razorpay API Docs](https://razorpay.com/docs/)
- [Stripe API Docs](https://stripe.com/docs)
- [Resend API Docs](https://resend.com/docs)
- [Google Analytics Guide](https://analytics.google.com/analytics/academy/)

### Common Issues:
- **CORS Errors**: Update allowed origins in service settings
- **Invalid Keys**: Double-check key format and permissions
- **Test vs Live**: Ensure you're using correct key type
- **Webhooks**: Set up webhooks for real-time updates

---

## ✅ Final Checklist

- [ ] Printful account created and API key obtained
- [ ] Razorpay account with test/live keys
- [ ] Stripe account with API keys
- [ ] Email service (Resend/SendGrid) set up
- [ ] Google Analytics account created
- [ ] All keys added to .env file
- [ ] Development server restarted
- [ ] Test integrations working
- [ ] Production keys ready for deployment

**You're now ready to enable all KULTZR features!** 🚀