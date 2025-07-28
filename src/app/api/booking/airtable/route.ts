import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Log environment variables on startup (without exposing sensitive data)
console.log('🔧 Booking API Environment Check:', {
  hasBookingToken: !!process.env.AIRTABLE_BOOKING_PERSONAL_ACCESS_TOKEN,
  hasFallbackToken: !!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
  hasBookingBaseId: !!process.env.AIRTABLE_BOOKING_BASE_ID,
  bookingTableName: process.env.AIRTABLE_BOOKING_TABLE_NAME,
  bookingTokenLength: process.env.AIRTABLE_BOOKING_PERSONAL_ACCESS_TOKEN?.length,
  fallbackTokenLength: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN?.length,
  baseId: process.env.AIRTABLE_BOOKING_BASE_ID?.substring(0, 10) + '...'
});

// Configure Airtable with Separate Booking Personal Access Token (fallback to main token)
const bookingToken = process.env.AIRTABLE_BOOKING_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
console.log('🔑 Using token:', bookingToken ? 'Found' : 'Missing', '- Length:', bookingToken?.length);

if (!bookingToken) {
  console.error('❌ No Airtable token found! Check your environment variables.');
}

if (!process.env.AIRTABLE_BOOKING_BASE_ID) {
  console.error('❌ No booking base ID found! Check AIRTABLE_BOOKING_BASE_ID in your environment variables.');
}

const base = new Airtable({
  apiKey: bookingToken,
}).base(process.env.AIRTABLE_BOOKING_BASE_ID!);

const table = base(process.env.AIRTABLE_BOOKING_TABLE_NAME || 'Creator Bookings');

