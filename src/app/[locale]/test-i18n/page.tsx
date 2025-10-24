import { getMessagesForLocale } from '@/lib/get-messages';
import { isValidUILocale, type UILocale } from '@/config/ui-locales';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TestI18nPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidUILocale(locale)) {
    notFound();
  }

  let messages;
  let error = null;

  try {
    messages = await getMessagesForLocale(locale as UILocale);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    messages = {};
  }

  const messageKeys = Object.keys(messages || {});
  const hasHomepage = !!messages?.homepage;
  const hasCommon = !!messages?.common;

  return (
    <div style={{
      fontFamily: 'monospace',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🔍 i18n Diagnostics</h1>

      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '2px solid #ddd'
      }}>
        <h2>📊 Basic Info</h2>
        <p><strong>Current Locale:</strong> {locale}</p>
        <p><strong>Is Valid Locale:</strong> {isValidUILocale(locale) ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Messages Loaded:</strong> {messages ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Error:</strong> {error || '✅ None'}</p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '2px solid #ddd'
      }}>
        <h2>🔑 Message Structure</h2>
        <p><strong>Total Keys:</strong> {messageKeys.length}</p>
        <p><strong>Has 'homepage' key:</strong> {hasHomepage ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Has 'common' key:</strong> {hasCommon ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Top-level keys:</strong></p>
        <pre style={{
          backgroundColor: '#f9f9f9',
          padding: '10px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(messageKeys, null, 2)}
        </pre>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '2px solid #ddd'
      }}>
        <h2>📝 Sample Content</h2>
        {messages?.homepage?.meta?.title ? (
          <>
            <p><strong>✅ homepage.meta.title:</strong></p>
            <pre style={{
              backgroundColor: '#e8f5e9',
              padding: '10px',
              color: '#2e7d32'
            }}>
              {messages.homepage.meta.title}
            </pre>
          </>
        ) : (
          <p style={{ color: 'red' }}>❌ homepage.meta.title not found</p>
        )}

        {messages?.homepage?.hero?.headline ? (
          <>
            <p><strong>✅ homepage.hero.headline:</strong></p>
            <pre style={{
              backgroundColor: '#e8f5e9',
              padding: '10px',
              color: '#2e7d32'
            }}>
              {messages.homepage.hero.headline}
            </pre>
          </>
        ) : (
          <p style={{ color: 'red' }}>❌ homepage.hero.headline not found</p>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '2px solid #ddd'
      }}>
        <h2>🗂️ Full Message Object (First 100 lines)</h2>
        <pre style={{
          backgroundColor: '#f9f9f9',
          padding: '10px',
          overflow: 'auto',
          maxHeight: '400px',
          fontSize: '11px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {JSON.stringify(messages, null, 2).split('\n').slice(0, 100).join('\n')}
        </pre>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        border: '2px solid #ffc107'
      }}>
        <h2>💡 Diagnostic Summary</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>{messages ? '✅' : '❌'} Messages object exists</li>
          <li>{messageKeys.length > 0 ? '✅' : '❌'} Has keys ({messageKeys.length} total)</li>
          <li>{hasHomepage ? '✅' : '❌'} Has 'homepage' structure</li>
          <li>{messages?.homepage?.meta?.title ? '✅' : '❌'} Can access nested properties</li>
        </ul>

        {!hasHomepage && messageKeys.length > 0 && (
          <p style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderLeft: '4px solid #f44336'
          }}>
            <strong>⚠️ Issue Found:</strong> Messages loaded but structure is wrong.
            Expected 'homepage' key but got: {messageKeys.join(', ')}
          </p>
        )}

        {messageKeys.length === 0 && (
          <p style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderLeft: '4px solid #f44336'
          }}>
            <strong>🚨 Critical Issue:</strong> Messages object is empty!
            Translation files are not being loaded correctly.
          </p>
        )}
      </div>
    </div>
  );
}
