import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Matchdays",
  description: "Your club's fixtures, synced to Google Calendar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            style: {
              background: "hsl(240 6% 8%)",
              border: "1px solid hsl(240 5% 15%)",
              color: "hsl(0 0% 96%)",
            },
          }}
        />
      </body>
    </html>
  );
}
