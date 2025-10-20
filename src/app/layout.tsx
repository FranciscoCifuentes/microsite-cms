import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Microsite CMS",
  description: "Multi-tenant CMS for health sector landing pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
