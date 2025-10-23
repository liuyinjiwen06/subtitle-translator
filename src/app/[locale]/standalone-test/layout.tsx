
export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No i18n, no NextIntlClientProvider - just plain HTML
  return children;
}
