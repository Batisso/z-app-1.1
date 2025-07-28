# Airtable Creator Booking Setup Guide

This guide will help you set up Airtable to collect creator booking requests from your Zadulis platform.

## Prerequisites

1. An Airtable account (free tier is sufficient)
2. The Airtable package installed in your project (already done)
3. Existing Personal Access Token from the waitlist setup

## Step 1: Create a New Airtable Base (or Use Existing)

### Option A: Create New Base
1. Go to [Airtable.com](https://airtable.com) and sign in
2. Click "Create a base" 
3. Name your base (e.g., "Zadulis Creator Bookings")

### Option B: Add Table to Existing Base
1. Open your existing Zadulis base
2. Click the "+" tab to add a new table
3. Name it "Creator Bookings"

## Step 2: Set Up Your Creator Bookings Table

Create a table called "Creator Bookings" with the following columns:

### Required Fields:
- **Client Name** (Single line text) - Primary field
- **Email** (Email) - Client's email address
- **Project Type** (Single select) - Type of project
- **Description** (Long text) - Project description
- **Booking Date** (Date & time) - When the request was submitted
- **Status** (Single select) - Request status
- **Source** (Single line text) - Always "Zadulis Platform"

### Optional Fields:
- **Phone** (Phone number) - Client's phone number
- **Company** (Single line text) - Client's company/organization
- **Budget Range** (Single select) - Project budget range
- **Timeline** (Single select) - Project timeline
- **Preferred Contact** (Single select) - How client prefers to be contacted
- **Creator Name** (Single line text) - Name of the creator being booked
- **Creator ID** (Single line text) - Internal creator ID

### Field Configuration Details:

#### Project Type (Single Select Options):
- Custom Commission
- Collaboration
- Exhibition
- Workshop/Teaching
- Commercial Project
- Other

#### Status (Single Select Options):
- New Request
- In Review
- Contacted Client
- Quote Sent
- Accepted
- In Progress
- Completed
- Declined
- Cancelled

#### Budget Range (Single Select Options):
- Under $1,000
- $1,000 - $5,000
- $5,000 - $10,000
- $10,000 - $25,000
- $25,000 - $50,000
- $50,000+
- Prefer to discuss

#### Timeline (Single Select Options):
- ASAP
- Within 1 month
- 2-3 months
- 3-6 months
- 6+ months
- Flexible

#### Preferred Contact (Single Select Options):
- email
- phone
- video-call
- in-person

## Step 3: Update Environment Variables

Add these new environment variables to your `.env.local` file:

```env
# Existing Airtable Configuration (from waitlist setup)
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_personal_access_token_here

# Creator Booking Configuration
AIRTABLE_BOOKING_BASE_ID=your_booking_base_id_here
AIRTABLE_BOOKING_TABLE_NAME=Creator Bookings
```

### Getting Your Booking Base ID:

#### If Using New Base:
1. Go to [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
2. Select your new booking base from the list
3. Your Base ID will be shown in the URL and documentation (starts with "app...")

#### If Using Existing Base:
- Use the same `AIRTABLE_BASE_ID` from your waitlist setup
- The table name will differentiate between waitlist and booking data

## Step 4: Update Personal Access Token Permissions

If you're using a new base, update your Personal Access Token:

1. Go to [Airtable Developer Hub](https://airtable.com/create/tokens)
2. Find your existing token or create a new one
3. Ensure it has these scopes:
   - **data.records:read** - to check for duplicates and get statistics
   - **data.records:write** - to create new booking entries
4. Add access to your booking base:
   - Click "Add a base"
   - Select your booking base
   - Choose permissions: "Create records", "Read records"
5. Save the token

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to a creator's detail page
3. Click "Book This Creator"
4. Fill out and submit the booking form
5. Check your Airtable base to see if the record was created

## Features Included

✅ **Form Validation** - Ensures required fields are filled
✅ **Email Validation** - Validates email format
✅ **Error Handling** - Graceful error messages for users
✅ **Loading States** - Visual feedback during submission
✅ **Success Messages** - Confirmation when booking is submitted
✅ **Automatic Timestamps** - Records when each booking was made
✅ **Creator Tracking** - Links bookings to specific creators
✅ **Status Management** - Track booking progress
✅ **Analytics Endpoint** - Get booking statistics

## API Endpoints

- **POST** `/api/booking/airtable` - Submit booking request
- **GET** `/api/booking/airtable` - Get booking statistics (for admin dashboard)

## Airtable Table Structure

| Client Name | Email | Project Type | Creator Name | Status | Booking Date | Budget Range |
|-------------|-------|--------------|--------------|--------|--------------|--------------|
| John Doe | john@example.com | Custom Commission | Artist Name | New Request | 2024-01-15 10:30 AM | $1,000 - $5,000 |

## Security Notes

- **Server-side Processing** - All API calls are server-side only
- **Input Validation** - All form data is validated before storage
- **Error Handling** - Sensitive information is not exposed to clients
- **Rate Limiting** - Consider adding rate limiting for production
- **CAPTCHA** - Consider adding CAPTCHA for spam prevention

## Troubleshooting

### Common Issues:

1. **"Failed to submit booking request"** 
   - Check your Personal Access Token permissions
   - Verify the base ID is correct
   - Ensure table name matches exactly

2. **"Please enter a valid email address"**
   - Email validation is working correctly
   - User needs to provide valid email format

3. **Missing fields in Airtable**
   - Verify all required fields exist in your table
   - Check field names match exactly (case-sensitive)
   - Ensure Single Select options are configured

4. **Permission errors**
   - Verify token has both "read" and "write" permissions
   - Check that token has access to the correct base
   - Ensure scopes include `data.records:read` and `data.records:write`

### Debug Mode:
In development, detailed error messages are shown in the console. Check browser developer tools for specific error details.

## Next Steps

1. **Creator Dashboard** - Build interface for creators to manage bookings
2. **Admin Analytics** - Create dashboard for platform statistics
3. **Email Templates** - Set up automated email responses
4. **Payment Integration** - Add payment processing for bookings
5. **Calendar Integration** - Schedule meetings and deadlines

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are correct
3. Test your Airtable API credentials directly
4. Ensure your table structure matches the expected format
5. Check that all Single Select options are properly configured