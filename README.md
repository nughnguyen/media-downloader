# MediaDown - Advanced Media Downloader

A powerful media downloader web application built with Next.js and Python, featuring a hybrid backend with automatic fallback mechanism.

## 🚀 Features

- **Hybrid Backend Architecture**: Primary external API with Python fallback
- **Multi-Platform Support**: Download from YouTube, Instagram, TikTok, and more
- **Media Remuxing**: Convert media containers without quality loss
- **Real-time Processing Queue**: Track multiple downloads simultaneously
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Multilingual**: English and Vietnamese support
- **Theme Support**: Light, Dark, and System themes
- **Accessibility**: Reduced motion and keyboard navigation

## 🏗️ Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Lucide Icons** for UI icons

### Backend

- **Next.js API Routes** (Route Handlers)
- **Node.js child_process** for Python integration
- **Python 3.8+** with **yt-dlp** for media extraction

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Python** 3.8 or higher
- **pip** (Python package manager)

### Step 1: Clone the Repository

```bash
git clone https://github.com/nughnguyen/media-downloader.git
cd download
```

### Step 2: Install Node.js Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Python Environment

#### Option A: Global Installation (Simple)

```bash
pip install -r requirements.txt
```

#### Option B: Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Verify Python Installation

Test the Python script independently:

```bash
# On Windows:
python scripts/core_downloader.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# On macOS/Linux:
python3 scripts/core_downloader.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

You should see JSON output with video information.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# External API Configuration (if you have one)
EXTERNAL_API_URL=https://api.example.com/resolve
EXTERNAL_API_KEY=your_api_key_here
EXTERNAL_API_TIMEOUT=5000

# Python Configuration
PYTHON_COMMAND=python3  # or 'python' on Windows
```

### Python Path Configuration

The API route automatically detects the platform:

- **Windows**: Uses `python`
- **macOS/Linux**: Uses `python3`

If you need a custom Python path, modify `app/api/resolve/route.ts`:

```typescript
const pythonCommand = "/path/to/your/python";
```

## 📁 Project Structure

```
download/
├── app/
│   ├── api/
│   │   └── resolve/
│   │       └── route.ts          # API endpoint with fallback logic
│   ├── about/
│   │   └── page.tsx              # About page with server status
│   ├── donate/
│   │   └── page.tsx              # Donation page with QR code
│   ├── remux/
│   │   └── page.tsx              # Media remux page
│   ├── settings/
│   │   └── page.tsx              # Settings page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── floating-queue.tsx        # Processing queue UI
│   └── navigation.tsx            # Navigation component
├── store/
│   ├── queue-store.ts            # Queue state management
│   └── settings-store.ts         # Settings state management
├── scripts/
│   └── core_downloader.py        # Python media extraction script
├── package.json
├── requirements.txt              # Python dependencies
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔄 How the Fallback Mechanism Works

1. **Primary Strategy**: API route first attempts to call an external API

   - Timeout: 5 seconds
   - If successful → Returns data with `source: 'external'`

2. **Fallback Strategy**: If external API fails:

   - Spawns a Python child process
   - Executes `scripts/core_downloader.py` with the URL
   - Captures stdout (JSON data) and stderr (errors)
   - Returns data with `source: 'internal'`

3. **Error Handling**: Both strategies include comprehensive error handling

   - Network errors
   - Timeout errors
   - JSON parsing errors
   - Python execution errors

## 🎨 Features Breakdown

### Home Page

- Hero section with gradient text
- URL input with glow effect on focus
- Quick paste functionality (optional)
- Platform cards (YouTube, Instagram, TikTok)
- Real-time download processing

### Remux Page

- Drag-and-drop file upload
- Progress bar simulation
- File size and type display
- Remux button (disabled until upload complete)

### Settings Page

- Theme selection (Light/Dark/System)
- Language toggle (English/Vietnamese)
- Reduced motion toggle
- Quick paste toggle

### About Page

- Server status indicator
- Shows which engine is active (External API / Internal Python)
- Feature list
- Technology stack overview

### Donate Page

- QR code generator for crypto wallet
- Zypage integration link
- Copy-to-clipboard for wallet address

### Floating Queue

- Shows/hides with toggle button
- Real-time status updates (pending/processing/completed/failed)
- Progress bars for each item
- Source indicator (external/internal)
- Clear completed button

## 🐛 Troubleshooting

### Python Script Not Found

**Error**: `Failed to spawn Python process`

**Solution**: Ensure Python is installed and accessible from command line:

```bash
# Test Python installation
python --version   # Windows
python3 --version  # macOS/Linux
```

### yt-dlp Not Working

**Error**: `No module named 'yt_dlp'`

**Solution**: Reinstall Python dependencies:

```bash
pip install -r requirements.txt --upgrade
```

### External API Timeout

This is normal behavior. The app will automatically fall back to the Python engine.

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: Run on a different port:

```bash
npm run dev -- -p 3001
```

## 🔐 Security Considerations

1. **Input Validation**: All URLs are validated before processing
2. **Command Injection Prevention**: URLs are passed as arguments, not concatenated
3. **Error Handling**: Sensitive error details are not exposed to the client
4. **CORS**: Configure CORS headers if deploying the API separately

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

**Note**: Python scripts work in Vercel serverless functions, but you may need to configure Python runtime.

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

# Install Python
RUN apk add --no-cache python3 py3-pip

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t mediadown .
docker run -p 3000:3000 mediadown
```

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Python**
