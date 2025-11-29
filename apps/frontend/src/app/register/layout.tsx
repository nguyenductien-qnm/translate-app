export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {children}
    </main>
  );
}
