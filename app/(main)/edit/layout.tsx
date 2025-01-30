'use client'

import "../../globals.css";

import { SidebarProvider } from "@/components/ui/sidebar"
import {AppSidebar} from "@/app/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
        <div className="flex">  
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              {children}
            </main>
          </SidebarProvider>
        </div> 
  )
}
