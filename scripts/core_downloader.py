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
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract relevant information
            result = {
                'success': True,
                'title': info.get('title', 'Unknown Title'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': info.get('duration', 0),
                'uploader': info.get('uploader', 'Unknown'),
                'url': info.get('url', ''),
                'ext': info.get('ext', 'mp4'),
                'filesize': info.get('filesize', 0),
                'description': info.get('description', '')[:200] if info.get('description') else '',
                'formats': [
                    {
                        'format_id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'quality': f.get('format_note', 'unknown'),
                        'filesize': f.get('filesize', 0),
                        'url': f.get('url', '')
                    }
                    for f in info.get('formats', [])[:5]  # Limit to 5 formats
                ]
            }
            
            return result
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to extract media information'
        }


def main():
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
