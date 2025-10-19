import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    // Set CORS headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests to this endpoint
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // Load credentials securely from Vercel environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    // Validate that all necessary environment variables are set
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error("Twilio environment variables are not set.");
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        details: `Missing env vars: ${!accountSid ? 'TWILIO_ACCOUNT_SID ' : ''}${!authToken ? 'TWILIO_AUTH_TOKEN ' : ''}${!messagingServiceSid ? 'TWILIO_MESSAGING_SERVICE_SID' : ''}`
      });
    }

    const { to, message } = req.body;

    // Validate the request body
    if (!to || !message) {
      return res.status(400).json({ success: false, error: 'Missing "to" or "message" in request body' });
    }

    // Dynamically import Twilio to avoid initialization issues
    const Twilio = (await import('twilio')).default;
    const client = Twilio(accountSid, authToken);

    // Use the Twilio client to send the SMS with Messaging Service
    const twilioResponse = await client.messages.create({
      body: message,
      messagingServiceSid: messagingServiceSid,
      to: to,
    });

    console.log(`Message sent to ${to}. SID: ${twilioResponse.sid}`);
    return res.status(200).json({ success: true, sid: twilioResponse.sid });

  } catch (error: any) {
    console.error('Function error:', error);
    // Return a structured error to the client
    return res.status(500).json({
      success: false,
      error: 'Function execution error',
      details: error.message || String(error),
      stack: error.stack
    });
  }
}
