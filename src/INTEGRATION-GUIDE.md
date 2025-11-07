# KULTZR - Complete Integration Guide
## Supabase + Printful + React Web + React Native

---

## 🎯 System Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React Website  │◄────►│  Supabase Edge   │◄────►│   Printful API  │
│  (Customer)     │      │  Functions       │      │  (Fulfillment)  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                ┌────────▼────────┐  ┌─────▼──────┐
                │  React Native   │  │  Supabase  │
                │  (Customer)     │  │  Database  │
                └─────────────────┘  └────────────┘
                         │
                ┌────────▼────────┐
                │  Admin Dashboard│
                │  (Product Mgmt) │
                └─────────────────┘
```

---

## 📋 Complete Setup Checklist

### ✅ Phase 1: Supabase Setup (20 mins)

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run database schema SQL from `/supabase/SETUP.md`
- [ ] Create storage buckets:
  - `product-images` (public)
  - `design-uploads` (private)
  - `order-receipts` (private)
- [ ] Set up storage policies (RLS)
- [ ] Save these values:
  ```
  Project URL: https://xxxxx.supabase.co
  Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
  ```

### ✅ Phase 2: Printful Setup (15 mins)

- [ ] Create account at [printful.com](https://www.printful.com/)
- [ ] Get API key from Settings → API
- [ ] Note your Store ID
- [ ] Set up webhook in Printful:
  - URL: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/webhooks/printful`
  - Events: `package_shipped`, `package_returned`, `order_failed`, `stock_updated`
- [ ] Test connection with sample API call

### ✅ Phase 3: Environment Variables (5 mins)

Update `/utils/supabase/info.tsx` with your values:

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

Set secrets for Edge Functions:

```bash
# From your terminal in the project directory
supabase secrets set PRINTFUL_API_KEY=your_printful_api_key
supabase secrets set PRINTFUL_STORE_ID=your_store_id
```

### ✅ Phase 4: Deploy Edge Functions (10 mins)

```bash
# Deploy the server function
supabase functions deploy server

# Test it
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-07T..."
}
```

### ✅ Phase 5: Web App Integration (5 mins)

Already done! The web app is ready to use. Just update:

1. `/utils/supabase/info.tsx` with your credentials
2. Test the app locally
3. Deploy to Vercel/Netlify for production

### ✅ Phase 6: React Native Setup (30 mins)

Follow `/REACT-NATIVE-SETUP.md`:

1. Create Expo app
2. Install dependencies
3. Update Supabase credentials in `src/services/supabase.ts`
4. Download and add fonts
5. Implement screens
6. Test on device/simulator

---

## 🔄 Complete Workflow Examples

### Workflow 1: Admin Uploads Product with Printful

```
1. Admin logs into web app
2. Clicks "+" floating button → Product Upload
3. Uploads design image to Supabase Storage
4. Selects product type (T-shirt, Hoodie, etc.)
5. Enters product details (name, price, category)
6. Clicks "Sync with Printful"
   
   Backend Process:
   - Edge Function calls Printful API
   - Creates sync product with design
   - Generates mockup images
   - Saves product to Supabase products table
   - Product becomes visible on storefront
```

**API Calls:**

```typescript
// 1. Upload design to Supabase Storage
const { data, error } = await supabase.storage
  .from('design-uploads')
  .upload(`${userId}/design-${Date.now()}.png`, file);

// 2. Sync with Printful via Edge Function
const response = await fetch(
  'https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/products/sync',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      sync_product_id: printfulSyncProductId,
      design_url: publicUrl
    })
  }
);
```

### Workflow 2: Customer Places Order

```
1. Customer browses products on web/mobile
2. Adds items to cart (stored in local state/Zustand)
3. Proceeds to checkout
4. Fills in shipping address
5. Selects payment method
6. Confirms order

   Backend Process:
   - Create order in Supabase
   - Process payment (Razorpay/Stripe)
   - Send order to Printful for fulfillment
   - Printful creates and ships product
   - Webhook updates order status
   - Customer receives tracking number
```

**API Calls:**

```typescript
// 1. Create order
const orderResponse = await fetch(
  'https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/orders',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({
      customer_email: 'user@example.com',
      customer_name: 'John Doe',
      customer_phone: '+91 9876543210',
      shipping_address: {
        address: '123 Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'IN'
      },
      items: [
        {
          product_id: 'uuid-here',
          name: 'STEALTH HOODIE',
          size: 'L',
          quantity: 1,
          price: 4999
        }
      ],
      subtotal: 4999,
      shipping_cost: 0,
      tax: 0,
      total: 4999
    })
  }
);

// 2. Fulfill order (admin/automated)
await fetch(
  `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/orders/${orderId}/fulfill`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }
);
```

### Workflow 3: Order Status Update via Webhook

```
1. Printful prints and ships order
2. Printful sends webhook to Edge Function
3. Edge Function updates order status in Supabase
4. Customer sees updated status in app
5. Customer receives tracking link

   Webhook Payload Example:
   {
     "type": "package_shipped",
     "data": {
       "order": { "id": "12345" },
       "shipment": {
         "tracking_number": "1Z999AA10123456784",
         "tracking_url": "https://..."
       }
     }
   }
```

---

## 🧪 Testing Guide

### Test 1: Product Sync

```bash
# 1. Get a Printful sync product ID (create one in Printful dashboard)
# 2. Call sync endpoint

curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/products/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "sync_product_id": 123456789
  }'
```

### Test 2: Create Order

