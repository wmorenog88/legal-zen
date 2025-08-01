import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  DollarSign, 
  Calendar,
  User,
  Briefcase,
  Edit,
  Eye,
  Trash2,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - in real app this would come from Supabase
const mockOpportunities = [
  {
    id: 1,
    title: "Corporate Merger Review",
    client: "TechCorp Inc.",
    client_id: 1,
    description: "Legal review and due diligence for acquisition of smaller tech company",
    value: 125000,
    status: "active",
    priority: "high",
    practice_area: "Corporate Law",
    estimated_close_date: "2024-03-15",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    title: "Employment Contract Dispute",
    client: "Global Solutions Ltd.",
    client_id: 2,
    description: "Representing client in wrongful termination case",
    value: 45000,
    status: "consultation",
    priority: "medium",
    practice_area: "Employment Law",
    estimated_close_date: "2024-02-28",
    created_at: "2024-01-20",
  },
  {
    id: 3,
    title: "Real Estate Transaction",
    client: "Property Ventures",
    client_id: 3,
    description: "Commercial property purchase and contract negotiation",
    value: 75000,
    status: "prospect",
    priority: "high",
    practice_area: "Real Estate Law",
    estimated_close_date: "2024-04-10",
    created_at: "2024-01-25",
  },
  {
    id: 4,
    title: "Intellectual Property Protection",
    client: "TechCorp Inc.",
    client_id: 1,
    description: "Patent filing and trademark registration",
    value: 35000,
    status: "won",
    priority: "low",
    practice_area: "IP Law",
    estimated_close_date: "2024-01-30",
    created_at: "2024-01-10",
  },
];

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "prospect": return "bg-accent/10 text-accent border-accent/20";
      case "consultation": return "bg-warning/10 text-warning border-warning/20";
      case "active": return "bg-success/10 text-success border-success/20";
      case "won": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "lost": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.practice_area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || opportunity.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const activeOpportunities = filteredOpportunities.filter(opp => opp.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your legal cases and business opportunities.
          </p>
        </div>
        <Button variant="legal">
          <Plus className="w-4 h-4" />
          Create Opportunity
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-legal-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pipeline</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-legal-accent" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-legal-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold text-foreground">{activeOpportunities}</p>
              </div>
              <Briefcase className="w-8 h-8 text-legal-accent" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-legal-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">68%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-legal-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-legal-border shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search opportunities by title, client, or practice area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Status
              </Button>
              <Button variant="outline" size="sm">
                Priority
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="border-legal-border shadow-card hover:shadow-elegant transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {opportunity.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {opportunity.client}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {opportunity.practice_area}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {opportunity.estimated_close_date}
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-4">{opportunity.description}</p>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                        <Badge className={getPriorityColor(opportunity.priority)}>
                          {opportunity.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-2xl font-bold text-foreground mb-2">
                        <DollarSign className="w-5 h-5" />
                        {formatCurrency(opportunity.value)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4" />
                              Edit Opportunity
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4" />
                              Schedule Meeting
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <Card className="border-legal-border shadow-card">
          <CardContent className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No opportunities found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search criteria." : "Start by creating your first opportunity."}
            </p>
            <Button variant="legal">
              <Plus className="w-4 h-4" />
              Create Opportunity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}