import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { GraduationCap, Bell, Mail, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            id="sidebarToggle"
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">E.M.S.U</h1>
              <p className="text-xs text-muted-foreground">Educational Management System</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="sm" className="relative">
            <Mail size={20} className="text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </Button>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
              <AvatarFallback>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
