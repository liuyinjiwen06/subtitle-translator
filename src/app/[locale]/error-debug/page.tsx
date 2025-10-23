export const runtime = 'edge';

import { getMessagesForLocale } from '@/lib/get-messages';
import type { UILocale } from '@/config/ui-locales';

export default async function ErrorDebugPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const debugInfo: any = {
    locale,
    timestamp: new Date().toISOString(),
    steps: [],
    error: null,
  };

  // Step 1: Test direct import
  try {
    debugInfo.steps.push({ step: 'Direct import test', status: 'starting' });
    const directImport = await import(`@/lib/locales/${locale}`);
    debugInfo.steps.push({
      step: 'Direct import test',
      status: 'success',
      hasDefault: !!directImport.default,
      keys: directImport.default ? Object.keys(directImport.default).slice(0, 5) : []
    });
  } catch (error) {
    debugInfo.steps.push({
      step: 'Direct import test',
      status: 'failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error)
    });
  }

  // Step 2: Test getMessagesForLocale
  try {
    debugInfo.steps.push({ step: 'getMessagesForLocale test', status: 'starting' });
    const messages = await getMessagesForLocale(locale as UILocale);
    debugInfo.steps.push({
      step: 'getMessagesForLocale test',
      status: 'success',
      hasMessages: !!messages,
      messageKeys: messages ? Object.keys(messages).slice(0, 5) : []
    });
  } catch (error) {
    debugInfo.steps.push({
      step: 'getMessagesForLocale test',
      status: 'failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error)
    });
  }

  // Step 3: Test English fallback
  if (locale !== 'en') {
    try {
      debugInfo.steps.push({ step: 'English fallback test', status: 'starting' });
      const enMessages = await import(`@/lib/locales/en`);
      debugInfo.steps.push({
        step: 'English fallback test',
        status: 'success',
        hasDefault: !!enMessages.default
      });
    } catch (error) {
      debugInfo.steps.push({
        step: 'English fallback test',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4ec9b0' }}>Error Debug Page</h1>
      <pre style={{
        background: '#252526',
        padding: '20px',
        overflow: 'auto',
        fontSize: '12px',
        borderRadius: '4px',
        border: '1px solid #3c3c3c'
      }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div style={{ marginTop: '20px', color: '#ce9178' }}>
        <p><strong>Environment Info:</strong></p>
        <ul>
          <li>Runtime: Edge</li>
          <li>Platform: Cloudflare Workers</li>
          <li>Timestamp: {new Date().toISOString()}</li>
        </ul>
      </div>
    </div>
  );
}