export async function POST(request: NextRequest) {
  console.log('🔄 Booking API POST request received');
  
  try {
    const requestBody = await request.json();
    console.log('📝 Request body received:', {
      ...requestBody,
      description: requestBody.description?.substring(0, 50) + '...' // Truncate for logging
    });

    const { 
      name, 
      email, 
      phone, 
      company, 
      projectType, 
      budget, 
      timeline, 
      description, 
      preferredContact,
      creatorName,
      creatorId 
    } = requestBody;

    console.log('🔍 Extracted form data:', {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      description: description?.substring(0, 50) + '...',
      preferredContact,
      creatorName,
      creatorId
    });

    // Validation
    if (!name || !email || !projectType || !description) {
      console.log('❌ Validation failed - missing required fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasProjectType: !!projectType,
        hasDescription: !!description
      });
      return NextResponse.json(
        { error: 'Name, email, project type, and description are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email validation failed:', email);
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Prepare fields for Airtable record - using raw text values for Single Line Text fields
    const fields: any = {
      'Client Name': name,
      'Email': email,
      'Project Type': projectType, // Raw value for Single Line Text field
      'Description': description,
      'Preferred Contact': preferredContact || 'email', // Raw value for Single Line Text field
      'Booking Date': new Date().toISOString(),
      'Status': 'New Request',
      'Source': 'Zadulis Platform'
    };

    // Add optional fields if provided - using raw values for Single Line Text fields
    if (phone) fields['Phone'] = phone;
    if (company) fields['Company'] = company;
    if (budget) fields['Budget Range'] = budget; // Raw value for Single Line Text field
    if (timeline) fields['Timeline'] = timeline; // Raw value for Single Line Text field
    if (creatorName) fields['Creator Name'] = creatorName;
    if (creatorId) fields['Creator ID'] = creatorId;

    console.log('📊 Prepared Airtable fields:', {
      ...fields,
      'Description': fields['Description']?.substring(0, 50) + '...' // Truncate for logging
    });

    // Test Airtable connection
    console.log('🔗 Testing Airtable connection...');
    console.log('📍 Table info:', {
      baseId: process.env.AIRTABLE_BOOKING_BASE_ID,
      tableName: process.env.AIRTABLE_BOOKING_TABLE_NAME,
      hasToken: !!bookingToken
    });

    // Create new record in Airtable with fallback strategy
    console.log('💾 Creating Airtable record...');
    let record;
    
    try {
      // First attempt: try with all fields
      record = await table.create([{ fields }]);
      console.log('✅ Record created successfully:', record[0].id);
    } catch (firstError) {
      console.log('⚠️ First attempt failed, trying with minimal fields...');
      console.log('First error:', firstError);
      
      // Fallback: Create with only essential fields that are likely to be text fields
      const minimalFields: any = {
        'Client Name': name,
        'Email': email,
        'Description': description,
        'Booking Date': new Date().toISOString(),
        'Status': 'New Request',
        'Source': 'Zadulis Platform'
      };
      
      // Add optional text fields
      if (phone) minimalFields['Phone'] = phone;
      if (company) minimalFields['Company'] = company;
      if (creatorName) minimalFields['Creator Name'] = creatorName;
      if (creatorId) minimalFields['Creator ID'] = creatorId;
      
      // Add project type and other fields as text in description if they fail as select fields
      const additionalInfo = [];
      if (projectType) additionalInfo.push(`Project Type: ${projectType}`);
      if (budget) additionalInfo.push(`Budget: ${budget}`);
      if (timeline) additionalInfo.push(`Timeline: ${timeline}`);
      if (preferredContact) additionalInfo.push(`Preferred Contact: ${preferredContact}`);
      
      if (additionalInfo.length > 0) {
        minimalFields['Description'] = `${description}\n\nAdditional Details:\n${additionalInfo.join('\n')}`;
      }
      
      console.log('📊 Trying with minimal fields:', minimalFields);
      
      try {
        record = await table.create([{ fields: minimalFields }]);
        console.log('✅ Record created successfully with minimal fields:', record[0].id);
      } catch (secondError) {
        console.error('❌ Even minimal fields failed:', secondError);
        throw secondError; // Re-throw the error to be handled by outer catch
      }
    }

    console.log('✅ Booking request saved to Airtable:', {
      clientName: name,
      email,
      creatorName: creatorName || 'Unknown',
      projectType,
      recordId: record[0].id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `Thank you ${name}! Your booking request has been sent. The creator will contact you within 24-48 hours.`,
      recordId: record[0].id
    });

  } catch (error) {
    console.error('❌ Error saving booking to Airtable:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });

    // Check for specific Airtable errors
    if (error instanceof Error) {
      if (error.message.includes('INVALID_REQUEST_UNKNOWN')) {
        console.error('❌ Airtable Error: Unknown field or invalid request structure');
      } else if (error.message.includes('NOT_FOUND')) {
        console.error('❌ Airtable Error: Base or table not found');
      } else if (error.message.includes('AUTHENTICATION_REQUIRED')) {
        console.error('❌ Airtable Error: Invalid or missing API token');
      } else if (error.message.includes('REQUEST_TOO_LARGE')) {
        console.error('❌ Airtable Error: Request data too large');
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit booking request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? {
          message: error instanceof Error ? error.message : 'Unknown error',
          type: error instanceof Error ? error.name : 'Unknown'
        } : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('🔄 Booking API GET request received');
  
  try {
    console.log('📊 Fetching booking statistics...');
    
    // Get booking count for analytics
    const records = await table.select({
      fields: ['Client Name', 'Creator Name', 'Status']
    }).all();

    console.log('📈 Records fetched:', records.length);

    const stats = {
      total: records.length,
      byStatus: records.reduce((acc: any, record) => {
        const status = record.fields['Status'] as string || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),
      byCreator: records.reduce((acc: any, record) => {
        const creator = record.fields['Creator Name'] as string || 'Unknown';
        acc[creator] = (acc[creator] || 0) + 1;
        return acc;
      }, {})
    };

    console.log('📊 Statistics calculated:', stats);

    return NextResponse.json({
      count: records.length,
      stats,
      message: 'Booking statistics retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error getting booking statistics:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json(
      { error: 'Failed to get booking statistics' },
      { status: 500 }
    );
  }
}