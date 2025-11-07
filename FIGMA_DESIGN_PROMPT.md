# 🎨 Figma AI Design Prompt: Modern Streetwear E-Commerce Platform

## Project Overview
Create a complete, trendy, youth-oriented streetwear e-commerce platform with both **React Native mobile app** and **React website**. The design should embody modern street culture, bold aesthetics, and high-energy youth appeal.

---

## 🎯 **Design Direction & Style**

### **Brand Identity**
- **Name**: [YOUR BRAND NAME] (replace with your brand)
- **Vibe**: Urban, edgy, contemporary, authentic street culture
- **Target Audience**: Gen Z and Millennials (16-28 years)
- **Style**: Minimalist with bold accents, high contrast, premium streetwear feel

### **Color Palette**
```css
Primary Colors:
- Jet Black: #0B0B0D (main background)
- Pure White: #FFFFFF (text, highlights)
- Electric Lime: #A4FF00 (primary accent, call-to-actions)
- Hot Orange: #FF6A00 (secondary accent, urgency alerts)
- Charcoal: #1E1E20 (surface cards, secondary backgrounds)

Supporting Colors:
- White Smoke: #F5F5F5 (primary text)
- Light Gray: #A8A8A8 (secondary text, muted elements)
- Success Green: #00FF88 (positive actions)
- Error Red: #FF3B3B (alerts, delete actions)
- Border Gray: #2A2A2A (dividers, outlines)
```

### **Typography**
```css
Display Fonts (Headers):
- Primary: "Anton" or "Space Grotesk" (bold, impactful)
- Use for: Logo, hero sections, product names, call-to-action buttons

Body Fonts (Content):
- Primary: "Inter" or "Poppins" (clean, readable)
- Use for: Descriptions, navigation, form elements, body text

Font Weights:
- Bold (700): Headers, important elements
- Semibold (600): Navigation, button text
- Regular (400): Body text, descriptions
- Medium (500): Form labels, categories
```

---

## 📱 **React Native Mobile App Design**

