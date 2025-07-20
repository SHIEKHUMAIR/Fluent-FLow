import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fluent Flow - Chinese Hub",
   icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
      cz-shortcut-listen="true"
      >
       <main className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 ">
        <Sidebar />
        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          {children}
        </div>
      </main>
      </body>
    </html>
  );
}
