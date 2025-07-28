import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, timestamp } = await request.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    const {
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY,
      ADMIN_EMAIL
    } = process.env;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !ADMIN_EMAIL) {
      console.log('Email environment variables not configured. Logging signup instead:', {
        email,
        timestamp,
        note: 'Configure EmailJS environment variables to enable email notifications'
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Waitlist signup recorded (email notification pending configuration)' 
      });
    }

    // Send email using EmailJS
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: ADMIN_EMAIL,
          from_email: email,
          user_email: email,
          signup_time: timestamp,
          message: `New Zadulis Shop waitlist signup!\n\nEmail: ${email}\nTime: ${timestamp}`,
        }
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('EmailJS API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorText
      });
      
      // Log the signup for manual follow-up
      console.log('WAITLIST SIGNUP (email failed, manual follow-up needed):', {
        email,
        timestamp,
        error: errorText
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Waitlist signup recorded' 
      });
    }

    console.log('Waitlist email sent successfully for:', email);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully' 
    });

  } catch (error) {
    console.error('Error in send-waitlist-email API:', error);
    
    // Extract email from request for logging if possible
    try {
      const { email, timestamp } = await request.json();
      console.log('WAITLIST SIGNUP (error occurred, manual follow-up needed):', {
        email,
        timestamp,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch {
      console.log('Failed to parse request body for error logging');
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}