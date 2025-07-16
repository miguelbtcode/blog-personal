import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/frontend/components/layout/header";
import Footer from "@/frontend/components/layout/footer";

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
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} m-0 p-0`}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
