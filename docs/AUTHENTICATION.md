# Authentication Guide

Zyra uses NextAuth.js v5 (Auth.js) for authentication with support for multiple providers.

## Features

- ✅ Email Magic Link authentication
- ✅ Google OAuth integration
- ✅ Session management with JWT
- ✅ Protected routes via middleware
- ✅ Prisma adapter for database storage
- ✅ User profile management

## Setup

### Environment Variables

Add to your `.env` file:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Server (optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@zyra.app
```

### Generate Secret

```bash
openssl rand -base64 32
```

## Authentication Providers

### 1. Email (Magic Link)

No password required. Users receive a login link via email.

**Configuration:**
- Set `EMAIL_SERVER_*` variables
- Email provider sends magic link
- User clicks link to authenticate

### 2. Google OAuth

Sign in with Google account.

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Database Models

NextAuth uses these Prisma models:

- **User**: User account information
- **Account**: OAuth account connections
- **Session**: Active user sessions
- **VerificationToken**: Email verification tokens

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/callback/*` - OAuth callbacks

### Custom Endpoints
- `GET /api/auth/me` - Get current user with stats

## Pages

- `/auth/signin` - Sign in page
- `/auth/error` - Authentication error page
- `/profile` - User profile (protected)

## Usage in Components

### Client Components

```tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <button onClick={() => signIn()}>Sign In</button>;

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Server Components

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return <div>Welcome {session.user?.name}</div>;
}
```

## Protected Routes

Routes protected by middleware (requires authentication):
- `/dashboard/*`
- `/profile/*`
- `/team/*`
- `/settings/*`

## Components

### UserButton
Displays user avatar and sign in/out button in topbar.

```tsx
import { UserButton } from "@/components/auth/user-button";

<UserButton />
```

## Testing

### Test Endpoints

```bash
# Check if API is working
curl http://localhost:3000/api/auth/me
# Returns: {"error":"Unauthorized"} when not signed in

# Health check
curl http://localhost:3000/api/health
# Returns: {"status":"ok","database":"connected"}
```

### Manual Testing

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/auth/signin
3. Try signing in with Email or Google
4. Check `/profile` to see user data
5. Sign out from topbar

## Troubleshooting

### Email Not Sending

Check EMAIL_SERVER_* environment variables are set correctly.
For Gmail, use an App Password, not your regular password.

### Google OAuth Not Working

1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
2. Check authorized redirect URIs in Google Console
3. Enable Google+ API in Google Cloud Console

### Session Issues

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma Client
npm run db:generate

# Rebuild
npm run build
```

## Security Notes

⚠️ **Production Checklist:**
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Set proper NEXTAUTH_URL
- [ ] Configure email server
- [ ] Set up Google OAuth credentials
- [ ] Enable HTTPS
- [ ] Review callback URLs
