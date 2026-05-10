import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "./StateProvider";
import Navbar from "./components/Navbar";
import { ModalsWrapper } from "./components/ModalsWrapper";
import SupportChat from "./components/SupportChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorshipMarket",
  description: "A Human-Verified marketplace for worship pads, sermon visuals, and creative services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AppStateProvider>
          <Navbar />
          {children}
          <ModalsWrapper />
          <SupportChat />
        </AppStateProvider>
      </body>
    </html>
  );
}
