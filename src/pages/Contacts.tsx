import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ContactInfo {
  whatsapp_number: string | null;
  email: string | null;
}

const Contacts = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    whatsapp_number: null,
    email: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured. Contact information cannot be loaded.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("contact_info")
          .select("whatsapp_number, email")
          .limit(1)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw fetchError;
        }

        if (data) {
          setContactInfo({
            whatsapp_number: data.whatsapp_number,
            email: data.email,
          });
        }
      } catch (err: any) {
        console.error("Error fetching contact info:", err);
        setError(err.message || "Failed to load contact information");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Use fetched values or fallback to defaults
  const whatsappNumber = contactInfo.whatsapp_number || "+1234567890";
  const emailAddress = contactInfo.email || "contact@templevista.com";
  // Google Maps embed URL for माँ पद्मावती जैन साधु वृत्ति आश्रम खेकड़ा शहर
  // Location: V79R+H4X, Khekra, Uttar Pradesh 250101
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d27951.899233390213!2d77.2522448!3d28.8689927!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c56831197ca7f%3A0xa93ee65ecfce7264!2z4KSu4KS-4KSBIOCkquCkpuCljeCkruCkvuCkteCkpOClgCDgpJzgpYjgpKgg4KS44KS-4KSn4KWBIOCkteClg-CkpOCljeCkpOCkvyDgpIbgpLbgpY3gpLDgpK4g4KSW4KWH4KSV4KSh4KS84KS-IOCktuCkueCksA!5e0!3m2!1sen!2sin!4v1766226564648!5m2!1sen!2sin";

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I would like to get in touch.");
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-temple py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            Get in touch with us. We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Information Section */}
        <section className="mb-16">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading contact information...</span>
            </div>
          ) : error ? (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Note:</strong> {error}
              </p>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WhatsApp Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-2xl">WhatsApp</CardTitle>
                </div>
                <CardDescription>
                  Reach out to us on WhatsApp for quick responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactInfo.whatsapp_number ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg">
                      <span className="font-semibold">Number:</span>
                      <a 
                        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {whatsappNumber}
                      </a>
                    </div>
                    <Button 
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>WhatsApp number not available</p>
                    <p className="text-sm mt-2">Please contact the administrator to add contact information.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">Email</CardTitle>
                </div>
                <CardDescription>
                  Send us an email and we'll get back to you soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactInfo.email ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg">
                      <span className="font-semibold">Email:</span>
                      <a 
                        href={`mailto:${emailAddress}`}
                        className="text-primary hover:underline break-all"
                      >
                        {emailAddress}
                      </a>
                    </div>
                    <Button 
                      onClick={handleEmailClick}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Email address not available</p>
                    <p className="text-sm mt-2">Please contact the administrator to add contact information.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Google Maps Section */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-2xl">Our Location</CardTitle>
              </div>
              <CardDescription>
                Find us on the map below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Contacts;
