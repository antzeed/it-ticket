import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT Helpdesk Portal",
  description: "IT Service Request Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
