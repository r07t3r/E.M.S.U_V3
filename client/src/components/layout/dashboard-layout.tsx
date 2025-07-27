import { ReactNode } from "react";
import { User } from "@shared/schema";
import Header from "./header";
import Sidebar from "./sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
  sidebarItems: Array<{
    icon: string;
    label: string;
    href: string;
    active?: boolean;
  }>;
  academicInfo?: {
    term?: string;
    session?: string;
    class?: string;
    department?: string;
    school?: string;
    children?: string;
    schools?: string;
  };
}

export default function DashboardLayout({ 
  children, 
  user, 
  sidebarItems, 
  academicInfo 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/10">
      <Header user={user} />
      <div className="flex">
        <Sidebar 
          user={user} 
          items={sidebarItems} 
          academicInfo={academicInfo} 
        />
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
