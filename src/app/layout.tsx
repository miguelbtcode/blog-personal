import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/frontend/components/layout/blog/header";
import Footer from "@/frontend/components/layout/blog/footer";
import { Providers } from "@/frontend/components/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mi Blog Personal",
  description: "Blog personal y portfolio de desarrollo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          {children}

          {/* <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div> */}
        </Providers>
      </body>
    </html>
  );
}
