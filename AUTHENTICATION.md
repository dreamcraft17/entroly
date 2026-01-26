# Authentication System Documentation

## Overview
LinkHub now features a secure authentication system that requires users to register and log in before creating link-in-bio pages.

## Security Features

### 🔒 High-Security Implementation

1. **Password Security**
   - Passwords hashed with bcrypt (cost factor 12)
   - Minimum 8 characters required
   - Must contain uppercase, lowercase, and numbers
   - Never stored in plain text

2. **Session Management**
   - JWT-based sessions with 30-day expiry
   - Secure session tokens
   - Automatic session refresh

3. **Input Validation**
   - Zod schema validation on all inputs
   - Email format verification
   - Case-insensitive email lookup
   - SQL injection prevention via Prisma ORM

4. **Route Protection**
   - Middleware guards /create route
   - Automatic redirect to login for unauthorized access
   - Server-side authentication checks

5. **API Security**
   - Server actions verify authentication
   - CSRF protection via NextAuth
   - Secure HTTP-only cookies

## Setup Instructions

### 1. Environment Variables
Create a `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/linkhub"

# NextAuth - Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Generate Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Database Migration
The authentication tables are already created if you've run the migrations:
```bash
npx prisma migrate dev
```

## User Flow

### Registration
1. Navigate to `/register`
2. Enter name, email, and secure password
3. Password must meet strength requirements
4. Account created with hashed password
5. Redirected to login page

### Login
1. Navigate to `/login`
2. Enter email and password
3. Credentials verified against hashed password
4. Session created on success
5. Redirected to `/create` page

### Creating Profiles
1. Must be logged in to access `/create`
2. Profiles are automatically linked to user account
3. Users can create multiple profiles
4. Each profile tied to authenticated user

## API Endpoints

### POST /api/register
Registers a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/auth/callback/credentials
Login endpoint (handled by NextAuth).

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Bcrypt hashed
  name          String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  profiles      Profile[]
  accounts      Account[]
  sessions      Session[]
}
```

### Session Models
- `Account`: OAuth provider accounts
- `Session`: Active user sessions
- `VerificationToken`: Email verification tokens

## Security Best Practices

✅ **Implemented:**
- Bcrypt password hashing (cost 12)
- Strong password requirements
- JWT session management
- Input validation with Zod
- CSRF protection
- SQL injection prevention
- Secure cookie flags
- Server-side authentication
- Protected routes via middleware

🔐 **Additional Recommendations:**
- Enable HTTPS in production
- Set up rate limiting
- Implement account lockout after failed attempts
- Add email verification
- Enable two-factor authentication
- Set up security headers
- Monitor for suspicious activity

## Troubleshooting

### "Must be logged in" error
- Ensure NEXTAUTH_SECRET is set
- Check session is valid
- Clear cookies and log in again

### Migration errors
- Run: `npx prisma migrate reset --force`
- Then: `npx prisma migrate dev`

### Authentication not working
- Verify .env file exists
- Check DATABASE_URL is correct
- Ensure Prisma client is generated

## Testing

### Test Registration
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234"}'
```

### Test Protected Route
Try accessing `/create` without logging in - should redirect to `/login`.

## Production Deployment

Before deploying to production:

1. Generate strong NEXTAUTH_SECRET
2. Set NEXTAUTH_URL to production domain
3. Enable HTTPS
4. Set up production database
5. Run migrations on production
6. Test authentication flow
7. Enable security headers
8. Set up monitoring

---

For more information, see:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bcrypt Security](https://github.com/kelektiv/node.bcrypt.js)
