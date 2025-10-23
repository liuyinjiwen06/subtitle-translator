
export default async function StandaloneTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const results: any = {
    locale,
    timestamp: new Date().toISOString(),
    tests: [],
  };

  // Test 1: Can we import the locale file?
  try {
    results.tests.push({ name: 'Import locale file', status: 'attempting', path: `@/lib/locales/${locale}` });
    const localeModule = await import(`@/lib/locales/${locale}`);
    results.tests[results.tests.length - 1].status = 'SUCCESS';
    results.tests[results.tests.length - 1].hasDefault = !!localeModule.default;
    results.tests[results.tests.length - 1].type = typeof localeModule.default;
    results.tests[results.tests.length - 1].sampleKeys = localeModule.default ? Object.keys(localeModule.default).slice(0, 3) : [];
  } catch (error: any) {
    results.tests[results.tests.length - 1].status = 'FAILED';
    results.tests[results.tests.length - 1].errorName = error?.name;
    results.tests[results.tests.length - 1].errorMessage = error?.message;
    results.tests[results.tests.length - 1].errorStack = error?.stack?.split('\n').slice(0, 5);
  }

  // Test 2: English fallback
  try {
    results.tests.push({ name: 'Import English', status: 'attempting' });
    const enModule = await import(`@/lib/locales/en`);
    results.tests[results.tests.length - 1].status = 'SUCCESS';
    results.tests[results.tests.length - 1].hasDefault = !!enModule.default;
  } catch (error: any) {
    results.tests[results.tests.length - 1].status = 'FAILED';
    results.tests[results.tests.length - 1].error = error?.message;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Standalone Test - ${locale}</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #1a1a1a;
      color: #00ff00;
      padding: 20px;
      margin: 0;
    }
    h1 { color: #00ffff; }
    pre {
      background: #000;
      padding: 15px;
      border: 1px solid #00ff00;
      border-radius: 5px;
      overflow-x: auto;
    }
    .success { color: #00ff00; }
    .failed { color: #ff0000; }
  </style>
</head>
<body>
  <h1>🔍 Standalone Test Page</h1>
  <p>This page bypasses the normal layout to test module imports directly.</p>
  <pre>${JSON.stringify(results, null, 2)}</pre>
  <hr>
  <p>Environment: Cloudflare Workers Edge Runtime</p>
  <p>If you see this page, the Worker is executing!</p>
</body>
</html>
  `;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
