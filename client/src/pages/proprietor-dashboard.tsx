import { User } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import { Building, DollarSign, TrendingUp, Users } from "lucide-react";

interface ProprietorDashboardProps {
  user: User;
  data: any;
}

export default function ProprietorDashboard({ user, data }: ProprietorDashboardProps) {
  const sidebarItems = [
    { icon: "home", label: "Dashboard", href: "/", active: true },
    { icon: "building", label: "Schools", href: "/schools" },
    { icon: "dollar-sign", label: "Financial Overview", href: "/finances" },
    { icon: "users", label: "Staff Management", href: "/staff" },
    { icon: "chart-line", label: "Performance Reports", href: "/reports" },
    { icon: "settings", label: "System Settings", href: "/settings" },
    { icon: "shield", label: "Compliance", href: "/compliance" },
  ];

  const totalSchools = data.schools?.length || 1;
  const totalRevenue = data.totalRevenue || 0;
  const totalStudents = data.totalStudents || 0;
  const profitMargin = data.profitMargin || 0;

  return (
    <DashboardLayout 
      user={user} 
      sidebarItems={sidebarItems}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
        schools: totalSchools.toString()
      }}
    >
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Proprietor Dashboard 🏢
          </h2>
          <p className="text-muted-foreground">Monitor and manage your educational institutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Building className="text-primary" size={24} />}
            title="Total Schools"
            value={totalSchools.toString()}
            subtitle="Under management"
            trend={null}
          />
          <StatsCard
            icon={<DollarSign className="text-green-600" size={24} />}
            title="Total Revenue"
            value={`₦${totalRevenue.toLocaleString()}`}
            subtitle="This academic session"
            trend="positive"
          />
          <StatsCard
            icon={<Users className="text-blue-600" size={24} />}
            title="Total Students"
            value={totalStudents.toString()}
            subtitle="Across all schools"
            trend="positive"
          />
          <StatsCard
            icon={<TrendingUp className="text-orange-600" size={24} />}
            title="Profit Margin"
            value={`${profitMargin}%`}
            subtitle="Current quarter"
            trend="positive"
          />
        </div>

        {/* Proprietor-specific content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">School Performance</h3>
            <div className="space-y-4">
              {data.schools?.length > 0 ? (
                data.schools.map((school: any) => (
                  <div key={school.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{school.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {school.studentCount || 0} students • {school.performance || 85}% avg performance
                      </p>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {school.status || 'Active'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{data.school?.name || 'Your School'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {data.totalStudents || 0} students • 85% avg performance
                    </p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-800">Fee Collections</h4>
                  <p className="text-sm text-green-600">This month</p>
                </div>
                <span className="text-lg font-bold text-green-800">₦{(totalRevenue * 0.3).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-800">Operating Expenses</h4>
                  <p className="text-sm text-blue-600">This month</p>
                </div>
                <span className="text-lg font-bold text-blue-800">₦{(totalRevenue * 0.2).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-orange-800">Net Profit</h4>
                  <p className="text-sm text-orange-600">This month</p>
                </div>
                <span className="text-lg font-bold text-orange-800">₦{(totalRevenue * 0.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