### **Screen 1: Splash Screen**
- **Background**: Full-screen black (#0B0B0D)
- **Center**: Large brand logo + "STREET CULTURE" tagline
- **Animation**: Subtle fade-in with logo bounce
- **Duration**: 2-3 seconds

### **Screen 2: Home/Landing**
**Header Navigation:**
- Top bar: Logo left, search icon right, cart icon with badge
- Scrollable category chips: "ALL", "HOODIES", "T-SHIRTS", "SNEAKERS", "BAGS", "ACCESSORIES"
- **Hero Section**: 
  - Full-width image: Street model wearing brand clothes
  - Overlay text: "STREET CULTURE" in large bold font
  - Subtitle: "Redefining urban fashion. Limited drops. Authentic culture."
  - CTA button: "EXPLORE COLLECTION" (lime background)

**Product Grid:**
- 2-column grid layout
- Product cards with 3:4 aspect ratio images
- Badge overlay: "NEW", "LIMITED", "SALE" (different colors)
- Product name below image
- Price in bold white text
- Heart icon (wishlist) top-right corner
- Quick add button appears on hover/tap

### **Screen 3: Product Detail**
**Image Gallery:**
- Full-width hero image at top
- Swipeable image carousel (3-4 images)
- Image dots indicator
- Zoom functionality on tap

**Product Information:**
- Product name in large bold font
- Price in extra large font
- Star rating with review count
- Size selection grid (S, M, L, XL, XXL)
- Color swatches (circular)
- Description text
- Care instructions link

**Action Buttons:**
- "ADD TO CART" - Full width lime button
- "BUY NOW" - Outline button
- Size guide link
- Share button
- Wishlist heart button

**Product Features:**
- Free shipping banner
- Delivery time estimate
- Return policy info

### **Screen 4: Shopping Cart**
- Cart item list with product images
- Quantity selector (+ and - buttons)
- Remove item option
- Price breakdown:
  - Subtotal
  - Shipping (FREE over $100)
  - Tax
  - **TOTAL**
- "PROCEED TO CHECKOUT" button
- Continue shopping link

### **Screen 5: Checkout**
**Multi-step process:**
1. **Shipping Address**: Form with validation
2. **Shipping Method**: Radio options (Standard, Express, Next-day)
3. **Payment**: Card form, UPI, net banking options
4. **Review**: Order summary with edit options

**Progress indicator** showing current step

### **Screen 6: Profile/Account**
**Tabbed interface:**
- **Orders**: Order history with status tracking
- **Wishlist**: Saved products grid
- **Settings**: Profile edit, notifications, logout
- **Addresses**: Saved shipping addresses
- **Payment**: Saved payment methods

### **Screen 7: Search**
- Search bar at top with suggestions
- Recent searches
- Popular categories
- Search results grid
- Filter options (price, size, color, category)

---

## 🌐 **React Website Design**

### **Desktop Layout (1200px+)**

**Header Navigation:**
- Full-width sticky header
- Logo left side
- Navigation menu: "NEW DROPS", "CLOTHING", "ACCESSORIES", "SALE"
- Right side: Search, Wishlist (heart icon), Cart (with count), Profile
- Mobile hamburger menu for smaller screens

**Hero Section:**
- Full viewport height (100vh)
- Split layout: 60% image, 40% content
- Background: Street photography or model wearing brand
- Text overlay: "STREET CULTURE" in massive font
- Tagline below in smaller text
- "SHOP NOW" button (lime) and "EXPLORE" button (outline)
- Social proof: "Trusted by 50K+ streetwear enthusiasts"

**Featured Collections:**
- 3-column grid
- Each card: Category image + title + description + shop button
- Hover effects with zoom and overlay

**Product Showcase:**
- Section title: "TRENDING NOW"
- 4-column grid on desktop
- Product cards with hover animations
- Quick view modal on hover
- Load more button

**Social Proof:**
- Customer reviews carousel
- Instagram feed integration
- #StreetCulture hashtag showcase

**Footer:**
- Newsletter signup
- Links: About, Contact, Size Guide, Returns
- Social media icons
- Payment method logos
- Copyright

### **Mobile Responsive Design**
- Sticky header with hamburger menu
- Full-width hero section
- 2-column product grid (mobile)
- Swipeable product cards
- Touch-friendly buttons and forms
- Bottom navigation bar (Home, Search, Cart, Profile)

---

## 🎨 **Component Design Specifications**

### **Buttons**
```css
Primary Button (CTA):
- Background: #A4FF00 (Electric Lime)
- Text: #0B0B0D (Jet Black)
- Height: 48px
- Border-radius: 8px
- Font-weight: 700
- Padding: 12px 24px

Secondary Button:
- Background: Transparent
- Border: 2px solid #A4FF00
- Text: #A4FF00
- Same dimensions as primary

Ghost Button:
- Background: Transparent
- Text: #F5F5F5
- Hover: Light background
```

### **Cards**
```css
Product Card:
- Background: #1E1E20
- Border-radius: 12px
- Shadow: 0 4px 20px rgba(0,0,0,0.3)
- Image aspect ratio: 3:4
- Padding: 16px
- Hover: Lift effect + shadow increase

Feature Card:
- Background: Linear gradient
- Icon + title + description
- Border-radius: 16px
- Padding: 24px
```

### **Forms**
```css
Input Fields:
- Background: #0B0B0D
- Border: 1px solid #2A2A2A
- Border-radius: 8px
- Height: 48px
- Padding: 0 16px
- Text color: #F5F5F5
- Focus: Border turns lime (#A4FF00)

Select Dropdowns:
- Same styling as inputs
- Custom dropdown arrow
```

---

## 🔥 **Animation & Interactions**

### **Micro-interactions**
- Button press: Scale down (0.95) + shadow
- Card hover: Lift 4px + increase shadow
- Loading states: Skeleton shimmer effect
- Success actions: Lime color flash
- Error states: Red shake animation

### **Page Transitions**
- Slide transitions between screens
- Fade in for new content
- Smooth scroll behavior
- Parallax effects for hero sections

### **Loading States**
- Skeleton screens for product lists
- Spinner for async actions
- Progress bars for file uploads
- Pull-to-refresh animation

---

## 📐 **Layout Grid System**

### **Mobile (320-768px)**
- Container width: 100% (with 16px padding)
- Column count: 4
- Gutter: 16px
- Product grid: 2 columns

### **Tablet (768-1024px)**
- Container width: 100% (with 24px padding)
- Column count: 8
- Gutter: 24px
- Product grid: 3 columns

### **Desktop (1024px+)**
- Container width: 1200px max
- Column count: 12
- Gutter: 32px
- Product grid: 4 columns

---

## 🎯 **Special Features to Design**

### **New Drop Countdown**
- Animated countdown timer
- "DROPPING SOON" badge
- Email signup for notifications
- Social sharing options

### **Size Guide Modal**
- Size chart comparison
- Body measurement guide
- Fit recommendations
- Customer reviews by size

### **Virtual Try-On** (Future feature placeholder)
- Camera integration mockup
- AR overlay interface
- Share results option

### **Community Features**
- User-generated content feed
- Street style photo submissions
- Influencer collaborations
- #BrandTag social integration

---

## 🚀 **Design Assets Needed**

### **Icons**
- Search, cart, wishlist, user
- Plus, minus, close, back arrows
- Payment method logos
- Social media icons
- Check marks, warnings, info

### **Images**
- High-quality street photography
- Product mockups on models
- Brand lifestyle shots
- Urban background textures
- Gradient overlays

### **Illustrations**
- Empty state illustrations
- Onboarding screens
- Error page graphics
- Success celebration graphics

---

## 📱 **Device-Specific Considerations**

### **iOS Design**
- Use iOS Human Interface Guidelines
- Safe area considerations
- iOS-style navigation
- App Store preview screenshots design

### **Android Design**
- Material Design principles
- Android back navigation
- Google Play Store optimization
- Adaptive icons

### **Web Design**
- SEO-optimized structure
- Fast loading images
- Accessibility compliance (WCAG 2.1)
- Cross-browser compatibility

---

## 🎨 **Design System Output**

Please provide:
1. **Complete style guide** with all colors, fonts, spacing
2. **Component library** showing all UI elements
3. **Mobile app wireframes** for all 7+ screens
4. **Website mockups** for desktop and mobile
5. **User flow diagrams** showing navigation paths
6. **Interaction specifications** for animations and transitions

**Goal**: Create a cohesive, modern, youth-appealing brand that stands out in the streetwear market while maintaining professional e-commerce functionality.