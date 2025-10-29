import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taxi Go | Admin Panel ",
  description:
    "Taxi Go Admin Panel — zamonaviy va qulay boshqaruv tizimi. Foydalanuvchilar, haydovchilar, buyurtmalar va statistikani yagona joyda nazorat qiling.",
  icons: {
    // icon: "/preview.png", // public/favicon.png
    shortcut: "/favicon.png"
  },
  openGraph: {
    title: "Taxi Go | Admin Panel",
    description:
      "Taxi Go Admin Panel orqali haydovchilar va buyurtmalarni boshqarish endi juda oson.",
    url: "https://taxigo.com",
    siteName: "Taxi Go",
    images: [
      {
        url: "/preview.png", // public/preview.png
        width: 1200,
        height: 630,
        alt: "Taxi Go Admin Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Go | Admin Panel",
    description:
      "Taxi Go Admin Panel orqali haydovchilar va buyurtmalarni boshqarish endi juda oson.",
    images: ["/preview.png"], // public/preview.png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
