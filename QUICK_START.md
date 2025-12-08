# 🚀 Quick Start Guide - MediaDown

## ✅ Setup Complete!

Your Next.js Media Downloader with Hybrid Backend is ready to use!

## 📦 What's Been Installed

### Node.js Packages (151 packages)

- ✅ Next.js 14.2
- ✅ React 18.3
- ✅ TypeScript
- ✅ TailwindCSS
- ✅ Framer Motion
- ✅ Zustand
- ✅ Lucide Icons
- ✅ QRCode

### Python Dependencies

- ✅ yt-dlp (latest version)

## 🎯 Current Status

✅ Development server is **RUNNING** on http://localhost:3000
✅ All dependencies installed
✅ Python script tested and working
✅ All pages created and configured

## 🌐 Available Pages

Navigate to these URLs in your browser:

1. **Home** - http://localhost:3000
   - Download interface with URL input
   - Platform cards (YouTube, Instagram, TikTok)
2. **Remux** - http://localhost:3000/remux

   - File upload for media remuxing
   - Drag-and-drop support

3. **Settings** - http://localhost:3000/settings

   - Theme selection (Light/Dark/System)
   - Language toggle (English/Vietnamese)
   - Reduced motion toggle
   - Quick paste toggle

4. **About** - http://localhost:3000/about

   - Server status indicator
   - Technology stack
   - Feature list

5. **Donate** - http://localhost:3000/donate
   - QR code for crypto donations
   - Zypage link integration

## 🔧 Testing the Hybrid Backend

### Test the Python Script Directly

```bash
python scripts/core_downloader.py "https://www.youtube.com/watch?v=jNQXAC9IVRw"
```

Expected output: JSON with video information

### Test via Web Interface

1. Open http://localhost:3000
2. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Click "Download"
4. Watch the floating queue appear in the bottom-right corner
5. The API will try external API first, then fall back to Python

### Check Which Engine Was Used

- After processing, check the About page (http://localhost:3000/about)
- The server status will show if it's using External API or Internal Engine
- In the floating queue, each item shows its source (external/internal)

## 🎨 UI/UX Features to Try

### Floating Processing Queue

- Click the "Download" button on any URL
- Watch the queue appear in bottom-right
- Click the queue button to expand/collapse
- See real-time progress updates
- Clear completed downloads

### Theme Switching

- Go to Settings
- Try Light, Dark, and System themes
- Changes apply immediately

### Language Toggle

- Go to Settings
- Switch between English and Vietnamese
- All pages update automatically

### Quick Paste

- Enable "Quick Paste" in Settings
- Click the input field on Home page
- URL from clipboard auto-pastes

## 📊 How the Fallback Mechanism Works

```
User submits URL
    ↓
Try External API (5s timeout)
    ↓
Success? → Return data (source: 'external')
    ↓
No → Execute Python script
    ↓
Parse JSON from stdout
    ↓
Return data (source: 'internal')
```

## 🔍 Monitoring

### Check Server Logs

The terminal shows:

- API route calls
- External API attempts
- Python fallback triggers
- Any errors

### Check Browser Console

- Open DevTools (F12)
- Watch Network tab for API calls
- Check Console for any errors

## 🐛 Known Issues & Fixes

### Issue: Python not found

**Fix**: Ensure Python is in PATH

```bash
python --version   # Windows
python3 --version  # macOS/Linux
```

### Issue: yt-dlp not working

**Fix**: Reinstall Python dependencies

```bash
pip install -r requirements.txt --upgrade
```

### Issue: External API always failing

**Fix**: This is expected! The external API URL is a mock.

- Edit `app/api/resolve/route.ts`
- Replace `EXTERNAL_API_URL` with your actual API
- Or just use the Python fallback (it works perfectly!)

## 📝 Customization Tips

### Change Theme Colors

Edit `tailwind.config.ts` to customize color palette

### Add More Platforms

Edit `app/page.tsx` → `examplePlatforms` array

### Customize Python Logic

Edit `scripts/core_downloader.py` - add format selection, quality options, etc.

### Add External API

Edit `app/api/resolve/route.ts`:

```typescript
const EXTERNAL_API_URL = "https://your-api.com/endpoint";
```

## 🚀 Next Steps

1. **Customize**: Update Zypage link in donate page
2. **Enhance Python**: Add format selection to core_downloader.py
3. **Add API**: Connect real external API if available
4. **Deploy**: Consider deploying to Vercel
5. **Test**: Try different platforms (YouTube, Instagram, etc.)

## 📚 Documentation

- Full README: `README.md`
- Project Structure: `PROJECT_STRUCTURE.md`
- This Guide: `QUICK_START.md`

---

## 💻 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Install new packages
npm install <package-name>

#Update Python dependencies
pip install -r requirements.txt --upgrade
```

## 🎉 You're All Set!

Your hybrid media downloader is ready to use. Open http://localhost:3000 and start downloading!

**Enjoy! 🚀**
