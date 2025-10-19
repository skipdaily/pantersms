# Deploying to Vercel

This guide will help you deploy your Bulk SMS Platform to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your Twilio credentials ready

## Deployment Steps

### 1. Deploy to Vercel

Click the button below to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/skipdaily/pantersms)

**OR** follow these manual steps:

1. Go to https://vercel.com/new
2. Import your GitHub repository: `skipdaily/pantersms`
3. Click "Deploy"

### 2. Configure Environment Variables

After deployment, you need to add your Twilio credentials:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

```
TWILIO_ACCOUNT_SID=AC53359572f49c0575824eae1c983369f7
TWILIO_AUTH_TOKEN=aa3aa0f40303706ea9c6c4b708835eda
TWILIO_PHONE_NUMBER=+19166595059
```

4. Click **Save**
5. Go to **Deployments** tab
6. Click the **"..."** menu on your latest deployment
7. Click **"Redeploy"** to apply the environment variables

### 3. Test Your Deployment

Once redeployed:
1. Visit your Vercel URL (e.g., `https://pantersms.vercel.app`)
2. Upload a CSV with phone numbers
3. Compose a message
4. Click "Personalize & Send Messages"

## Important Notes

### Twilio Trial Account Limitations

If you're using a Twilio trial account:
- ⚠️ You can only send SMS to **verified phone numbers**
- To verify a number: Go to Twilio Console → Phone Numbers → Verified Caller IDs
- Add and verify the phone number before sending

### Phone Number Format

Ensure phone numbers in your CSV are in E.164 format:
- ✅ Correct: `+19169559025`
- ❌ Wrong: `(916) 955-9025` or `9169559025`

### CSV Format

Your CSV should have these columns:
- **Required**: `phone` or `number` column
- **Optional**: `name` column (for personalization using `{name}` in messages)

Example CSV:
```csv
name,phone
Tom,+19169559025
Jane,+14155551234
```

## Troubleshooting

### Authentication Errors
- Double-check your Twilio credentials in Vercel environment variables
- Make sure there are no extra spaces in the values

### Failed Messages
- Verify the phone number is in E.164 format
- If using trial account, verify the recipient number in Twilio Console
- Check Twilio console logs for detailed error messages

### API Not Working
- Make sure you redeployed after adding environment variables
- Check Vercel function logs in the dashboard

## Support

For Twilio issues: https://support.twilio.com
For Vercel issues: https://vercel.com/support
