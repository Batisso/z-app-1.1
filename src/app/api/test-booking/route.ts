import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧪 TEST API: Request received');
  
  try {
    const body = await request.json();
    console.log('🧪 TEST API: Request body:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Test API working! Form data received successfully.',
      receivedData: body
    });
  } catch (error) {
    console.error('🧪 TEST API: Error:', error);
    return NextResponse.json(
      { error: 'Test API failed' },
      { status: 500 }
    );
  }
}