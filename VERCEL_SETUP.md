# Vercel Production Setup Guide

## Step 1: Get Your Twilio Messaging Service SID

1. Go to Twilio Console: https://console.twilio.com/us1/develop/sms/services
2. Click **"Create Messaging Service"**
3. Give it a name (e.g., "Bulk SMS Service")
4. Click **"Create Messaging Service"**
5. In the **Sender Pool** section:
   - Click **"Add Senders"**
   - Select your phone number
   - Click **"Add"**
6. Copy the **Messaging Service SID** (starts with "MG...")

## Step 2: Configure Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your **pantersms** project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:

| Key | Value | Example |
|-----|-------|---------|
| `TWILIO_ACCOUNT_SID` | Your Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Your Auth Token | `your_auth_token_here` |
| `TWILIO_MESSAGING_SERVICE_SID` | Your Messaging Service SID | `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

5. Click **Save**

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Step 4: Test Your App

1. Visit your Vercel URL (e.g., `https://pantersms.vercel.app`)
2. Upload a CSV with phone numbers (format: any of these work)
   - `9169559025`
   - `(916) 955-9025`
   - `916-955-9025`
   - App will auto-format to `+19169559025`
3. Compose your message
4. Click "Personalize & Send Messages"

## Benefits of Using Messaging Service SID

✅ **No A2P 10DLC registration needed** (bypasses individual phone number registration)
✅ **Better for bulk messaging** (handles compliance automatically)
✅ **Automatic failover** (if one number is blocked, uses another)
✅ **Production-ready** out of the box

## Troubleshooting

### Error: "Messaging Service SID not set"
- Make sure you added all 3 environment variables in Vercel
- Redeploy after adding variables

### Error: "Unable to create record"
- Verify recipient number in Twilio Console (if using trial account)
- Check that Messaging Service has a phone number added to Sender Pool

### Messages Still Failing
- Check Twilio Console → Monitor → Logs → Errors
- Verify your Messaging Service is active
- Ensure recipient numbers are in E.164 format (app does this automatically)

## Next Steps

Your app is now production-ready! 🚀

- For high-volume sending, upgrade your Twilio account
- Monitor usage in Twilio Console
- Check message delivery status in your app dashboard
