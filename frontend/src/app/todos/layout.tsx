import { Navigation } from "@/components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen ">
        <Navigation />
        <div className="py-6">{children}</div>
      </div>
  );
}
