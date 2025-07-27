import { User } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import { UserCheck, TrendingUp, Calendar, CreditCard } from "lucide-react";

interface ParentDashboardProps {
  user: User;
  data: any;
}

export default function ParentDashboard({ user, data }: ParentDashboardProps) {
  const sidebarItems = [
    { icon: "home", label: "Dashboard", href: "/", active: true },
    { icon: "user-check", label: "My Children", href: "/children" },
    { icon: "chart-line", label: "Academic Progress", href: "/progress" },
    { icon: "calendar-check", label: "Attendance", href: "/attendance" },
    { icon: "comments", label: "Messages", href: "/messages" },
    { icon: "credit-card", label: "Fee Payments", href: "/fees" },
    { icon: "calendar", label: "Events", href: "/events" },
  ];

  const totalChildren = data.children?.length || 0;
  const overallGrade = data.children?.length > 0 
    ? Math.round(data.children.reduce((sum: number, child: any) => sum + (child.averageGrade || 0), 0) / data.children.length)
    : 0;
  const attendanceRate = data.children?.length > 0
    ? Math.round(data.children.reduce((sum: number, child: any) => sum + (child.attendanceRate || 0), 0) / data.children.length)
    : 0;
  const pendingFees = data.feePayments?.filter((fee: any) => fee.status === 'pending').length || 0;

  return (
    <DashboardLayout 
      user={user} 
      sidebarItems={sidebarItems}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
        children: totalChildren.toString()
      }}
    >
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}! 👨‍👩‍👧‍👦
          </h2>
          <p className="text-muted-foreground">Monitor your children's academic progress and school activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<UserCheck className="text-primary" size={24} />}
            title="My Children"
            value={totalChildren.toString()}
            subtitle="Enrolled students"
            trend={null}
          />
          <StatsCard
            icon={<TrendingUp className="text-green-600" size={24} />}
            title="Overall Grade"
            value={`${overallGrade}%`}
            subtitle="Average across children"
            trend="positive"
          />
          <StatsCard
            icon={<Calendar className="text-blue-600" size={24} />}
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            subtitle="This term"
            trend="positive"
          />
          <StatsCard
            icon={<CreditCard className="text-orange-600" size={24} />}
            title="Pending Fees"
            value={pendingFees.toString()}
            subtitle="Outstanding payments"
            trend={null}
          />
        </div>

        {/* Parent-specific content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">My Children</h3>
            <div className="space-y-4">
              {data.children?.length > 0 ? (
                data.children.map((child: any) => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCheck className="text-primary" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{child.user?.firstName} {child.user?.lastName}</h4>
                        <p className="text-sm text-muted-foreground">{child.class?.name}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{child.averageGrade || 0}%</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No children enrolled yet.</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {data.recentUpdates?.length > 0 ? (
                data.recentUpdates.map((update: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="text-green-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{update.description}</p>
                      <p className="text-xs text-muted-foreground">{update.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent updates.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
