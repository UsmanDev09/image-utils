// 'use client'
// import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "./components/Navbar";
import { ViewTransitions } from 'next-view-transitions'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className="antialiased">
          <Navbar />
          {children}
        </body>
      </html>
    </ViewTransitions>
  )
}
