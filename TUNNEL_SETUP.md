# HTTPS Tunnel Setup for Mobile Camera Access

Mobile devices require HTTPS for camera access. Choose one of these free options:

---

## Option 1: Cloudflare Tunnel (Recommended - No signup needed!)

### Install
```bash
npm install -g cloudflared
```

### Run
```bash
npm run dev:cloudflare
```

You'll see a URL like `https://abc123.trycloudflare.com` - share this with your partner.

---

## Option 2: ngrok

### 1. Install
Download from https://ngrok.com or:
```bash
choco install ngrok
# or
npm install -g ngrok
```

### 2. Sign up & get token
1. Visit https://dashboard.ngrok.com
2. Create free account
3. Copy your authtoken from the dashboard

### 3. Configure
```bash
ngrok config add-authtoken YOUR_TOKEN
```

### 4. Run
```bash
npm run dev:ngrok
```

Share the `https://*.ngrok-free.app` URL shown in terminal.

---

## Option 3: LocalTunnel (Alternative)

```bash
npx localtunnel --port 3000
```

Share the URL shown (ends in `.lrt.io`).

---

## Troubleshooting

**Cloudflare not working?**
```bash
cloudflared update
```

**Port 3000 in use?**
```bash
# Kill existing process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```
