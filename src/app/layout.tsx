// 新しいクライアントコンポーネントを作成
"use client";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import Head from "next/head";
import { SelectedOrgProvider } from "@/context/SelectedOrgContext"; // コンテキストプロバイダーをインポート
import { OrganizationProvider } from "@/context/OrganizationContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function Providers({ children }: { children: React.ReactNode }) {
  return <SelectedOrgProvider>{children}</SelectedOrgProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationProvider>
          <Providers>
            {children}
            <Footer />
          </Providers>
        </OrganizationProvider>
      </body>
    </html>
  );
}
