import { NextRequest } from "next/server";


export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const envCheck = {
    timestamp: new Date().toISOString(),
    runtime,
    environment: {
      GOOGLE_TRANSLATE_API_KEY: {
        configured: !!process.env.GOOGLE_TRANSLATE_API_KEY,
        length: process.env.GOOGLE_TRANSLATE_API_KEY?.length || 0,
        prefix: process.env.GOOGLE_TRANSLATE_API_KEY?.substring(0, 10) || 'not set'
      },
      OPENAI_API_KEY: {
        configured: !!process.env.OPENAI_API_KEY,
        length: process.env.OPENAI_API_KEY?.length || 0,
        prefix: process.env.OPENAI_API_KEY?.substring(0, 10) || 'not set'
      }
    },
    headers: {
      "user-agent": req.headers.get("user-agent") || "unknown",
      "accept-language": req.headers.get("accept-language") || "unknown",
      "origin": req.headers.get("origin") || "unknown",
      "referer": req.headers.get("referer") || "unknown"
    },
    testServices: {
      google: {
        available: !!process.env.GOOGLE_TRANSLATE_API_KEY,
        testUrl: "https://translation.googleapis.com",
        reachable: undefined as boolean | undefined,
        status: undefined as number | undefined,
        statusText: undefined as string | undefined,
        error: undefined as string | undefined
      },
      openai: {
        available: !!process.env.OPENAI_API_KEY,
        testUrl: "https://api.openai.com",
        reachable: undefined as boolean | undefined,
        status: undefined as number | undefined,
        statusText: undefined as string | undefined,
        error: undefined as string | undefined
      }
    }
  };

  // 测试Google API连接
  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    try {
      const testResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
        { method: 'GET' }
      );
      envCheck.testServices.google = {
        ...envCheck.testServices.google,
        reachable: true,
        status: testResponse.status,
        statusText: testResponse.statusText
      };
    } catch (error) {
      envCheck.testServices.google = {
        ...envCheck.testServices.google,
        reachable: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  return new Response(JSON.stringify(envCheck, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}