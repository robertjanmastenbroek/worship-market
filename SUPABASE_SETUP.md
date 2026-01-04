# 🚀 Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Project Name**: `worshipmarket`
   - **Database Password**: (Generate a strong password and save it)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for MVP

## Step 2: Get Your Project Keys

1. Once the project is created, go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

3. Update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

## Step 3: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (green play button)

## Step 4: Set Up Storage Buckets

1. Still in SQL Editor, create a new query
2. Copy the entire contents of `supabase/storage.sql`
3. Paste and **Run**

## Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation email (optional)

## Step 6: Test Your Connection

Restart your dev server:
```bash
npm run dev
```

The middleware should now connect to Supabase. You can verify by checking the browser console - you shouldn't see any Supabase errors.

## Step 7: Seed Initial Data (Optional)

Once you have authentication working, you can manually add test products through the Supabase Table Editor or wait for the UI to be connected.

---

## 🔒 Security Checklist

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Storage policies protect private files
- ✅ Auth policies ensure users can only modify their own data
- ✅ `.env.local` is in `.gitignore` (never commit secrets!)

## 📚 Next Steps

After Supabase is set up, we'll:
1. Implement authentication UI (signup/login forms)
2. Connect the product listing to real database queries
3. Build the checkout flow with order creation
4. Add Stripe Connect for payments

---

**Need Help?** Check Supabase docs: https://supabase.com/docs
