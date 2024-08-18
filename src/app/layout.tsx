import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matchdays.",
  description: "Your football calendar integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Provider>
  );
}
