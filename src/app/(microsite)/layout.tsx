
// This is the layout for the outlet microsites.
// It's intentionally minimal to allow each microsite to have its own identity.
// It does not include the main site's header or footer.
export default function MicrositeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
