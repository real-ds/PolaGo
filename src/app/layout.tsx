import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POLA GO — Snap Together, No Matter the Distance",
  description:
    "A shared virtual photo booth for long-distance couples. Create a room, connect live, and capture 4 polaroid-style photos together in real time.",
  openGraph: {
    title: "POLA GO",
    description: "Snap. Style. Save the Moment — Together, No Matter the Distance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${quicksand.variable}`}
    >
      <body className="min-h-screen font-quicksand antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
