import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { SessionProvider } from "@/components/shared/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PrepWise AI — Master Your Next Interview with AI",
    template: "%s | PrepWise AI",
  },
  description:
    "AI-powered mock interviews. Practice with voice or text, get instant feedback, and land your dream role with PrepWise AI.",
  keywords: [
    "AI interview",
    "mock interview",
    "interview prep",
    "career",
    "AI coach",
  ],
  authors: [{ name: "Anand Sharma" }],
  openGraph: {
    title: "PrepWise AI — Master Your Next Interview with AI",
    description:
      "AI-powered mock interviews. Practice with voice or text, get instant feedback.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SessionProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              theme="system"
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
