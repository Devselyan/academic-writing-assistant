import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academic Writing Assistant",
  description: "Legitimate tools for improving academic writing, citations, proofreading, and thesis generation according to university standards",
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