```bash
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "customer_email": "test@kultzr.com",
    "customer_name": "Test User",
    "customer_phone": "+91 9876543210",
    "shipping_address": {
      "address": "123 Test Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "IN"
    },
    "items": [
      {
        "product_id": "uuid-from-database",
        "name": "Test Product",
        "quantity": 1,
        "price": 999
      }
    ],
    "subtotal": 999,
    "shipping_cost": 0,
    "tax": 0,
    "total": 999
  }'
```

### Test 3: Webhook

```bash
# Simulate Printful webhook
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/webhooks/printful \
  -H "Content-Type: application/json" \
  -d '{
    "type": "package_shipped",
    "data": {
      "order": {
        "id": "your-printful-order-id"
      },
      "shipment": {
        "tracking_number": "TEST123456",
        "tracking_url": "https://tracking.example.com/TEST123456"
      }
    }
  }'
```

---

## 💰 Payment Integration

### Option 1: Razorpay (India)

```bash
# Install
npm install razorpay

# Set secrets
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
supabase secrets set RAZORPAY_KEY_SECRET=xxx
```

Add to Edge Function:

```typescript
import Razorpay from 'npm:razorpay@2';

app.post('/make-server-891a09ab/payments/create-order', async (c) => {
  const razorpay = new Razorpay({
    key_id: Deno.env.get('RAZORPAY_KEY_ID'),
    key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
  });

  const { amount } = await c.req.json();

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: `order_${Date.now()}`,
  });

  return c.json({ order });
});
```

### Option 2: Stripe (International)

```bash
npm install stripe
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
```

---

## 🔒 Security Best Practices

### 1. Row Level Security (RLS)

Already configured! But verify:

```sql
-- Test as anonymous user
SELECT * FROM products WHERE is_active = true; -- ✅ Should work

-- Test as user
SELECT * FROM orders WHERE user_id = auth.uid(); -- ✅ Should work

-- Test unauthorized access
SELECT * FROM orders WHERE user_id != auth.uid(); -- ❌ Should fail
```

### 2. API Key Protection

- ✅ Never commit `.env` files
- ✅ Use `supabase secrets` for edge functions
- ✅ Service role key only in backend
- ✅ Anon key safe for frontend (with RLS)

### 3. Validate Inputs

```typescript
// Example: Validate order data
const orderSchema = z.object({
  customer_email: z.string().email(),
  customer_name: z.string().min(2),
  total: z.number().positive(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1)
});

const validatedData = orderSchema.parse(orderData);
```

---

## 📊 Monitoring & Logs

### View Edge Function Logs

```bash
supabase functions logs server
```

### Monitor Printful Webhooks

Check the `printful_webhooks` table:

```sql
SELECT * FROM printful_webhooks 
ORDER BY created_at DESC 
LIMIT 10;
```

### Track Orders

```sql
-- Orders pending fulfillment
SELECT * FROM orders 
WHERE status = 'pending' 
OR status = 'processing';

-- Orders with issues
SELECT * FROM orders 
WHERE status = 'cancelled' 
OR payment_status = 'failed';
```

---

## 🚀 Deployment Checklist

### Web App (Vercel/Netlify)

- [ ] Update environment variables
- [ ] Connect GitHub repo
- [ ] Configure build command: `npm run build`
- [ ] Set output directory: `dist` or `build`
- [ ] Deploy and test

### React Native (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas init
eas build:configure

# Build
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🐛 Troubleshooting

### Issue: Products not syncing from Printful

**Check:**
1. Printful API key is correct
2. Sync product exists in Printful
3. Edge function logs for errors
4. Network connectivity

**Fix:**
```bash
# View logs
supabase functions logs server

# Test API key
curl https://api.printful.com/stores \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Issue: Orders not creating

**Check:**
1. Order data format matches schema
2. Product IDs exist in database
3. RLS policies allow insertion
4. Edge function is deployed

**Fix:**
```sql
-- Verify product exists
SELECT * FROM products WHERE id = 'your-product-id';

-- Check RLS
SELECT * FROM orders WHERE auth.uid() = user_id;
```

### Issue: Webhooks not receiving

**Check:**
1. Webhook URL is correct in Printful
2. Edge function is deployed
3. Webhook secret matches (if using)

**Fix:**
```bash
# Test webhook endpoint
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/webhooks/printful \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{}}'
```

---

## 📈 Scaling Considerations

### For Production:

1. **Database Indexing:** Already added! But monitor query performance
2. **Image CDN:** Use Supabase Storage with CDN
3. **Caching:** Implement Redis for frequently accessed data
4. **Rate Limiting:** Add rate limits to Edge Functions
5. **Error Tracking:** Integrate Sentry or similar
6. **Analytics:** Add PostHog, Mixpanel, or Google Analytics

### Costs Estimation (Monthly):

- **Supabase Pro:** $25/month (includes 8GB DB, 100GB storage)
- **Printful:** No monthly fee (pay per order)
- **Vercel/Netlify:** Free tier or $20/month
- **EAS Build:** Free tier or $29/month

**Total:** ~$50-75/month for a growing business

---

## 🎓 Next Steps

1. **Complete the setup** following this guide
2. **Test all workflows** with sample data
3. **Customize branding** (colors, fonts, copy)
4. **Add payment gateway** (Razorpay/Stripe)
5. **Launch beta** with limited products
6. **Collect feedback** and iterate
7. **Scale up** based on demand

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Printful API Docs](https://developers.printful.com/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Vercel Deployment](https://vercel.com/docs)

---

## 💬 Support

For issues with:
- **Supabase:** [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- **Printful:** [Support Portal](https://www.printful.com/contacts)
- **This Setup:** Review logs and test endpoints above

---

**Ready to launch your streetwear empire! 🚀**

[KULTZR] - Built for the streets, powered by code.
