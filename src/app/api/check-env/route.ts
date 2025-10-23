import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        runtime: "nodejs",
        nodeVersion: process.version || 'unknown',
      },
      apiKeys: {
        google: {
          configured: !!process.env.GOOGLE_TRANSLATE_API_KEY,
          length: process.env.GOOGLE_TRANSLATE_API_KEY?.length || 0,
          prefix: process.env.GOOGLE_TRANSLATE_API_KEY?.substring(0, 8) + '...' || 'not configured'
        },
        openai: {
          configured: !!process.env.OPENAI_API_KEY,
          length: process.env.OPENAI_API_KEY?.length || 0,
          prefix: process.env.OPENAI_API_KEY?.substring(0, 8) + '...' || 'not configured'
        }
      },
      connectivity: {
        google: { status: 'checking' as 'checking' | 'success' | 'error', time: 0, error: null as string | null },
        openai: { status: 'checking' as 'checking' | 'success' | 'error', time: 0, error: null as string | null }
      }
    };

    // 测试Google API连通性
    try {
      const googleStart = Date.now();
      const googleResponse = await fetch('https://translation.googleapis.com/language/translate/v2/languages?key=' + process.env.GOOGLE_TRANSLATE_API_KEY, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      result.connectivity.google = {
        status: googleResponse.ok ? 'success' : 'error',
        time: Date.now() - googleStart,
        error: googleResponse.ok ? null : `HTTP ${googleResponse.status}`
      };
    } catch (error) {
      result.connectivity.google = {
        status: 'error',
        time: 10000,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // 测试OpenAI API连通性
    try {
      const openaiStart = Date.now();
      const openaiResponse = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        signal: AbortSignal.timeout(10000)
      });
      result.connectivity.openai = {
        status: openaiResponse.ok ? 'success' : 'error',
        time: Date.now() - openaiStart,
        error: openaiResponse.ok ? null : `HTTP ${openaiResponse.status}`
      };
    } catch (error) {
      result.connectivity.openai = {
        status: 'error',
        time: 10000,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Environment check failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 