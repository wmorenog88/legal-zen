import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  DollarSign,
  Calendar,
  Briefcase,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  TrendingUp
} from "lucide-react";

// Mock data - in real app this would come from Supabase
const mockOpportunities = [
  {
    id: 1,
    title: "Corporate Merger Review",
    client: "TechCorp Inc.",
    client_id: 1,
    description: "Legal review and due diligence for acquisition of smaller tech company. This involves comprehensive analysis of financial statements, legal compliance, intellectual property portfolio, and potential liabilities.",
    value: 125000,
    status: "active",
    priority: "high",
    practice_area: "Corporate Law",
    estimated_close_date: "2024-03-15",
    created_at: "2024-01-15",
    notes: "Client is very responsive and has provided all necessary documentation. Expected to close by Q1 2024.",
    activities: [
      { date: "2024-01-15", action: "Opportunity created", status: "prospect" },
      { date: "2024-01-18", action: "Initial consultation completed", status: "consultation" },
      { date: "2024-01-25", action: "Proposal accepted", status: "active" },
    ]
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
    notes: "Case requires careful review of employment contracts and company policies.",
    activities: [
      { date: "2024-01-20", action: "Opportunity created", status: "prospect" },
      { date: "2024-01-22", action: "Client consultation scheduled", status: "consultation" },
    ]
  },
];

const statusFlow = [
  { status: "prospect", label: "Prospect", icon: Eye, color: "bg-accent/10 text-accent border-accent/20" },
  { status: "consultation", label: "Consultation", icon: Clock, color: "bg-warning/10 text-warning border-warning/20" },
  { status: "active", label: "Active", icon: TrendingUp, color: "bg-success/10 text-success border-success/20" },
  { status: "won", label: "Won", icon: CheckCircle, color: "bg-green-500/10 text-green-700 border-green-500/20" },
  { status: "lost", label: "Lost", icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
];

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading opportunity data
    const foundOpportunity = mockOpportunities.find(opp => opp.id === parseInt(id || "0"));
    setOpportunity(foundOpportunity);
    setLoading(false);
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!opportunity) return;

    try {
      // In real app, update via Supabase
      const updatedOpportunity = { ...opportunity, status: newStatus };
      setOpportunity(updatedOpportunity);
      
      // If status is "won", create an asunto
      if (newStatus === "won") {
        toast({
          title: "¡Oportunidad Ganada!",
          description: "Se ha creado un nuevo asunto para gestionar este proyecto",
        });
        // In a real app, this would create the asunto in the database
        // For now, we just show a success message
        setTimeout(() => {
          toast({
            title: "Asunto Creado",
            description: "Puedes encontrar el nuevo asunto en la sección de Asuntos",
          });
        }, 2000);
      } else {
        toast({
          title: "Status Updated",
          description: `Opportunity status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update opportunity status",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCurrentStatusIndex = () => {
    return statusFlow.findIndex(status => status.status === opportunity?.status);
  };

  const getNextPossibleStatuses = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex === -1) return [];
    
    // Can move to next status or to won/lost from any status except final states
    const nextStatuses = [];
    
    if (opportunity?.status !== "won" && opportunity?.status !== "lost") {
      // Can always mark as won or lost
      nextStatuses.push(statusFlow.find(s => s.status === "won"));
      nextStatuses.push(statusFlow.find(s => s.status === "lost"));
      
      // Can move to next sequential status
      if (currentIndex < 2) { // Not at "active" yet
        nextStatuses.unshift(statusFlow[currentIndex + 1]);
      }
    }
    
    return nextStatuses.filter(Boolean);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Opportunities
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Opportunities
          </Button>
        </div>
        <Card className="border-legal-border shadow-card">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Opportunity not found</h3>
            <p className="text-muted-foreground">The opportunity you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextStatuses = getNextPossibleStatuses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Opportunities
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{opportunity.title}</h1>
            <p className="text-muted-foreground">Opportunity Details</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4" />
          Edit Opportunity
        </Button>
      </div>

      {/* Status Flow */}
      <Card className="border-legal-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-legal-accent" />
            Status Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {statusFlow.map((status, index) => {
              const isActive = status.status === opportunity.status;
              const isPast = index < getCurrentStatusIndex();
              const Icon = status.icon;
              
              return (
                <div key={status.status} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive 
                      ? "border-legal-accent bg-legal-accent text-white" 
                      : isPast 
                        ? "border-success bg-success text-white"
                        : "border-muted bg-background text-muted-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm mt-2 ${isActive ? "text-legal-accent font-medium" : "text-muted-foreground"}`}>
                    {status.label}
                  </span>
                  {index < statusFlow.length - 1 && (
                    <div className={`absolute h-0.5 w-16 mt-6 ${
                      index < getCurrentStatusIndex() ? "bg-success" : "bg-muted"
                    }`} style={{ marginLeft: "3rem" }} />
                  )}
                </div>
              );
            })}
          </div>
          
          {nextStatuses.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Update Status:</p>
              <div className="flex gap-2">
                {nextStatuses.map((status) => {
                  const Icon = status.icon;
                  return (
                    <Button
                      key={status.status}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(status.status)}
                      className="transition-all hover:scale-105"
                    >
                      <Icon className="w-4 h-4" />
                      Mark as {status.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-legal-border shadow-card">
            <CardHeader>
              <CardTitle>Opportunity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{opportunity.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Practice Area</h4>
                  <p className="text-muted-foreground">{opportunity.practice_area}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Priority</h4>
                  <Badge className={
                    opportunity.priority === "high" 
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : opportunity.priority === "medium"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-muted/10 text-muted-foreground border-muted/20"
                  }>
                    {opportunity.priority} priority
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-foreground mb-2">Notes</h3>
                <p className="text-muted-foreground">{opportunity.notes}</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-legal-border shadow-card">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunity.activities?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-legal-accent mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Information */}
          <Card className="border-legal-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-legal-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-semibold text-foreground">{formatCurrency(opportunity.value)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-legal-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-semibold text-foreground">{opportunity.client}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-legal-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Expected Close</p>
                  <p className="font-semibold text-foreground">{opportunity.estimated_close_date}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-legal-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold text-foreground">{opportunity.created_at}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="border-legal-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${statusFlow.find(s => s.status === opportunity.status)?.color || "bg-muted/10 text-muted-foreground border-muted/20"} text-base px-3 py-1`}>
                {opportunity.status}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}