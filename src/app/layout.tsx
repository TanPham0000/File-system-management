import type { Metadata } from "next";
import { Be_Vietnam_Pro, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const switser = localFont({
  src: "../fonts/Switser.woff2",
  variable: "--font-switser",
  display: "swap",
});

const instrumental = localFont({
  src: "../fonts/Instrumental.woff2",
  variable: "--font-instrumental",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PHAM. Content Vault",
  description: "Secure Client Content Vault for PHAM. Creative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${switser.variable} ${beVietnamPro.variable} ${instrumental.variable} ${spaceMono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
