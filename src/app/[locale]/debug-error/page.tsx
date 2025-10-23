
export default async function DebugErrorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let errorInfo = {
    locale,
    timestamp: new Date().toISOString(),
    messages: null as any,
    error: null as any,
  };

  // Test 1: Try to import translation directly
  try {
    const messages = await import(`@/lib/locales/${locale}`);
    errorInfo.messages = {
      success: true,
      hasDefault: !!messages.default,
      keys: messages.default ? Object.keys(messages.default).slice(0, 5) : [],
    };
  } catch (error) {
    errorInfo.error = {
      test: 'Direct import',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
  }

  // Test 2: Try getMessagesForLocale
  try {
    const { getMessagesForLocale } = await import('@/lib/get-messages');
    const messages = await getMessagesForLocale(locale as any);
    errorInfo.messages = {
      ...errorInfo.messages,
      getMessagesForLocale: {
        success: true,
        hasData: !!messages,
        keys: messages ? Object.keys(messages).slice(0, 5) : [],
      },
    };
  } catch (error) {
    errorInfo.error = {
      ...errorInfo.error,
      getMessagesForLocale: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Error Page</h1>
      <pre style={{
        background: '#f4f4f4',
        padding: '20px',
        overflow: 'auto',
        fontSize: '12px',
      }}>
        {JSON.stringify(errorInfo, null, 2)}
      </pre>
      <p>Environment: {typeof process !== 'undefined' ? 'Node' : 'Browser/Worker'}</p>
    </div>
  );
}
