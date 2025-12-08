#!/usr/bin/env python3
"""
Simple YouTube metadata extractor
Just gets title and thumbnail without downloading
"""

import sys
import json

def get_youtube_metadata(url):
    """Get basic YouTube metadata without yt-dlp"""
    try:
        import re
        import urllib.request
        
        # Extract video ID
        video_id = None
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/)([^&\n?#]+)',
            r'youtube\.com/embed/([^&\n?#]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                video_id = match.group(1)
                break
        
        if not video_id:
            return {
                'success': False,
                'error': 'Could not extract video ID'
            }
        
        # Use YouTube thumbnail URL pattern
        thumbnail = f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg'
        
        # Get title from oEmbed API(no API key needed)
        oembed_url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json'
        
        try:
            with urllib.request.urlopen(oembed_url, timeout=5) as response:
                data = json.loads(response.read().decode())
                title = data.get('title', f'YouTube Video {video_id}')
        except:
            title = f'YouTube Video {video_id}'
        
        return {
            'success': True,
            'title': title,
            'thumbnail': thumbnail,
            'video_id': video_id
        }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No URL provided'
        }))
        sys.exit(1)
    
    url = sys.argv[1]
    result = get_youtube_metadata(url)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == '__main__':
    main()
