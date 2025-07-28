# Image Hosting Setup for Airtable Attachments

This guide explains how to set up image hosting services so that portfolio images are properly stored as attachments in your Airtable base.

## 🎯 Overview

For Airtable to properly display images as attachments, the images need to be hosted on a publicly accessible URL. This implementation supports two popular free image hosting services:

1. **ImgBB** (Recommended for simplicity)
2. **Cloudinary** (Recommended for production)

## 🚀 Option 1: ImgBB Setup (Easiest)

ImgBB is a free image hosting service that's perfect for getting started quickly.

### Step 1: Create ImgBB Account

1. Go to [ImgBB.com](https://imgbb.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Get API Key

1. After logging in, go to [API Settings](https://api.imgbb.com/)
2. Click "Get API Key"
3. Copy your API key (it will look like: `1234567890abcdef`)

### Step 3: Configure Environment

Add to your `.env.local` file:
```env
IMGBB_API_KEY=your_actual_api_key_here
```

### ImgBB Limits
- **Free tier**: 32 MB per image, unlimited uploads
- **Rate limit**: No strict limits for reasonable usage
- **Perfect for**: Testing and small-scale applications

## 🏢 Option 2: Cloudinary Setup (Production Ready)

Cloudinary is a more robust solution with advanced image processing capabilities.

### Step 1: Create Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Complete the verification process

### Step 2: Get Credentials

1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Find your credentials in the "Account Details" section:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz123456`

### Step 3: Create Upload Preset

1. In your Cloudinary dashboard, go to "Settings" → "Upload"
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Configure the preset:
   - **Preset name**: `creator_portfolio`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `creator-applications` (optional)
   - **Allowed formats**: `jpg,jpeg,png,gif,webp`
   - **Max file size**: `10000000` (10MB)
   - **Max image width**: `2000`
   - **Max image height**: `2000`
5. Save the preset

### Step 4: Configure Environment

Add to your `.env.local` file:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### Cloudinary Benefits
- **Free tier**: 25 GB storage, 25 GB bandwidth/month
- **Image optimization**: Automatic format conversion and compression
- **Transformations**: Resize, crop, and enhance images on-the-fly
- **CDN**: Global content delivery network
- **Perfect for**: Production applications

## 🔧 How It Works

### Image Upload Flow

1. **User uploads images** in the form
2. **Frontend converts** images to base64
3. **API receives** the form data with base64 images
4. **API uploads each image** to your chosen hosting service
5. **Hosting service returns** public URLs
6. **API sends data to Airtable** with proper attachment URLs
7. **Airtable displays** images as proper attachments

### Code Implementation

The API route (`/api/airtable-creator/route.ts`) includes:

```typescript
// Upload to ImgBB
if (imgbbApiKey) {
  const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: 'POST',
    body: formData,
  });
  // Returns hosted URL
}

// Upload to Cloudinary
if (cloudinaryCloudName) {
  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: 'POST',
      body: cloudinaryFormData,
    }
  );
  // Returns hosted URL
}
```

## 🧪 Testing the Setup

### Step 1: Configure Your Service

Choose either ImgBB or Cloudinary and add the credentials to `.env.local`

### Step 2: Test the Form

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the creator form
3. Fill out the form and upload 1-2 test images
4. Submit the form

### Step 3: Verify in Airtable

1. Check your Airtable base
2. Look for the new record
3. Verify that the "Portfolio Images" field shows actual image attachments (not just text)
4. Click on the images to ensure they load properly

### Step 4: Check Console Logs

Monitor your development console for:
```
Processing portfolio images...
Successfully processed X images
```

## 🔍 Troubleshooting

### Images Not Appearing as Attachments

**Problem**: Images show as text or don't appear
**Solutions**:
- Verify your API keys are correct
- Check that the hosting service is responding
- Look for error messages in the console

### Upload Failures

**Problem**: Images fail to upload to hosting service
**Solutions**:
- Check file size limits (ImgBB: 32MB, Cloudinary: configurable)
- Verify image formats are supported
- Check your internet connection
- Ensure API keys have proper permissions

### Airtable Errors

**Problem**: Data reaches Airtable but images don't show
**Solutions**:
- Verify the "Portfolio Images" field is set to "Attachment" type
- Check that the URLs are publicly accessible
- Ensure the URLs use HTTPS (required by Airtable)

## 📊 Monitoring Usage

### ImgBB
- No built-in usage dashboard
- Monitor through API responses
- Free tier has no strict limits

### Cloudinary
- Detailed usage dashboard available
- Monitor storage and bandwidth usage
- Set up usage alerts in dashboard

## 🔒 Security Considerations

### API Key Protection
- Never commit API keys to version control
- Use environment variables only
- Rotate keys periodically

### Image Validation
The current implementation includes basic validation:
- File type checking (images only)
- File size limits
- Error handling for failed uploads

### Rate Limiting
Consider implementing rate limiting to prevent abuse:
```typescript
// Example rate limiting logic
const submissions = new Map();
const maxUploadsPerHour = 50;
```

## 🚀 Production Recommendations

### For Small Applications
- **Use ImgBB**: Simple setup, reliable, free
- **Monitor usage**: Keep track of upload volumes
- **Backup strategy**: Consider downloading images periodically

### For Production Applications
- **Use Cloudinary**: Better performance, more features
- **Enable transformations**: Optimize images automatically
- **Set up monitoring**: Track usage and performance
- **Implement caching**: Reduce API calls where possible

### Alternative Services
If you need other options:
- **AWS S3**: Most scalable, requires more setup
- **Google Cloud Storage**: Good integration with other Google services
- **Vercel Blob**: Great for Next.js applications
- **Supabase Storage**: Good for full-stack applications

## 📈 Scaling Considerations

### High Volume Applications
- Implement image compression before upload
- Use background job processing for uploads
- Consider multiple hosting services for redundancy
- Implement retry logic for failed uploads

### Cost Optimization
- Monitor usage regularly
- Implement image optimization
- Consider CDN caching strategies
- Set up usage alerts

## ✅ Final Checklist

Before going live:
- [ ] Image hosting service configured and tested
- [ ] API keys properly set in environment variables
- [ ] Airtable field configured as "Attachment" type
- [ ] Form submission tested end-to-end
- [ ] Images appear as proper attachments in Airtable
- [ ] Error handling tested (try uploading invalid files)
- [ ] Usage monitoring set up (for production)

Your creator form now properly handles images as Airtable attachments! 🎉