import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configure Airtable with Personal Access Token
const base = new Airtable({
  apiKey: process.env.AIRTABLE_BOOKING_PERSONAL_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BOOKING_BASE_ID!);

const table = base(process.env.AIRTABLE_BOOKING_TABLE_NAME || 'Creator Bookings');

export async function POST(request: NextRequest) {
  try {
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
    } = await request.json();

    if (!name || !email || !projectType || !description) {
      return NextResponse.json(
        { error: 'Name, email, project type, and description are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

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

    // Create new record in Airtable
    const record = await table.create([{ fields }]);

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
    
    return NextResponse.json(
      { 
        error: 'Failed to submit booking request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get booking count for analytics
    const records = await table.select({
      fields: ['Client Name', 'Creator Name', 'Status']
    }).all();

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

    return NextResponse.json({
      count: records.length,
      stats,
      message: 'Booking statistics retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error getting booking statistics:', error);
    
    return NextResponse.json(
      { error: 'Failed to get booking statistics' },
      { status: 500 }
    );
  }
}