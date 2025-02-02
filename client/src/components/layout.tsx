import { Navigation } from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
