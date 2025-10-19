// Vercel Serverless Function for sending SMS via Twilio

export default async function handler(req, res) {
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

        // Only allow POST requests
        if (req.method !== 'POST') {
            return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        }

        // Load credentials from environment variables
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

        // Validate environment variables
        if (!accountSid || !authToken || !messagingServiceSid) {
            console.error("Missing Twilio environment variables");
            return res.status(500).json({
                success: false,
                error: 'Server configuration error',
                details: `Missing: ${!accountSid ? 'ACCOUNT_SID ' : ''}${!authToken ? 'AUTH_TOKEN ' : ''}${!messagingServiceSid ? 'MESSAGING_SERVICE_SID' : ''}`
            });
        }

        const { to, message } = req.body;

        // Validate request body
        if (!to || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                details: 'Both "to" and "message" are required'
            });
        }

        // Import Twilio dynamically
        const twilio = await import('twilio');
        const client = twilio.default(accountSid, authToken);

        // Send SMS
        const twilioResponse = await client.messages.create({
            body: message,
            messagingServiceSid: messagingServiceSid,
            to: to,
        });

        console.log(`✅ Message sent to ${to}. SID: ${twilioResponse.sid}`);

        return res.status(200).json({
            success: true,
            sid: twilioResponse.sid,
            status: twilioResponse.status
        });

    } catch (error) {
        console.error('❌ Function error:', error);

        return res.status(500).json({
            success: false,
            error: 'Function execution error',
            details: error.message || String(error),
            code: error.code,
            moreInfo: error.moreInfo
        });
    }
}
