import Sidebar from "./sidebar";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
