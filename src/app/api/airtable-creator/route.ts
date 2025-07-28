import { NextRequest, NextResponse } from 'next/server';

// Airtable configuration for Creator Applications
const AIRTABLE_BASE_ID = process.env.AIRTABLE_CREATOR_BASE_ID;
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_CREATOR_API_TOKEN;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_CREATOR_TABLE_NAME || 'Creator Applications';

// Check if required environment variables are set
if (!AIRTABLE_BASE_ID || AIRTABLE_BASE_ID === 'your_creator_applications_base_id_here') {
  console.error('AIRTABLE_CREATOR_BASE_ID is not properly configured');
}

if (!AIRTABLE_API_TOKEN || AIRTABLE_API_TOKEN === 'your_creator_applications_api_token_here') {
  console.error('AIRTABLE_CREATOR_API_TOKEN is not properly configured');
}

// Function to upload image to a temporary hosting service (using a free service)
async function uploadImageToHost(base64Data: string, filename: string): Promise<string> {
  try {
    // Remove the data:image/...;base64, prefix
    const base64Image = base64Data.split(',')[1];
    
    // Use a free image hosting service (imgbb, imgur, etc.)
    // For this example, I'll use a simple approach with a data URL
    // In production, you should use a proper hosting service
    
    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append('image', blob, filename);
    
    // Upload to imgbb (free service) - you'll need to get an API key
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    
    if (imgbbApiKey) {
      const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        return uploadResult.data.url;
      }
    }
    
    // Fallback: Use Cloudinary (if configured)
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', base64Data);
      cloudinaryFormData.append('upload_preset', 'creator_portfolio'); // You need to create this preset
      
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );
      
      if (cloudinaryResponse.ok) {
        const cloudinaryResult = await cloudinaryResponse.json();
        return cloudinaryResult.secure_url;
      }
    }
    
    // Final fallback: Return the base64 data URL (not ideal for production)
    console.warn('No image hosting service configured, using base64 data URL');
    return base64Data;
    
  } catch (error) {
    console.error('Error uploading image:', error);
    // Return the original base64 as fallback
    return base64Data;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Airtable is properly configured
    if (!AIRTABLE_BASE_ID || AIRTABLE_BASE_ID === 'your_creator_applications_base_id_here') {
      console.error('Airtable Creator Base ID is not configured');
      return NextResponse.json(
        { 
          error: 'Airtable configuration error', 
          details: 'Creator Base ID is not properly configured. Please check your environment variables.' 
        },
        { status: 500 }
      );
    }

    if (!AIRTABLE_API_TOKEN || AIRTABLE_API_TOKEN === 'your_creator_applications_api_token_here') {
      console.error('Airtable Creator API Token is not configured');
      return NextResponse.json(
        { 
          error: 'Airtable configuration error', 
          details: 'Creator API Token is not properly configured. Please check your environment variables.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.fields || !body.fields['Name'] || !body.fields['Email']) {
      return NextResponse.json(
        { error: 'Missing required fields (Name and Email are required)' },
        { status: 400 }
      );
    }

    // Prepare data for Airtable with separate fields
    const airtableData: any = {
      fields: {
        'Name': body.fields['Name'],
        'Email': body.fields['Email'],
        'Country of Origin': body.fields['Country of Origin'] || '',
        'Currently Based In': body.fields['Currently Based In'] || '',
        'Bio': body.fields['Bio'] || '',
        'Submission Date': new Date().toISOString(),
        'Status': 'Pending Review'
      }
    };

    // Handle portfolio images if they exist
    if (body.fields['Portfolio Images'] && body.fields['Portfolio Images'].length > 0) {
      console.log('Processing portfolio images...');
      
      try {
        // Upload each image and create proper Airtable attachments
        const attachments = await Promise.all(
          body.fields['Portfolio Images'].map(async (image: any, index: number) => {
            try {
              // Upload image to hosting service
              const hostedUrl = await uploadImageToHost(image.url, image.filename);
              
              // Return Airtable attachment format
              return {
                url: hostedUrl,
                filename: image.filename || `portfolio-image-${index + 1}.jpg`
              };
            } catch (error) {
              console.error(`Error processing image ${index + 1}:`, error);
              // Skip this image if upload fails
              return null;
            }
          })
        );
        
        // Filter out failed uploads
        const validAttachments = attachments.filter(attachment => attachment !== null);
        
        if (validAttachments.length > 0) {
          airtableData.fields['Portfolio Images'] = validAttachments;
          console.log(`Successfully processed ${validAttachments.length} images`);
        }
        
      } catch (error) {
        console.error('Error processing portfolio images:', error);
        // Continue without images if processing fails
      }
    }

    console.log('Sending data to Airtable:', JSON.stringify(airtableData, null, 2));

    // Send to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtableData),
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error('Airtable API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to submit to Airtable', details: errorData },
        { status: 500 }
      );
    }

    const result = await airtableResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Creator application submitted successfully',
      recordId: result.id,
      imagesProcessed: airtableData.fields['Portfolio Images']?.length || 0
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}