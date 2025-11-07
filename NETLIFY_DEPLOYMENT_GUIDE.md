# KULTZR Netlify Deployment Guide

## 🚀 Quick Fix for Netlify Deployment

This guide will help you successfully deploy the KULTZR streetwear e-commerce platform to Netlify.

## 📋 **Step-by-Step Deployment**

### 1. **Pre-Deployment Checklist**
- [ ] Build the project locally: `cd streetwear-app && npm run build`
- [ ] Test the build locally: `npm run preview`
- [ ] Check that `dist` folder is created with `index.html`
- [ ] Verify all dependencies are in `package.json`

### 2. **Environment Variables Setup**
In your Netlify dashboard, go to:
- **Site Settings** → **Environment Variables**
- Add these variables:

```bash
VITE_SUPABASE_URL=https://vqtfpwiecppdegrwaadk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdGZwd2llY3BwZGVncndhYWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTIyMjEsImV4cCI6MjA3ODAyODIyMX0.ytNrvLI7YWAAjuUxDne4V8AcvQSP8_1CCsAlvly7oj4
```

### 3. **Netlify Configuration**
I've created a `netlify.toml` file with the proper configuration:

- **Build command**: `cd streetwear-app && npm run build`
- **Publish directory**: `streetwear-app/dist`
- **SPA redirects**: All routes redirect to `index.html`
- **Security headers**: Basic security configuration
- **Caching**: Optimized asset caching

### 4. **Deployment Method Options**

#### Option A: GitHub Integration (Recommended)
1. **Connect Repository**:
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Choose GitHub
   - Select your `Kultzr` repository
   - Choose `main` branch

2. **Build Settings**:
   - Build command: `cd streetwear-app && npm run build`
   - Publish directory: `streetwear-app/dist`
   - Node version: `18`

3. **Environment Variables**:
   - Add the environment variables in Site Settings
   - Trigger a new deployment

#### Option B: Manual Drag & Drop
1. **Build Locally**:
   ```bash
   cd streetwear-app
   npm install
   npm run build
   ```

2. **Deploy**:
   - Go to Netlify dashboard
   - Drag the `dist` folder to the deploy area
   - Wait for deployment to complete

### 5. **Common Deployment Issues & Fixes**

#### Issue 1: Build Command Fails
**Error**: `cd streetwear-app && npm run build` not found
**Fix**: 
- Ensure the build command is: `cd streetwear-app && npm run build`
- Check that package.json has the build script
- Verify Node.js version is 18+ in Netlify settings

#### Issue 2: Publish Directory Not Found
**Error**: `Publish directory 'streetwear-app/dist' not found`
**Fix**:
- Ensure the publish directory is: `streetwear-app/dist`
- Build must complete successfully
- Check that Vite creates the `dist` folder

#### Issue 3: Environment Variables Not Working
**Error**: Supabase connection fails
**Fix**:
- Add environment variables in Netlify dashboard
- Use `VITE_` prefix for Vite environment variables
- Redeploy after adding environment variables

#### Issue 4: Routing Issues (404 Errors)
**Error**: Routes like `/products` show 404
**Fix**:
- Netlify config now includes SPA redirects
- All routes should redirect to `index.html`
- React Router will handle client-side routing

#### Issue 5: Build Timeouts
**Error**: Build process times out
**Fix**:
- Increase build timeout in Site Settings
- Use Node.js 18 for faster builds
- Consider using build cache

### 6. **Post-Deployment Checklist**

- [ ] Visit your site URL
- [ ] Test homepage loads correctly
- [ ] Check Supabase connection
- [ ] Test user registration/login
- [ ] Verify product catalog displays
- [ ] Test shopping cart functionality
- [ ] Check admin dashboard access
- [ ] Verify mobile responsiveness

### 7. **Custom Domain Setup (Optional)**

1. **Add Domain**:
   - Go to Site Settings → Domain management
   - Add custom domain
   - Configure DNS records

2. **SSL Certificate**:
   - Netlify automatically provides SSL
   - Verify HTTPS is working

### 8. **Environment-Specific Configurations**

#### Production Settings:
```bash
VITE_APP_URL=https://your-domain.netlify.app
VITE_API_URL=https://your-domain.netlify.app/api
```

#### Staging Settings:
- Use branch-based deployments
- Set up different environment variables
- Test thoroughly before production

## 🔧 **Troubleshooting Commands**

### Test Build Locally:
```bash
cd streetwear-app
npm install
npm run build
npm run preview
```

### Check Build Output:
```bash
ls -la streetwear-app/dist/
```

### Verify Environment Variables:
```bash
cd streetwear-app
echo $VITE_SUPABASE_URL
```

## 📊 **Netlify Deployment Stats**

### Free Tier Limits:
- **Build minutes**: 300 minutes/month
- **Bandwidth**: 100GB/month
- **Storage**: 1GB

### Performance Tips:
- Enable Netlify Analytics
- Use Netlify Functions for backend logic
- Set up proper caching headers
- Optimize images with Netlify Image Optimization

## 🎯 **Success Indicators**

Your deployment is successful when:
- ✅ Site loads without errors
- ✅ Homepage displays correctly
- ✅ Supabase connection works
- ✅ User authentication functions
- ✅ Product catalog shows items
- ✅ Shopping cart operates
- ✅ All routes work (no 404s)
- ✅ Mobile version displays properly

## 📞 **Getting Help**

### Netlify Support:
- [Netlify Docs](https://docs.netlify.com/)
- [Community Forum](https://community.netlify.com/)
- [Support Center](https://answers.netlify.com/)

### Project Support:
- Check browser console for errors
- Review Netlify deploy logs
- Verify environment variables
- Test with incognito/private browser mode

---

## 🚀 **Ready to Deploy!**

With the `netlify.toml` configuration and this guide, your KULTZR platform should deploy successfully to Netlify. The configuration includes:

- ✅ Proper build settings
- ✅ SPA routing support
- ✅ Security headers
- ✅ Caching optimization
- ✅ Environment variable support

**Your KULTZR streetwear e-commerce platform will be live on the internet!** 🌍