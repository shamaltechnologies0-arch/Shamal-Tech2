# MongoDB Session Management & Optimization

## Overview

This document explains how to prevent MongoDB session expiration errors (`MongoExpiredSessionError`) and optimize database connections in your Payload CMS + Next.js application.

## M0 Free Tier + Vercel Serverless (Critical)

**M0 clusters have a 500 connection limit.** Vercel serverless spawns many instances; each uses Mongoose's default `maxPoolSize=100`. A few concurrent instances can exhaust the limit, causing:

- `Error: cannot connect to MongoDB`
- 500 errors on `/posts/*`, `/api/media/*`, admin pages
- MongoDB Atlas "connections exceeded threshold" alerts

**Fix:** The `payload.config.ts` sets `maxPoolSize=5` when `VERCEL` is set (Vercel sets this automatically). This limits each instance to 5 connections. You can also add these params to your `MONGODB_URI` in Vercel:

```
?maxPoolSize=5&minPoolSize=0&maxIdleTimeMS=60000
```

**Immediate steps if you hit the limit:**
1. Redeploy on Vercel to close existing connections
2. Ensure `maxPoolSize=5` is in your connection string or config
3. Consider upgrading to M10+ for higher connection limits

## Common Issues

### 1. MongoExpiredSessionError: Cannot use a session that has ended

**Cause:** MongoDB sessions expire when:
- Long-running server-side fetches exceed the session lifetime
- Multiple queries reuse a session that has already been closed
- Serverless functions (Vercel/Lambda) have connection pooling issues

**Solution:** Use the `safePayloadQuery` utility for all public page queries.

## MongoDB Connection String Optimization

### Recommended Connection String Parameters

Add these parameters to your `MONGODB_URI` environment variable:

```
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&maxIdleTimeMS=60000&maxPoolSize=10&minPoolSize=2
```

### Parameter Explanations

- **`maxIdleTimeMS=60000`** (60 seconds)
  - Controls how long a session can remain idle before expiration
  - Increase to 120000 (2 minutes) if you have longer-running queries
  - Default is usually 30 seconds

- **`maxPoolSize=10`**
  - Maximum number of connections in the connection pool
  - Adjust based on your serverless function concurrency
  - Vercel: Usually 10-20 is sufficient

- **`minPoolSize=2`**
  - Minimum number of connections to maintain
  - Helps reduce connection establishment overhead

- **`retryWrites=true`**
  - Automatically retry write operations on transient errors
  - Recommended for production

- **`w=majority`**
  - Write concern: wait for majority of replicas to acknowledge writes
  - Ensures data durability

### Example Connection Strings

**Development (Local MongoDB):**
```
mongodb://localhost:27017/shamal-technologies?maxIdleTimeMS=60000&maxPoolSize=10
```

**Production (MongoDB Atlas):**
```
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&maxIdleTimeMS=120000&maxPoolSize=20&minPoolSize=2
```

## Code Best Practices

### ✅ DO: Use safePayloadFind for Public Pages

```typescript
import { safePayloadFind } from '../utilities/safePayloadQuery'

// In server components
const services = await safePayloadFind({
  collection: 'services',
  limit: 6,
  where: {
    _status: {
      equals: 'published',
    },
  },
  draft: false, // Always exclude drafts on public pages
  overrideAccess: false, // Respect access control
})
```

### ✅ DO: Always Specify Access Control

```typescript
await safePayloadFind({
  collection: 'posts',
  where: {
    _status: {
      equals: 'published', // Only published content
    },
  },
  draft: false, // Explicitly exclude drafts
  overrideAccess: false, // Respect access control (don't bypass)
})
```

### ❌ DON'T: Use Direct payload.find() Without Error Handling

```typescript
// ❌ Bad - no session expiration handling
const payload = await getPayload({ config: configPromise })
const services = await payload.find({ collection: 'services' })
```

### ❌ DON'T: Fetch Draft/Admin-Only Content on Public Pages

```typescript
// ❌ Bad - might require authentication
const services = await payload.find({
  collection: 'services',
  // Missing draft: false and overrideAccess: false
})
```

## Serverless Considerations

### Vercel / AWS Lambda

Serverless functions have unique challenges:

1. **Cold Starts**: First request may be slower
2. **Connection Pooling**: Connections are reused across invocations
3. **Session Timeouts**: Sessions may expire between requests

**Solutions:**
- Use `safePayloadFind` which handles retries automatically
- Increase `maxIdleTimeMS` to accommodate longer gaps
- Consider using MongoDB Atlas Serverless (auto-scaling)

### MongoDB Atlas Serverless

If using MongoDB Atlas Serverless:
- Connection pooling is handled automatically
- No need to configure `maxPoolSize` or `minPoolSize`
- Still use `maxIdleTimeMS` for session management

## Monitoring & Debugging

### Check MongoDB Connection Status

```typescript
// In development, log connection info
if (process.env.NODE_ENV === 'development') {
  console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'))
}
```

### Common Error Messages

1. **"Cannot use a session that has ended"**
   - Solution: Use `safePayloadFind` or increase `maxIdleTimeMS`

2. **"Connection pool exhausted"**
   - Solution: Increase `maxPoolSize` or reduce concurrent requests

3. **"MongoNetworkError: connection timed out"**
   - Solution: Check network connectivity, MongoDB Atlas IP whitelist

## Environment Variables

Update your `.env` or Vercel environment variables:

```bash
# Add maxIdleTimeMS and other optimizations to your connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&maxIdleTimeMS=120000&maxPoolSize=20
```

## Testing

After updating your connection string:

1. Restart your development server
2. Test pages that make multiple queries (homepage, footer)
3. Monitor for session expiration errors
4. Adjust `maxIdleTimeMS` if needed

## Additional Resources

- [MongoDB Connection String Options](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Atlas Serverless](https://www.mongodb.com/docs/atlas/serverless/)
- [Payload CMS Database Adapters](https://payloadcms.com/docs/database/overview)
