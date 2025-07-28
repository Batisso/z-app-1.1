# Airtable Integration Guide for Creator Form

This guide will help you set up Airtable integration for the "Become a Creator" form in your Zadulis app.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setting up Airtable](#setting-up-airtable)
3. [Getting API Credentials](#getting-api-credentials)
4. [Configuring the Application](#configuring-the-application)
5. [Form Data Structure](#form-data-structure)
6. [Testing the Integration](#testing-the-integration)
7. [Handling Images](#handling-images)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

## 🎯 Overview

The creator form has been modified to:
- Collect all text fields (Name, Email, Country of Origin, Currently Based In, Bio) into a single "Creator Info" text field in Airtable
- Handle portfolio images as attachments (up to 12 images)
- Include automatic timestamp and status tracking
- Provide error handling and user feedback

## 🚀 Setting up Airtable

### Step 1: Create a New Base

1. Go to [Airtable.com](https://airtable.com) and sign in to your account
2. Click "Create a base" or use an existing base
3. Choose "Start from scratch" for a new base
4. Name your base (e.g., "Zadulis Creator Applications")

### Step 2: Set Up the Table Structure

Create a table called "Creator Applications" with the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Creator Info | Long text | Contains all form data as formatted text |
| Portfolio Images | Attachment | Up to 12 portfolio images |
| Submission Date | Date & time | Automatically set when record is created |
| Status | Single select | Options: "Pending Review", "Approved", "Rejected" |
| Notes | Long text | For internal notes (optional) |

#### Setting up the Status field:
1. Add a "Single select" field named "Status"
2. Add these options:
   - Pending Review (Yellow)
   - Approved (Green)
   - Rejected (Red)
   - Under Review (Blue)

## 🔑 Getting API Credentials

### Step 1: Get Your Base ID

1. Go to your Airtable base
2. Click "Help" in the top-right corner
3. Select "API documentation"
4. Your Base ID will be shown at the top (starts with "app...")
5. Copy this ID - you'll need it for configuration

### Step 2: Create a Personal Access Token

1. Go to [Airtable Account Settings](https://airtable.com/account)
2. Click on "Developer hub" in the left sidebar
3. Click "Personal access tokens"
4. Click "Create new token"
5. Give it a name (e.g., "Zadulis Creator Form")
6. Set the following scopes:
   - `data.records:read`
   - `data.records:write`
7. Select your base under "Access"
8. Click "Create token"
9. Copy the token (starts with "pat...") - you'll need it for configuration

⚠️ **Important**: Store this token securely and never commit it to version control!

## ⚙️ Configuring the Application

### Step 1: Update Environment Variables

Open the `.env.local` file in your project root and update it with your credentials:

```env
# Airtable Configuration
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_API_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Replace the placeholder values with your actual:
- Base ID (from Step 1 above)
- Personal Access Token (from Step 2 above)

### Step 2: Verify API Route

The API route is located at `src/app/api/airtable-creator/route.ts`. You can customize:

- Table name (currently set to "Creator Applications")
- Field mappings
- Error handling
- Additional data processing

## 📊 Form Data Structure

### Creator Info Field Format

The "Creator Info" field in Airtable will contain formatted text like this:

```
Name: John Doe
Email: john.doe@example.com
Country of Origin: United States
Currently Based In: Canada
Bio: I'm a passionate photographer and content creator with 5 years of experience in digital marketing. I love capturing moments that tell stories and creating engaging visual content for social media platforms.
```

### Portfolio Images

- Stored as Airtable attachments
- Up to 12 images per submission
- Original filenames are preserved
- Images are automatically resized by Airtable for optimal storage

### Additional Fields

- **Submission Date**: Automatically set to current timestamp
- **Status**: Defaults to "Pending Review"
- **Notes**: Empty by default, for internal use

## 🧪 Testing the Integration

### Step 1: Test Form Submission

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the creator form page
3. Fill out all required fields
4. Upload 1-3 test images
5. Submit the form

### Step 2: Verify in Airtable

1. Check your Airtable base
2. Look for a new record in the "Creator Applications" table
3. Verify all data is correctly formatted
4. Check that images are properly attached

### Step 3: Test Error Handling

1. Try submitting with missing required fields
2. Test with invalid email format
3. Try uploading more than 12 images
4. Verify appropriate error messages are shown

## 🖼️ Handling Images

### Production-Ready Implementation

The current implementation includes proper image hosting integration for Airtable attachments. Images are uploaded to external hosting services and stored as proper attachments.

### Supported Hosting Services

1. **ImgBB** (Free, easy setup):
   - 32MB per image limit
   - Unlimited uploads
   - Perfect for testing and small applications

2. **Cloudinary** (Production-ready):
   - 25GB free storage/month
   - Advanced image optimization
   - CDN delivery
   - Perfect for production applications

### Setup Instructions

**See the detailed [IMAGE_HOSTING_SETUP.md](./IMAGE_HOSTING_SETUP.md) guide** for complete setup instructions for both ImgBB and Cloudinary.

### Quick Setup Summary

1. **Choose a hosting service** (ImgBB for simplicity, Cloudinary for production)
2. **Get API credentials** from your chosen service
3. **Add credentials to `.env.local`**:
   ```env
   # For ImgBB
   IMGBB_API_KEY=your_api_key
   
   # OR for Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Test the integration** by submitting the form with images

### Benefits of This Implementation

- **Proper Airtable attachments**: Images appear as clickable attachments, not text
- **Automatic fallback**: If hosting fails, form still submits (without images)
- **Multiple service support**: Choose the best service for your needs
- **Error handling**: Robust error handling for failed uploads
- **Production ready**: Scales from development to production

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to submit to Airtable" Error

**Possible causes:**
- Incorrect Base ID or API Token
- Table name doesn't match
- Field names don't match
- API token lacks required permissions

**Solutions:**
- Double-check your credentials in `.env.local`
- Verify table and field names in Airtable
- Ensure API token has read/write permissions

#### 2. Images Not Uploading

**Possible causes:**
- File size too large
- Unsupported file format
- Network timeout

**Solutions:**
- Compress images before upload
- Add file size validation
- Implement retry logic

#### 3. Form Submission Timeout

**Possible causes:**
- Large image files
- Slow network connection
- Server timeout

**Solutions:**
- Add loading states
- Implement progress indicators
- Consider chunked uploads for large files

### Debug Mode

Add this to your API route for debugging:

```typescript
console.log('Received data:', JSON.stringify(body, null, 2));
console.log('Airtable response:', await airtableResponse.text());
```

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env.local` to version control
- Use different tokens for development and production
- Regularly rotate API tokens

### Input Validation

The current implementation includes basic validation. Consider adding:

```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
}

// File size validation
const maxFileSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxFileSize) {
  return NextResponse.json({ error: 'File too large' }, { status: 400 });
}
```

### Rate Limiting

Consider implementing rate limiting to prevent abuse:

```typescript
// Example using a simple in-memory store
const submissions = new Map();
const maxSubmissionsPerHour = 5;
```

## 📈 Next Steps

### Enhancements to Consider

1. **Email Notifications**
   - Send confirmation emails to applicants
   - Notify admins of new submissions

2. **File Upload Improvements**
   - Progress indicators
   - Drag & drop enhancements
   - Image preview optimization

3. **Admin Dashboard**
   - View submissions directly in your app
   - Bulk actions for approvals/rejections
   - Analytics and reporting

4. **Advanced Validation**
   - Image format validation
   - Duplicate submission prevention
   - Spam detection

### Monitoring

Set up monitoring for:
- API response times
- Error rates
- Submission volumes
- Failed uploads

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Airtable setup matches this guide
3. Test with minimal data first
4. Check Airtable API documentation for updates

## 🎉 Conclusion

Your creator form is now integrated with Airtable! The form will:
- ✅ Collect all creator information in a structured format
- ✅ Handle portfolio image uploads
- ✅ Provide real-time feedback to users
- ✅ Store data securely in Airtable
- ✅ Include automatic timestamps and status tracking

Remember to test thoroughly before deploying to production and consider implementing the security and performance enhancements mentioned in this guide.