# Vercel Web Analytics Integration Guide

This document explains how Vercel Web Analytics is integrated into this project and how to use it effectively.

## Overview

This project uses Vercel Web Analytics to track visitor data, page views, and custom events. The analytics implementation is already set up and configured for production use.

## Current Implementation

### Package Installation

The project has `@vercel/analytics` (version 1.6.1) installed as a dependency:

```json
{
  "dependencies": {
    "@vercel/analytics": "1.6.1"
  }
}
```

### Analytics Component Integration

The `Analytics` component is integrated in the main `App.tsx` file:

```tsx
import { Analytics } from '@vercel/analytics/react'

function App() {
    return (
        <>
            <SeoHead />
            <Analytics
                mode={import.meta.env.PROD ? 'production' : 'development'}
                debug={import.meta.env.DEV}
            />
            {/* Routes and other components */}
        </>
    )
}
```

#### Configuration Details:
- **mode**: Automatically switches between `production` and `development` based on the build environment
- **debug**: Enabled in development mode for easier debugging
- The component is placed at the root level to track all routes in the application

## Prerequisites

Before using Vercel Web Analytics, ensure you have:

1. **A Vercel Account**: Sign up at [vercel.com/signup](https://vercel.com/signup)
2. **A Vercel Project**: Create one at [vercel.com/new](https://vercel.com/new)
3. **Vercel CLI** (optional): Install using your preferred package manager:
   ```bash
   # pnpm
   pnpm add -D vercel
   
   # yarn
   yarn add -D vercel
   
   # npm
   npm install -D vercel
   
   # bun
   bun add -D vercel
   ```

## Enabling Web Analytics in Vercel Dashboard

1. Navigate to your project in the [Vercel dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to the **Analytics** tab
4. Click **Enable** to activate Web Analytics

> **Note:** Enabling Web Analytics adds new routes scoped at `/_vercel/insights/*` after your next deployment.

## How It Works

### Tracking Mechanism

Once deployed to Vercel with analytics enabled:
1. The Analytics component injects a tracking script into your application
2. Page views are automatically tracked when users navigate between routes
3. Data is sent to `/_vercel/insights/view` endpoint
4. Route changes are detected automatically thanks to React Router integration

### Verification

To verify analytics is working:
1. Open your browser's Developer Tools (F12)
2. Navigate to the **Network** tab
3. Visit any page in your application
4. Look for Fetch/XHR requests to `/_vercel/insights/view`

If you see these requests, analytics is working correctly!

## Viewing Analytics Data

To view your analytics data:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on the **Analytics** tab
4. Explore your visitor data, page views, and metrics

After a few days of traffic, you can:
- View aggregated statistics
- Filter data by various parameters
- Analyze user behavior patterns
- Track popular pages and routes

## Development vs Production

### Development Mode
- **debug**: Enabled to show console logs
- **mode**: Set to `development`
- Analytics events are logged but may not be sent to Vercel servers

### Production Mode
- **debug**: Disabled for performance
- **mode**: Set to `production`
- Full analytics tracking is active

## Advanced Usage

### Custom Events (Pro/Enterprise Plans)

For users on Pro or Enterprise plans, you can track custom events:

```tsx
import { track } from '@vercel/analytics'

// Track a custom event
track('button_clicked', {
  location: 'header',
  label: 'Sign Up'
})

// Track a conversion
track('purchase_completed', {
  product_id: '123',
  value: 99.99
})
```

### Available Analytics Functions

The `@vercel/analytics/react` package provides:
- `Analytics`: Component for automatic page view tracking
- `track`: Function for custom event tracking (Pro/Enterprise)

## Privacy and Compliance

Vercel Web Analytics is privacy-friendly:
- No cookies are used
- No personal data is collected
- GDPR and CCPA compliant
- No impact on Core Web Vitals

Learn more about [Vercel's privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy).

## Troubleshooting

### Analytics Not Showing Data

1. **Verify Enable Status**: Ensure analytics is enabled in the Vercel dashboard
2. **Check Network Requests**: Look for `/_vercel/insights/view` requests in the Network tab
3. **Deployment**: Make sure your site is deployed to Vercel (analytics doesn't work locally with full functionality)
4. **Wait Time**: It may take a few minutes for data to appear in the dashboard

### Development Issues

If you encounter issues in development:
- Check the browser console for debug messages
- Ensure `debug={true}` is set in the Analytics component
- Verify the `@vercel/analytics` package is installed correctly

## Deployment

### Using Vercel CLI

Deploy your application using:

```bash
vercel deploy
```

### Using Git Integration

We recommend connecting your Git repository:
1. Go to your Vercel project settings
2. Connect your Git repository (GitHub, GitLab, or Bitbucket)
3. Enable automatic deployments for your main branch

This enables automatic deployments on every commit without manual commands.

## Building Locally

To build the project locally:

```bash
# Install dependencies
yarn install

# Build for production
yarn build

# Preview the production build
yarn preview
```

## Project Structure

The analytics integration files are located at:
- **Component**: `src/app/App.tsx` - Main Analytics component integration
- **Package**: `package.json` - Analytics package dependency
- **Configuration**: Environment variables control mode and debug settings

## Next Steps

Now that you understand how Vercel Web Analytics is set up in this project, you can:

1. **Enable Analytics**: Turn on analytics in your Vercel dashboard
2. **Deploy**: Push your code to trigger a deployment
3. **Monitor**: Watch your analytics data grow in the dashboard
4. **Explore Advanced Features**:
   - [Custom Events Documentation](https://vercel.com/docs/analytics/custom-events)
   - [Data Filtering Guide](https://vercel.com/docs/analytics/filtering)
   - [Pricing Information](https://vercel.com/docs/analytics/limits-and-pricing)
   - [Troubleshooting Guide](https://vercel.com/docs/analytics/troubleshooting)

## Additional Resources

- [Vercel Analytics Package Documentation](https://vercel.com/docs/analytics/package)
- [Privacy Policy](https://vercel.com/docs/analytics/privacy-policy)
- [Analytics Limits and Pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Vercel Analytics Dashboard](https://vercel.com/dashboard)

## Support

For questions or issues:
- Check the [Vercel Documentation](https://vercel.com/docs/analytics)
- Visit the [Vercel Community](https://github.com/vercel/vercel/discussions)
- Contact [Vercel Support](https://vercel.com/support)
