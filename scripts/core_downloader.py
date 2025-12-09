#!/usr/bin/env python3
"""
Core Media Downloader Script
Uses yt-dlp to extract media information from URLs
"""

import sys
import json
import yt_dlp


def extract_info(url):
    """
    Extract media information from URL using yt-dlp
    Returns JSON with title, thumbnail, and download URL
    """
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
            
            # Get available formats
            formats_list = []
            if info.get('formats'):
                seen_formats = set()
                
                for f in info.get('formats', []):
                    format_id = f.get('format_id', 'unknown')
                    
                    # Skip if already seen this exact format
                    if format_id in seen_formats:
                        continue
                    
                    ext = f.get('ext', 'mp4')
                    vcodec = f.get('vcodec', 'none')
                    acodec = f.get('acodec', 'none')
                    
                    # Determine quality label
                    quality = f.get('format_note', '')
                    height = f.get('height', 0)
                    width = f.get('width', 0)
                    
                    if height and width:
                        quality = f"{height}p"
                    elif 'audio' in format_id.lower() or acodec != 'none' and vcodec == 'none':
                        abr = f.get('abr', 0)
                        quality = f"Audio {int(abr)}kbps" if abr else "Audio"
                    elif not quality:
                        quality = f.get('quality', 'unknown')
                    
                    formats_list.append({
                        'format_id': format_id,
                        'ext': ext,
                        'quality': quality,
                        'filesize': f.get('filesize') or f.get('filesize_approx') or 0,
                        'url': f.get('url', ''),
                        'vcodec': vcodec,
                        'acodec': acodec,
                        'height': height,
                        'width': width,
                    })
                    
                    seen_formats.add(format_id)
            
            # Extract best quality URL
            best_url = info.get('url', '')
            if not best_url and info.get('formats'):
                best_url = info['formats'][-1].get('url', '')
            
            # Check for TikTok image carousel or image posts
            images_list = []
            
            # Check if this is a playlist/multi-image post 
            if info.get('_type') == 'playlist' and info.get('entries'):
                # TikTok image carousel or similar
                for entry in info.get('entries', []):
                    # Try different fields where image URL might be
                    image_url = (entry.get('url') or 
                                entry.get('webpage_url') or 
                                entry.get('thumbnail'))
                    
                    if image_url:
                        images_list.append({
                            'url': image_url,
                            'width': entry.get('width', 0) or entry.get('thumbnail_width', 0),
                            'height': entry.get('height', 0) or entry.get('thumbnail_height', 0),
                            'ext': entry.get('ext', 'jpg'),
                            'title': entry.get('title', ''),
                        })
            elif 'entries' in info:
                # Alternative format for image posts
                for entry in info.get('entries', []):
                    image_url = entry.get('url') or entry.get('thumbnail')
                    if image_url:
                        images_list.append({
                            'url': image_url,
                            'width': entry.get('width', 0) or entry.get('thumbnail_width', 0),
                            'height': entry.get('height', 0) or entry.get('thumbnail_height', 0),
                            'ext': entry.get('ext', 'jpg'),
                            'title': entry.get('title', ''),
                        })
            
            # Extract relevant information
            result = {
                'success': True,
                'title': info.get('title', 'Unknown Title'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': info.get('duration', 0),
                'uploader': info.get('uploader', 'Unknown'),
                'url': best_url,
                'ext': info.get('ext', 'mp4'),
                'filesize': info.get('filesize', 0),
                'description': info.get('description', '')[:200] if info.get('description') else '',
                'formats': formats_list[:20] if formats_list else [{
                    'format_id': 'default',
                    'ext': info.get('ext', 'mp4'),
                    'quality': 'HD',
                    'filesize': info.get('filesize', 0),
                    'url': best_url,
                    'vcodec': 'h264', # Assume video if it's a fallback
                    'acodec': 'aac',
                }] if best_url else [],
                'images': images_list,  # TikTok image carousel or other image posts
                'is_image_post': len(images_list) > 0,  # Flag for image-only posts
            }
            
            return result
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to extract media information'
        }


def main():
    # Fix Windows console encoding for Unicode output
    import sys
    import io
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No URL provided',
            'message': 'Usage: python core_downloader.py <URL>'
        }))
        sys.exit(1)
    
    url = sys.argv[1]
    result = extract_info(url)
    
    # Print JSON to stdout for Node.js to capture
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

