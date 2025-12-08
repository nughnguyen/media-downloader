import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

interface ResolveRequestBody {
  url: string;
}

interface MediaInfo {
  success: boolean;
  title?: string;
  thumbnail?: string;
  duration?: number;
  uploader?: string;
  url?: string;
  ext?: string;
  filesize?: number;
  description?: string;
  formats?: Array<{
    format_id: string;
    ext: string;
    quality: string;
    filesize: number;
    url: string;
  }>;
  error?: string;
  message?: string;
  source?: 'external' | 'internal';
}

// Mock external API URL (replace with actual API endpoint)
const EXTERNAL_API_URL = 'https://api.example.com/resolve';
const EXTERNAL_API_TIMEOUT = 5000; // 5 seconds

/**
 * Try to fetch media info from external API
 */
async function fetchFromExternalAPI(url: string): Promise<MediaInfo> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EXTERNAL_API_TIMEOUT);

  try {
    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      source: 'external' as const,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('External API timeout');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

/**
 * Fallback: Execute Python script to extract media info
 */
async function fetchFromPythonScript(url: string): Promise<MediaInfo> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'core_downloader.py');
    
    // Use 'python3' on Unix-like systems, 'python' on Windows
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    
    const pythonProcess = spawn(pythonCommand, [scriptPath, url]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve({
          ...result,
          source: 'internal' as const,
        });
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });
  });
}

/**
 * POST /api/resolve
 * Resolves media URL with fallback mechanism
 */
export async function POST(request: NextRequest) {
  try {
    const body: ResolveRequestBody = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required',
          message: 'Please provide a valid URL',
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format',
          message: 'The provided URL is not valid',
        },
        { status: 400 }
      );
    }

    let mediaInfo: MediaInfo;

    // Step 1: Try external API first
    try {
      console.log('[API] Attempting external API...');
      mediaInfo = await fetchFromExternalAPI(url);
      console.log('[API] External API succeeded');
      
      return NextResponse.json(mediaInfo, { status: 200 });
    } catch (externalError) {
      console.log('[API] External API failed:', externalError);
      console.log('[API] Falling back to internal Python engine...');

      // Step 2: Fallback to Python script
      try {
        mediaInfo = await fetchFromPythonScript(url);
        console.log('[API] Python fallback succeeded');
        
        return NextResponse.json(mediaInfo, { status: 200 });
      } catch (pythonError) {
        console.error('[API] Python fallback failed:', pythonError);
        
        return NextResponse.json(
          {
            success: false,
            error: 'Both external API and internal engine failed',
            message: pythonError instanceof Error ? pythonError.message : 'Unknown error',
            source: 'internal' as const,
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
