import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  trend?: "positive" | "negative" | null;
}

export default function StatsCard({ icon, title, value, subtitle, trend }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted">
            {icon}
          </div>
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className={`text-sm ${
          trend === "positive" 
            ? "text-green-600" 
            : trend === "negative" 
            ? "text-red-600" 
            : "text-muted-foreground"
        }`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}
