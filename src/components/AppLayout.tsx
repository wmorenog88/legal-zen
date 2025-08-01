import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-legal-border bg-card flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-legal-primary to-legal-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">LegalCRM</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <UserCircle className="w-4 h-4" />
                Profile
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6 bg-legal-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}