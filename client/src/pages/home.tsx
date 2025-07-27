import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import StudentDashboard from "./student-dashboard";
import TeacherDashboard from "./teacher-dashboard";
import ParentDashboard from "./parent-dashboard";
import PrincipalDashboard from "./principal-dashboard";
import ProprietorDashboard from "./proprietor-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: !!user,
  });

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-muted/10">
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return <div>Error loading dashboard</div>;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'student':
      return <StudentDashboard user={user} data={dashboardData} />;
    case 'teacher':
      return <TeacherDashboard user={user} data={dashboardData} />;
    case 'parent':
      return <ParentDashboard user={user} data={dashboardData} />;
    case 'principal':
      return <PrincipalDashboard user={user} data={dashboardData} />;
    case 'proprietor':
      return <ProprietorDashboard user={user} data={dashboardData} />;
    default:
      return <div>Unknown user role</div>;
  }
}
