interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    // py-8 no cel, py-12 no desktop. justify-center para alinhar verticalmente.
    <main className="min-h-screen w-full bg-bg-main flex flex-col justify-center items-center py-8 md:py-12 px-4">
      <div className="w-full flex flex-col items-center">
        {children}
      </div>
    </main>
  );
}
