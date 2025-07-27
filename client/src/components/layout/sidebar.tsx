import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  ChartLine, 
  CalendarCheck, 
  CheckSquare, 
  MessageSquare, 
  CreditCard,
  BookOpen,
  FileText,
  UserCheck,
  Calendar,
  Megaphone,
  Settings,
  Building,
  DollarSign,
  TrendingUp,
  Shield,
  GraduationCap
} from "lucide-react";

interface SidebarProps {
  user: User;
  items: Array<{
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

const iconMap = {
  home: Home,
  users: Users,
  'chart-line': ChartLine,
  'calendar-check': CalendarCheck,
  tasks: CheckSquare,
  comments: MessageSquare,
  'credit-card': CreditCard,
  'book-open': BookOpen,
  'file-text': FileText,
  'user-check': UserCheck,
  calendar: Calendar,
  megaphone: Megaphone,
  settings: Settings,
  building: Building,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  shield: Shield,
  'graduation-cap': GraduationCap,
};

export default function Sidebar({ user, items, academicInfo }: SidebarProps) {
  const getRoleIcon = () => {
    switch (user.role) {
      case 'student':
        return <GraduationCap className="text-white" size={20} />;
      case 'teacher':
        return <BookOpen className="text-white" size={20} />;
      case 'parent':
        return <UserCheck className="text-white" size={20} />;
      case 'principal':
        return <Building className="text-white" size={20} />;
      case 'proprietor':
        return <Settings className="text-white" size={20} />;
      default:
        return <GraduationCap className="text-white" size={20} />;
    }
  };

  const getRoleDisplayName = () => {
    switch (user.role) {
      case 'student':
        return 'Student Dashboard';
      case 'teacher':
        return 'Teacher Dashboard';
      case 'parent':
        return 'Parent Dashboard';
      case 'principal':
        return 'Principal Dashboard';
      case 'proprietor':
        return 'Proprietor Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <aside
      id="sidebar"
      className="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-200"
    >
      <div className="h-full flex flex-col">
        {/* Role Indicator */}
        <div className="p-6 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              {getRoleIcon()}
            </div>
            <div>
              <p className="font-semibold text-primary">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-primary/80">{getRoleDisplayName()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home;
              
              return (
                <Button
                  key={index}
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3",
                    item.active 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  asChild
                >
                  <a href={item.href}>
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>

          {/* Academic Info */}
          {academicInfo && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-3">
                {user.role === 'proprietor' ? 'Business Info' : 'Academic Info'}
              </h4>
              <div className="space-y-2 text-sm">
                {academicInfo.term && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Term:</span>
                    <span className="font-medium">{academicInfo.term}</span>
                  </div>
                )}
                {academicInfo.session && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session:</span>
                    <span className="font-medium">{academicInfo.session}</span>
                  </div>
                )}
                {academicInfo.class && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="font-medium">{academicInfo.class}</span>
                  </div>
                )}
                {academicInfo.department && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{academicInfo.department}</span>
                  </div>
                )}
                {academicInfo.school && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">School:</span>
                    <span className="font-medium">{academicInfo.school}</span>
                  </div>
                )}
                {academicInfo.children && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Children:</span>
                    <span className="font-medium">{academicInfo.children}</span>
                  </div>
                )}
                {academicInfo.schools && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schools:</span>
                    <span className="font-medium">{academicInfo.schools}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
