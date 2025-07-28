# Feedback System Setup Guide

This guide will walk you through setting up the feedback system with Airtable integration for your Next.js application.

## Overview

The feedback system consists of:
- A beautiful animated feedback form (`/feedback`)
- A Next.js API route that handles form submissions
- Airtable integration to store feedback data

## Prerequisites

- Next.js application (already set up)
- Airtable account
- Environment variables configured

## Step 1: Create Airtable Base and Table

### 1.1 Create a New Base
1. Go to [Airtable](https://airtable.com)
2. Click "Create a base"
3. Choose "Start from scratch"
4. Name your base (e.g., "App Feedback")

### 1.2 Set Up the Feedback Table
1. Rename the default table to "Feedback"
2. Create the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Name | Single line text | User's full name |
| Email | Email | User's email address |
| Subject | Single line text | Brief description of feedback |
| FeedbackType | Single line text | Type of feedback (feature, bug, performance, other) |
| Comments | Long text | Detailed feedback comments |

### 1.3 Field Configuration
The "FeedbackType" field will automatically receive one of these values from the frontend:
- `feature` (Feature Request)
- `bug` (Bug Report)
- `performance` (Performance)
- `other` (Other)

No additional configuration is needed for this field since it's a simple text field.

## Step 2: Get Airtable Credentials

### 2.1 Get Base ID
1. Go to your Airtable base
2. Click "Help" in the top right
3. Select "API documentation"
4. Your Base ID will be shown (starts with `app`)

### 2.2 Create Personal Access Token
1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
2. Click "Create token"
3. Give it a name (e.g., "Feedback API")
4. Select the following scopes:
   - `data.records:read`
   - `data.records:write`
5. Select your feedback base
6. Click "Create token"
7. Copy the token (starts with `pat`)

## Step 3: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Feedback Airtable Configuration
AIRTABLE_FEEDBACK_BASE_ID=your_feedback_base_id_here
AIRTABLE_FEEDBACK_API_KEY=your_feedback_personal_access_token_here
AIRTABLE_FEEDBACK_TABLE_NAME=Feedback
```

Replace:
- `your_feedback_base_id_here` with your actual Feedback Base ID
- `your_feedback_personal_access_token_here` with your Feedback Personal Access Token

## Step 4: File Structure

The feedback system includes these files:

```
src/
├── app/
│   ├── api/
│   │   └── feedback/
│   │       └── route.ts          # API endpoint for form submission
│   └── (dashboard)/
│       └── feedback/
│           └── page.tsx           # Feedback form component
└── ...
```

## Step 5: API Route Details

The API route (`src/app/api/feedback/route.ts`) handles:
- Form validation
- Airtable API communication
- Error handling
- Response formatting

### Request Format
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Feature request",
  "feedbackType": "feature",
  "comments": "Would love to see dark mode support"
}
```

### Response Format
Success (200):
```json
{
  "data": {
    "id": "recXXXXXXXXXXXXXX",
    "fields": { ... }
  }
}
```

Error (500):
```json
{
  "error": "Error message"
}
```

## Step 6: Frontend Component Features

The feedback form (`src/app/(dashboard)/feedback/page.tsx`) includes:

### Features
- ✅ Animated background with floating elements
- ✅ Form validation with real-time error display
- ✅ Responsive design (mobile-friendly)
- ✅ Loading states during submission
- ✅ Success animation after submission
- ✅ Auto-reset form after successful submission
- ✅ Focus states with subtle animations
- ✅ Gradient styling with warm color palette

### Form Fields
1. **Name** - Required text input
2. **Email** - Required email input with validation
3. **Subject** - Required text input
4. **Feedback Type** - Required selection (Feature, Bug, Performance, Other)
5. **Comments** - Required textarea for detailed feedback

### Validation Rules
- All fields are required
- Email must be valid format
- Real-time validation with error messages
- Form submission blocked until all validations pass

## Step 7: Testing the Integration

### 7.1 Test Form Submission
1. Navigate to `/feedback` in your application
2. Fill out all required fields
3. Submit the form
4. Check for success message

### 7.2 Verify Airtable Integration
1. Go to your Airtable base
2. Check the "Feedback" table
3. Verify the new record appears with correct data

### 7.3 Test Error Handling
1. Temporarily remove environment variables
2. Try submitting the form
3. Verify error handling works correctly

## Step 8: Customization Options

### 8.1 Styling Customization
The form uses Tailwind CSS classes. Key areas to customize:
- Color gradients (currently red/orange/yellow theme)
- Animation timing and effects
- Form layout and spacing
- Background animations

### 8.2 Form Fields
To add/modify form fields:
1. Update the `FeedbackFormData` interface
2. Add validation rules in `validateForm()`
3. Update the form JSX
4. Modify the Airtable table structure
5. Update the API route field mapping

### 8.3 Feedback Types
To modify feedback types:
1. Update the `feedbackTypes` array in the component
2. The Airtable field will automatically accept any text value
3. Ensure the frontend values are descriptive and consistent

## Step 9: Monitoring and Analytics

### 9.1 View Feedback Data
- Access your Airtable base to view all feedback
- Use Airtable's filtering and sorting features
- Export data for analysis

### 9.2 Error Monitoring
- Check browser console for client-side errors
- Monitor server logs for API errors
- Set up error tracking (e.g., Sentry) for production

## Troubleshooting

### Common Issues

**Form not submitting:**
- Check environment variables are set correctly
- Verify Airtable credentials and permissions
- Check browser console for errors

**Airtable errors:**
- Verify Base ID and table name are correct
- Ensure Personal Access Token has correct permissions
- Check field names match exactly

**Styling issues:**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS styles
- Verify Framer Motion is installed

### Debug Steps
1. Check browser console for errors
2. Verify API route is accessible (`/api/feedback`)
3. Test Airtable connection with a simple curl request
4. Validate environment variables are loaded

## Security Considerations

- Never expose Airtable credentials in client-side code
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Consider adding CSRF protection
- Validate and sanitize all user inputs

## Production Deployment

Before deploying to production:
1. Set environment variables in your hosting platform
2. Test the complete flow in staging environment
3. Set up error monitoring
4. Consider implementing rate limiting
5. Add analytics tracking if needed

## Support

If you encounter issues:
1. Check this guide for troubleshooting steps
2. Verify all environment variables are set
3. Test each component individually
4. Check Airtable API documentation for updates

---

**Last Updated:** January 2025
**Version:** 1.0.0