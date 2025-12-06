import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import temple1 from "@/assets/temple1.jpg";
import temple2 from "@/assets/temple2.jpg";
import temple3 from "@/assets/temple3.jpg";
import temple4 from "@/assets/temple4.jpg";
import temple5 from "@/assets/temple5.jpg";
import temple6 from "@/assets/temple6.jpg";
import temple7 from "@/assets/temple7.jpg";
import temple8 from "@/assets/temple8.jpg";
import temple9 from "@/assets/temple9.jpg";

interface Photo {
  id: string;
  imageUrl: string;
  alt: string;
}

interface PhotoSection {
  date: string;
  title?: string; // Optional occasion title
  photos: Photo[];
}

const photoSections: PhotoSection[] = [
  {
    date: "2024-01-15",
    title: "Makar Sankranti Celebration",
    photos: [
      { id: "1", imageUrl: temple1, alt: "Temple view during Makar Sankranti" },
      { id: "2", imageUrl: temple2, alt: "Festival decorations" },
      { id: "3", imageUrl: temple3, alt: "Devotees gathering" },
    ],
  },
  {
    date: "2024-02-10",
    title: "Maha Shivaratri Special",
    photos: [
      { id: "4", imageUrl: temple4, alt: "Shivaratri celebrations" },
      { id: "5", imageUrl: temple5, alt: "Evening aarti" },
    ],
  },
  {
    date: "2024-03-20",
    // No title - just date
    photos: [
      { id: "6", imageUrl: temple6, alt: "Temple architecture" },
      { id: "7", imageUrl: temple7, alt: "Temple details" },
      { id: "8", imageUrl: temple8, alt: "Temple view" },
      { id: "9", imageUrl: temple9, alt: "Temple complex" },
    ],
  },
  {
    date: "2024-04-14",
    title: "Ram Navami Festival",
    photos: [
      { id: "10", imageUrl: temple1, alt: "Ram Navami celebration" },
      { id: "11", imageUrl: temple2, alt: "Festival preparations" },
    ],
  },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Photos = () => {
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
        <div className="space-y-16">
          {photoSections.map((section, sectionIndex) => (
            <section key={sectionIndex} className="space-y-6">
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
      </main>
    </div>
  );
};

export default Photos;
