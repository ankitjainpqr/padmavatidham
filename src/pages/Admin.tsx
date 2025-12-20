import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Upload, X, Loader2, LogOut, User, Mail, MessageCircle, Trash2, Save } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const photoUploadSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  occasion: z.string().min(1, "Occasion is required").optional(),
  photos: z.array(z.instanceof(File)).min(1, "At least one photo is required"),
});

type PhotoUploadForm = z.infer<typeof photoUploadSchema>;

interface ContactInfo {
  id?: string;
  whatsapp_number: string;
  email: string;
}

const Admin = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ whatsapp_number: "", email: "" });
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const getUserInitials = () => {
    if (!user?.email) return "A";
    const parts = user.email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhotoUploadForm>({
    resolver: zodResolver(photoUploadSchema),
    defaultValues: {
      occasion: "",
      photos: [],
    },
  });

  const date = watch("date");
  
  // Register date field
  useEffect(() => {
    register("date");
  }, [register]);

  // Fetch contact info on mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoadingContact(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("contact_info")
          .select("*")
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        if (data) {
          setContactInfo({
            id: data.id,
            whatsapp_number: data.whatsapp_number || "",
            email: data.email || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching contact info:", error);
        toast({
          title: "Error",
          description: "Failed to load contact information",
          variant: "destructive",
        });
      } finally {
        setIsLoadingContact(false);
      }
    };

    fetchContactInfo();
  }, [toast]);

  // Handle contact info save/update
  const handleSaveContactInfo = async () => {
    setIsSavingContact(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured");
      }

      const { whatsapp_number, email } = contactInfo;

      // Validate email format if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        setIsSavingContact(false);
        return;
      }

      // Validate WhatsApp number format if provided (basic validation)
      if (whatsapp_number && !/^[\d\s\+\-\(\)]+$/.test(whatsapp_number)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid WhatsApp number",
          variant: "destructive",
        });
        setIsSavingContact(false);
        return;
      }

      if (contactInfo.id) {
        // Update existing record
        const { error } = await supabase
          .from("contact_info")
          .update({
            whatsapp_number: whatsapp_number || null,
            email: email || null,
          })
          .eq("id", contactInfo.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Contact information updated successfully!",
        });
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("contact_info")
          .insert({
            whatsapp_number: whatsapp_number || null,
            email: email || null,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setContactInfo({
            id: data.id,
            whatsapp_number: data.whatsapp_number || "",
            email: data.email || "",
          });
        }

        toast({
          title: "Success",
          description: "Contact information saved successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save contact information",
        variant: "destructive",
      });
    } finally {
      setIsSavingContact(false);
    }
  };

  // Handle delete contact info
  const handleDeleteContactInfo = async () => {
    if (!contactInfo.id) {
      // If no ID, just clear the form
      setContactInfo({ whatsapp_number: "", email: "" });
      return;
    }

    if (!confirm("Are you sure you want to delete the contact information? This action cannot be undone.")) {
      return;
    }

    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured");
      }

      const { error } = await supabase
        .from("contact_info")
        .delete()
        .eq("id", contactInfo.id);

      if (error) throw error;

      setContactInfo({ whatsapp_number: "", email: "" });
      toast({
        title: "Success",
        description: "Contact information deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact information",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setValue("photos", files, { shouldValidate: true });
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue("photos", newFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: PhotoUploadForm) => {
    setIsUploading(true);
    try {
      const dateString = format(data.date, "yyyy-MM-dd");
      
      // Upload photos to Supabase Storage
      const uploadedPhotos = [];
      for (const file of data.photos) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `photos/${dateString}/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("photos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("photos").getPublicUrl(filePath);
        
        uploadedPhotos.push({
          image_url: urlData.publicUrl,
          alt: file.name,
        });
      }

      // Save to database
      const { error: dbError } = await supabase.from("photo_sections").insert({
        date: dateString,
        occasion: data.occasion || null,
        photos: uploadedPhotos,
      });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: `${data.photos.length} photo(s) uploaded successfully!`,
      });

      // Reset form
      setSelectedFiles([]);
      setValue("date", undefined as any);
      setValue("occasion", "");
      setValue("photos", []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-temple py-16 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Admin Panel
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            Upload photos for the gallery
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!isSupabaseConfigured() && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Supabase not configured:</strong> Please set up your Supabase credentials in the <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">.env</code> file. 
              See <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">SUPABASE_SETUP.md</code> for instructions.
            </p>
          </div>
        )}
        
        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="photos">Upload Photos</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Upload Photos</CardTitle>
                <CardDescription>
                  Add photos with date and occasion information
                </CardDescription>
              </CardHeader>
              <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setValue("date", selectedDate as Date, { shouldValidate: true });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              {/* Occasion Input */}
              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  id="occasion"
                  placeholder="e.g., Makar Sankranti Celebration"
                  {...register("occasion")}
                />
                {errors.occasion && (
                  <p className="text-sm text-destructive">{errors.occasion.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="photos">Photos *</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {errors.photos && (
                  <p className="text-sm text-destructive">{errors.photos.message}</p>
                )}

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Selected Files ({selectedFiles.length}):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <p className="mt-1 text-xs text-muted-foreground truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Photos"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Manage Contact Information</CardTitle>
                <CardDescription>
                  Add, update, or delete WhatsApp number and email address displayed on the Contact page
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingContact ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading contact information...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* WhatsApp Number */}
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="whatsapp"
                          placeholder="e.g., +1234567890"
                          value={contactInfo.whatsapp_number}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, whatsapp_number: e.target.value })
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the WhatsApp number with country code (e.g., +91 for India)
                      </p>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g., contact@example.com"
                          value={contactInfo.email}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, email: e.target.value })
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter a valid email address
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSaveContactInfo}
                        disabled={isSavingContact}
                        className="flex-1"
                      >
                        {isSavingContact ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {contactInfo.id ? "Update" : "Save"}
                          </>
                        )}
                      </Button>
                      {(contactInfo.whatsapp_number || contactInfo.email || contactInfo.id) && (
                        <Button
                          onClick={handleDeleteContactInfo}
                          variant="destructive"
                          disabled={isSavingContact}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </div>

                    {/* Current Info Display */}
                    {(contactInfo.whatsapp_number || contactInfo.email) && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Current Contact Information:</p>
                        <div className="space-y-1 text-sm">
                          {contactInfo.whatsapp_number && (
                            <p>
                              <span className="font-medium">WhatsApp:</span> {contactInfo.whatsapp_number}
                            </p>
                          )}
                          {contactInfo.email && (
                            <p>
                              <span className="font-medium">Email:</span> {contactInfo.email}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
