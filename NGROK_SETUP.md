# Local Development with ngrok (HTTPS for Camera Access)

Mobile devices require HTTPS to allow camera access. ngrok provides a free HTTPS tunnel.

## Quick Setup

### 1. Install ngrok
Download from https://ngrok.com/download or:
```bash
choco install ngrok
```

### 2. Create free account & authenticate
1. Sign up at https://dashboard.ngrok.com/signup
2. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken
3. Run:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 3. Start your app
```bash
npm run dev
```

### 4. Start ngrok in a new terminal
```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding   https://abc123xyz.ngrok-free.app -> http://localhost:3000
```

### 5. Share the HTTPS URL
Send the `https://abc123xyz.ngrok-free.app` URL to your partner. They can now access over HTTPS and grant camera permission.

## Permanent ngrok URL (Free tier)
Free accounts get a new random URL each time. For a permanent URL:
- Upgrade to ngrok paid plan ($8/month) for a reserved domain, OR
- Use Cloudflare Tunnel (free permanent URL) - see CLOUDFLARE_TUNNEL.md
