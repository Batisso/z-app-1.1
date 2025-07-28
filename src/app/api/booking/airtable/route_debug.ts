import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Log environment variables on startup (without exposing sensitive data)
console.log('🔧 Booking API Environment Check:', {
  hasToken: !!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
  hasBookingBaseId: !!process.env.AIRTABLE_BOOKING_BASE_ID,
  bookingTableName: process.env.AIRTABLE_BOOKING_TABLE_NAME,
  tokenLength: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN?.length,
  baseId: process.env.AIRTABLE_BOOKING_BASE_ID?.substring(0, 10) + '...'
});

// Configure Airtable with Personal Access Token
const base = new Airtable({
  apiKey: process.env.AIRTABLE_BOOKING_PERSONAL_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BOOKING_BASE_ID!);

const table = base(process.env.AIRTABLE_BOOKING_TABLE_NAME || 'Creator Bookings');

export async function POST(request: NextRequest) {
  console.log('🔄 Booking API POST request received');
  
  try {
    const requestBody = await request.json();
    console.log('📝 Request body received:', requestBody);

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

    // Prepare fields for Airtable record
    const fields: any = {
      'Client Name': name,
      'Email': email,
      'Project Type': projectType,
      'Description': description,
      'Preferred Contact': preferredContact || 'email',
      'Booking Date': new Date().toISOString(),
      'Status': 'New Request',
      'Source': 'Zadulis Platform'
    };

    // Add optional fields if provided
    if (phone) fields['Phone'] = phone;
    if (company) fields['Company'] = company;
    if (budget) fields['Budget Range'] = budget;
    if (timeline) fields['Timeline'] = timeline;
    if (creatorName) fields['Creator Name'] = creatorName;
    if (creatorId) fields['Creator ID'] = creatorId;

    console.log('📊 Prepared Airtable fields:', fields);

    // Test Airtable connection
    console.log('🔗 Testing Airtable connection...');
    console.log('📍 Table info:', {
      baseId: process.env.AIRTABLE_BOOKING_BASE_ID,
      tableName: process.env.AIRTABLE_BOOKING_TABLE_NAME
    });

    // Create new record in Airtable
    console.log('💾 Creating Airtable record...');
    const record = await table.create([{ fields }]);
    console.log('✅ Record created successfully:', record[0].id);

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