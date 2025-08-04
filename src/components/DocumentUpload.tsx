import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  FileText, 
  Calendar as CalendarIcon, 
  X,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  clientId: string;
  onDocumentUploaded?: () => void;
}

export default function DocumentUpload({ clientId, onDocumentUploaded }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>();
  const [hasExpiration, setHasExpiration] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!documentName) {
        // Set default name from filename without extension
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setDocumentName(nameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !documentName) {
      toast({
        title: "Missing Information",
        description: "Please select a file and provide a document name.",
        variant: "destructive",
      });
      return;
    }

    if (hasExpiration && !expirationDate) {
      toast({
        title: "Missing Expiration Date",
        description: "Please select an expiration date or disable expiration.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${clientId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          client_id: clientId,
          user_id: user.id,
          name: documentName,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          expiration_date: hasExpiration ? expirationDate?.toISOString().split('T')[0] : null,
        });

      if (dbError) throw dbError;

      toast({
        title: "Document Uploaded",
        description: "The document has been successfully uploaded.",
      });

      // Reset form
      setFile(null);
      setDocumentName("");
      setExpirationDate(undefined);
      setHasExpiration(false);
      
      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Notify parent component
      onDocumentUploaded?.();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="border-legal-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-legal-accent" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select File</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              className="flex-1"
            />
            {file && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={removeFile}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        {/* Document Name */}
        <div className="space-y-2">
          <Label htmlFor="document-name">Document Name</Label>
          <Input
            id="document-name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Enter document name"
          />
        </div>

        {/* Expiration Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="has-expiration"
              checked={hasExpiration}
              onCheckedChange={setHasExpiration}
            />
            <Label htmlFor="has-expiration">Set Expiration Date</Label>
          </div>

          {hasExpiration && (
            <div className="space-y-2">
              <Label>Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <Button 
          onClick={handleUpload}
          disabled={!file || !documentName || uploading}
          className="w-full"
          variant="legal"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}