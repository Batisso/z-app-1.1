# Airtable Waitlist Setup Guide

This guide will help you set up Airtable to collect email waitlist entries from your Zadulis Shop.

## Prerequisites

1. An Airtable account (free tier is sufficient)
2. The Airtable package installed in your project (already done)

## Step 1: Create an Airtable Base

1. Go to [Airtable.com](https://airtable.com) and sign in
2. Click "Create a base" or use an existing base
3. Name your base (e.g., "Zadulis Shop Waitlist")

## Step 2: Set Up Your Table

1. Create a table called "Waitlist" (or use the default table and rename it)
2. Set up the following columns:
   - **Email** (Single line text) - Primary field
   - **Signup Date** (Date & time)
   - **Country** (Single line text) - OPTIONAL: User's country
   - **Discipline** (Single line text) - OPTIONAL: User's discipline/field
   - **Source** (Single line text) - to track where signups came from
   - **Status** (Single select) - OPTIONAL: Add options like "Active", "Contacted", "Converted"

### Important: Status Field Setup
If you want to use the Status field:
1. Create the field as "Single select"
2. Add these options manually: "Active", "Contacted", "Converted"
3. Make sure "Active" is one of the predefined options
4. Update your Personal Access Token to include schema modification permissions if needed

**For simplicity, you can skip the Status field initially and add it later.**

## Step 3: Get Your API Credentials

### Get Your Personal Access Token:
1. Go to [Airtable Developer Hub](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Give your token a name (e.g., "Zadulis Shop Waitlist")
4. Set the scopes:
   - **data.records:read** - to check for duplicate emails
   - **data.records:write** - to create new waitlist entries
5. Add access to your specific base:
   - Click "Add a base"
   - Select your waitlist base
   - Choose the permissions: "Create records", "Read records"
6. Click "Create token"
7. Copy your Personal Access Token (keep it secure!)

### Get Your Base ID:
1. Go to [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
2. Select your base from the list
3. Your Base ID will be shown in the URL and documentation (starts with "app...")

### Get Your Table Name:
- Use the exact name of your table (case-sensitive)
- Default: "Waitlist"

## Step 4: Update Environment Variables

Update your `.env.local` file with your Airtable credentials:

```env
# Airtable Configuration
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_personal_access_token_here
AIRTABLE_BASE_ID=your_actual_base_id_here
AIRTABLE_TABLE_NAME=Waitlist
```

**Important:** Replace the placeholder values with your actual credentials!

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your shop page
3. Enter an email address and submit the form
4. Check your Airtable base to see if the record was created

## Features Included

✅ **Email Validation** - Ensures valid email format
✅ **Duplicate Prevention** - Prevents the same email from being added twice
✅ **Error Handling** - Graceful error messages for users
✅ **Loading States** - Visual feedback during submission
✅ **Success Messages** - Confirmation when email is successfully added
✅ **Automatic Timestamps** - Records when each signup occurred
✅ **Source Tracking** - Tracks that signups came from your website

## API Endpoints

- **POST** `/api/waitlist/airtable` - Add email to waitlist
- **GET** `/api/waitlist/airtable` - Get waitlist count (for analytics)

## Airtable Table Structure

| Email | Signup Date | Status | Source |
|-------|-------------|--------|--------|
| user@example.com | 2024-01-15 10:30 AM | Active | Zadulis Shop Website |

## Security Notes

- **Personal Access Tokens** are server-side only and not exposed to the client
- Tokens have specific scopes and base permissions for enhanced security
- Email validation prevents malicious input
- Rate limiting can be added if needed
- Consider adding CAPTCHA for production use
- **Never commit your Personal Access Token to version control**

## Important: Personal Access Token vs API Keys

As of February 1st, 2024, Airtable has deprecated API keys in favor of Personal Access Tokens (PATs). PATs provide:

- **Enhanced Security**: Scoped permissions instead of full account access
- **Base-specific Access**: Tokens can be limited to specific bases
- **Granular Permissions**: Choose exactly what operations are allowed
- **Better Audit Trail**: Track which tokens are used for what purposes

## Troubleshooting

### Common Issues:

1. **"Failed to join waitlist"** - Check your Personal Access Token and permissions
2. **"This email is already on our waitlist"** - Email already exists (working as intended)
3. **Network errors** - Check your internet connection and Airtable status
4. **Permission errors** - Ensure your token has both "read" and "write" permissions for records

### Token Permission Issues:
If you get permission errors, verify your token has:
- ✅ `data.records:read` scope
- ✅ `data.records:write` scope
- ✅ Access to your specific base
- ✅ "Create records" and "Read records" permissions

### Status Field Issues:
If you see "INVALID_MULTIPLE_CHOICE_OPTIONS" error:
1. **Option 1 (Recommended)**: Remove the Status field from your table for now
2. **Option 2**: Manually add "Active" as an option in your Status field:
   - Go to your Airtable table
   - Click on the Status field header
   - Add "Active", "Contacted", "Converted" as options
   - Save the field configuration
3. **Option 3**: Update your token to include schema modification permissions (advanced)

### Debug Mode:
In development, detailed error messages are shown. In production, generic error messages protect sensitive information.

## Next Steps

1. Set up email notifications when new signups occur
2. Create automated email sequences for waitlist members
3. Add analytics to track conversion rates
4. Consider integrating with your email marketing platform

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are correct
3. Test your Airtable API credentials directly
4. Ensure your table structure matches the expected format