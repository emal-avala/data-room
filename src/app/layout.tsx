import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/config/site";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ContentProtection } from "@/components/ContentProtection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} · Investor data room`,
    template: `%s · ${siteConfig.companyName}`,
  },
  description: siteConfig.tagline,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sourceSans.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {/* Raw inline boot: Next 16 queues Script beforeInteractive via __next_s and reload then loses the theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
        <Providers>
          <ContentProtection />
          <AnnouncementBanner />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
