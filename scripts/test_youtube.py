"""
Test YouTube Download - Debugging Script
"""
import sys
import json

# Test 1: Test yt-dlp directly
print("=" * 60)
print("TEST 1: Testing yt-dlp with YouTube URL")
print("=" * 60)

import yt_dlp

url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

ydl_opts = {
    'quiet': True,
    'no_warnings': True,
    'extract_flat': False,
    'format': 'best',
    'nocheckcertificate': True,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        
        print(f"[OK] Success!")
        print(f"Title: {info.get('title')}")
        print(f"Duration: {info.get('duration')}s")
        print(f"Uploader: {info.get('uploader')}")
        print(f"Total formats: {len(info.get('formats', []))}")
        
        # Show video formats
        video_formats = [f for f in info.get('formats', []) 
                        if f.get('vcodec') != 'none' and f.get('height')]
        
        print(f"\nVideo formats available:")
        for fmt in video_formats[:5]:
            height = fmt.get('height', 0)
            ext = fmt.get('ext', 'mp4')
            vcodec = fmt.get('vcodec', 'unknown')
            print(f"  - {height}p (.{ext}) - {vcodec}")
        
        # Show audio formats
        audio_formats = [f for f in info.get('formats', [])
                        if f.get('acodec') != 'none' and f.get('vcodec') == 'none']
        
        print(f"\nAudio formats available:")
        for fmt in audio_formats[:5]:
            abr = fmt.get('abr', 0)
            ext = fmt.get('ext', 'm4a')
            print(f"  - {int(abr)}kbps (.{ext})")
        
        print(f"\n[OK] yt-dlp works perfectly with YouTube!")
        
except Exception as e:
    print(f"[ERROR] Error: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("CONCLUSION: YouTube downloads SHOULD work!")
print("=" * 60)
print("\nPossible issues:")
print("1. External API (Cobalt) failing")
print("2. CORS issues in browser")
print("3. Direct download URLs expiring")
print("4. Frontend not handling response correctly")
print("\nRecommendation: Use Python fallback for YouTube!")
