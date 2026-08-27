interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="app-shell w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="w-full min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </main>
  );
}
