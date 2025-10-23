export const runtime = 'edge';

export default async function SimpleTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test Page</h1>
      <p>Locale: {locale}</p>
      <p>If you can see this, Edge Runtime is working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
