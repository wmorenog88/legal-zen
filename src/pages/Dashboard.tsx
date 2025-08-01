import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, DollarSign, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Clients",
      value: "48",
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Opportunities",
      value: "23",
      icon: Briefcase,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Revenue Pipeline",
      value: "$485,200",
      icon: DollarSign,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Conversion Rate",
      value: "68%",
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
    },
  ];

  const recentOpportunities = [
    {
      id: 1,
      title: "Corporate Merger Review",
      client: "TechCorp Inc.",
      value: "$125,000",
      status: "active",
      priority: "high",
    },
    {
      id: 2,
      title: "Employment Contract Dispute",
      client: "Global Solutions Ltd.",
      value: "$45,000",
      status: "consultation",
      priority: "medium",
    },
    {
      id: 3,
      title: "Real Estate Transaction",
      client: "Property Ventures",
      value: "$75,000",
      status: "prospect",
      priority: "high",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 text-success border-success/20";
      case "consultation": return "bg-warning/10 text-warning border-warning/20";
      case "prospect": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your legal practice.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <Users className="w-4 h-4" />
            Manage Clients
          </Button>
          <Button variant="legal" onClick={() => navigate("/opportunities")}>
            <Plus className="w-4 h-4" />
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-legal-border shadow-card hover:shadow-elegant transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-legal-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-success mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <Card className="border-legal-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-legal-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate("/opportunities")}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{opportunity.title}</h3>
                    <p className="text-sm text-muted-foreground">{opportunity.client}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(opportunity.priority)}`}>
                        {opportunity.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{opportunity.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/opportunities")}>
              View All Opportunities
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-legal-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/clients/new")}>
                <Users className="w-4 h-4" />
                Add New Client
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/opportunities/new")}>
                <Briefcase className="w-4 h-4" />
                Create Opportunity
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4" />
                Generate Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}