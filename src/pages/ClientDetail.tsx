import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentList from "@/components/DocumentList";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit,
  AlertCircle,
  FileText
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentRefreshTrigger, setDocumentRefreshTrigger] = useState(0);

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setClient(data);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast({
        title: "Error",
        description: "Failed to load client details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUploaded = () => {
    setDocumentRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/clients")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/clients")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Button>
        </div>
        <Card className="border-legal-border shadow-card">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Client not found</h3>
            <p className="text-muted-foreground">The client you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/clients")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <p className="text-muted-foreground">Client Details</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4" />
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-legal-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-legal-accent" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={
                  client.status === 'active' 
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-muted/10 text-muted-foreground border-muted/20"
                }>
                  {client.status}
                </Badge>
              </div>

              <Separator />

              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-legal-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{client.email}</p>
                  </div>
                </div>
              )}

              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-legal-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{client.phone}</p>
                  </div>
                </div>
              )}

              {client.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-legal-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium text-foreground">{client.company}</p>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-legal-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">{client.address}</p>
                  </div>
                </div>
              )}

              {client.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-foreground">{client.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Document Upload */}
          <DocumentUpload 
            clientId={client.id}
            onDocumentUploaded={handleDocumentUploaded}
          />
        </div>

        {/* Documents */}
        <div className="lg:col-span-2">
          <DocumentList 
            clientId={client.id}
            refreshTrigger={documentRefreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}