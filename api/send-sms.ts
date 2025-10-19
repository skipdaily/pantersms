import type { VercelRequest, VercelResponse } from '@vercel/node';
import Twilio from 'twilio';

// Load credentials securely from Vercel environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

// Validate that all necessary environment variables are set
if (!accountSid || !authToken || !messagingServiceSid) {
  console.error("Twilio environment variables are not set.");
  // We throw an error during initialization which will cause the function to fail if misconfigured
  throw new Error("Twilio environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID) are not set. Please check your Vercel project settings.");
}

const client = Twilio(accountSid, authToken);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests to this endpoint
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { to, message } = req.body;

  // Validate the request body
  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Missing "to" or "message" in request body' });
  }

  try {
    // Use the Twilio client to send the SMS with Messaging Service
    const twilioResponse = await client.messages.create({
      body: message,
      messagingServiceSid: messagingServiceSid,
      to: to,
    });

    console.log(`Message sent to ${to}. SID: ${twilioResponse.sid}`);
    return res.status(200).json({ success: true, sid: twilioResponse.sid });

  } catch (error: any) {
    console.error('Twilio API Error:', error);
    // Return a structured error to the client
    return res.status(error.status || 500).json({
      success: false,
      error: 'Failed to send SMS via Twilio.',
      details: error.message,
    });
  }
}
