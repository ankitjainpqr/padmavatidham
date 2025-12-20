import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Photo {
  id: string;
  imageUrl: string;
  alt: string;
}

interface PhotoSection {
  id: string;
  date: string;
  title?: string; // Optional occasion title
  photos: Photo[];
}

interface PhotoSectionDB {
  id: string;
  date: string;
  occasion: string | null;
  photos: Array<{
    image_url: string;
    alt: string;
  }>;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Photos = () => {
  const [photoSections, setPhotoSections] = useState<PhotoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured. Please set up your credentials in the .env file.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("photo_sections")
          .select("*")
          .order("date", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          const sections: PhotoSection[] = data.map((section: PhotoSectionDB) => ({
            id: section.id,
            date: section.date,
            title: section.occasion || undefined,
            photos: section.photos.map((photo, index) => ({
              id: `${section.id}-${index}`,
              imageUrl: photo.image_url,
              alt: photo.alt || `Photo ${index + 1}`,
            })),
          }));
          setPhotoSections(sections);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load photos");
        console.error("Error fetching photos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-destructive text-center mb-4">Error: {error}</p>
          {!isSupabaseConfigured() && (
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Please set up your Supabase credentials in the <code className="bg-muted px-1 rounded">.env</code> file. 
              See <code className="bg-muted px-1 rounded">SUPABASE_SETUP.md</code> for instructions.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-temple py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Photo Gallery
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            Explore our collection of temple photographs, organized by date and special occasions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {photoSections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No photos available yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {photoSections.map((section) => (
              <section key={section.id} className="space-y-6">
                {/* Date Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {formatDate(section.date)}
                      </h2>
                      {section.title && (
                        <p className="text-lg text-primary font-semibold mt-1">
                          {section.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.photos.map((photo) => (
                    <Card
                      key={photo.id}
                      className="group overflow-hidden shadow-warm hover:shadow-temple transition-all duration-300 transform hover:-translate-y-1 bg-card border-border"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Photos;
