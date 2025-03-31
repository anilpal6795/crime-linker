
import { DashboardStat } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DashboardSummaryProps {
  stats: DashboardStat[];
}

const DashboardSummary = ({ stats }: DashboardSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.direction === "up" && (
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            )}
            {stat.direction === "down" && (
              <ArrowDown className="h-4 w-4 text-rose-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change !== undefined && stat.period && (
              <p className="text-xs text-muted-foreground">
                {stat.direction === "up" && (
                  <span className="text-emerald-500">+{stat.change}%</span>
                )}
                {stat.direction === "down" && (
                  <span className="text-rose-500">-{stat.change}%</span>
                )}
                {stat.direction === "neutral" && (
                  <span>+0%</span>
                )}
                <span className="ml-1">from {stat.period}</span>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;
