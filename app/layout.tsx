// 'use client'
// import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "./components/Navbar";
import { ViewTransitions } from 'next-view-transitions'
import { Rubik } from 'next/font/google'
import { Dock, DockIcon } from "@/components/ui/dock";
import { ImageUpscale } from "lucide-react";

const rubik = Rubik({
  weight: '400',
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={rubik.className}>
          <Navbar />
          {children}

                            
        </body>
      </html>
    </ViewTransitions>
  )
}
