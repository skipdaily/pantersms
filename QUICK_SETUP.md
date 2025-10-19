# Quick Setup Checklist

Your app is deployed but needs environment variables to work!

## ⚠️ Current Issue
The API returns: "A server e..." error because environment variables are NOT set in Vercel yet.

## ✅ Steps to Fix (Do This Now!)

### 1. Create Twilio Messaging Service
1. Go to: https://console.twilio.com/us1/develop/sms/services
2. Click "Create Messaging Service"
3. Name it: "Bulk SMS Service"
4. Click "Create"
5. Click "Add Senders" → Select your phone number → Click "Add"
6. **Copy the Messaging Service SID** (starts with "MG...")

### 2. Add Environment Variables in Vercel
1. Go to: https://vercel.com/dashboard
2. Click on your **pantersms** project
3. Go to **Settings** → **Environment Variables**
4. Add these THREE variables:

```
TWILIO_ACCOUNT_SID = (your Account SID from Twilio)
TWILIO_AUTH_TOKEN = (your Auth Token from Twilio)
TWILIO_MESSAGING_SERVICE_SID = (the MG... value you just copied)
```

5. Click **Save** for each one

### 3. Redeploy
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to finish (~30 seconds)

### 4. Test!
1. Visit your Vercel URL
2. Upload CSV with phone number (format: 9169559025 - app auto-adds +1)
3. Type a message
4. Click "Personalize & Send Messages"
5. ✅ Should work!

## 📝 Your Credentials (for reference)

You have these from Twilio Console:
- Account SID: AC... (from Twilio dashboard)
- Auth Token: (click "show" in Twilio dashboard)
- Phone Number: +19166023164
- Messaging Service SID: MG... (from the service you just created)

## 🚨 Important Notes

- **Trial Account**: Can only send to verified numbers
  - Verify numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
- **Phone Format**: App auto-converts any format to +1XXXXXXXXXX
- **Messaging Service**: Bypasses A2P 10DLC registration requirements

## ❓ Troubleshooting

**Still getting errors after adding env vars?**
- Make sure you redeployed AFTER adding the variables
- Check that all 3 variables are set correctly
- Wait 1-2 minutes for Vercel to propagate changes

**"Twilio credentials not configured" error?**
- Environment variables not set in Vercel
- Follow steps above to add them

**Messages still failing to send?**
- Check if recipient number is verified (trial accounts only)
- Check Twilio Console → Monitor → Logs for detailed error
