import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  Calendar,
  Eye,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isAfter, isBefore, addDays } from "date-fns";

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  expiration_date: string | null;
  created_at: string;
}

interface DocumentListProps {
  clientId: string;
  refreshTrigger?: number;
}

export default function DocumentList({ clientId, refreshTrigger }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [clientId, refreshTrigger]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${document.name}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDocument = async (document: Document) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      toast({
        title: "Document Deleted",
        description: `${document.name} has been deleted.`,
      });

      // Refresh the list
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getExpirationStatus = (expirationDate: string | null) => {
    if (!expirationDate) return null;
    
    const expDate = new Date(expirationDate);
    const today = new Date();
    const soonThreshold = addDays(today, 30); // 30 days warning
    
    if (isBefore(expDate, today)) {
      return { status: 'expired', label: 'Expired', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    } else if (isBefore(expDate, soonThreshold)) {
      return { status: 'expiring', label: 'Expiring Soon', color: 'bg-warning/10 text-warning border-warning/20' };
    } else {
      return { status: 'valid', label: 'Valid', color: 'bg-success/10 text-success border-success/20' };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card className="border-legal-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-legal-accent" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-legal-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-legal-accent" />
          Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No documents uploaded</h3>
            <p className="text-muted-foreground">Upload your first document to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const expirationStatus = getExpirationStatus(doc.expiration_date);
              
              return (
                <div key={doc.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-legal-accent/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-legal-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{doc.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>Uploaded {format(new Date(doc.created_at), "MMM d, yyyy")}</span>
                          {doc.expiration_date && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Expires {format(new Date(doc.expiration_date), "MMM d, yyyy")}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {expirationStatus && (
                            <Badge className={expirationStatus.color}>
                              {expirationStatus.status === 'expired' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {expirationStatus.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => downloadDocument(doc)}>
                            <Download className="w-4 h-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteDocument(doc)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}