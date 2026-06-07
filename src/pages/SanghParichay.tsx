import { useState } from "react";
import Navigation from "@/components/Navigation";
import SanghDetailModal from "@/components/SanghDetailModal";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { sanghAcharyas, type SanghAcharya } from "@/data/sanghParichay";
import { BookOpen } from "lucide-react";

const SanghParichay = () => {
  const [selectedAcharya, setSelectedAcharya] = useState<SanghAcharya | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (acharya: SanghAcharya) => {
    setSelectedAcharya(acharya);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-temple py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            संघ परिचय
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            दिगंबर जैन संत परंपरा के प्रमुख आचार्यों का परिचय
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sanghAcharyas.map((acharya) => (
            <Card
              key={acharya.id}
              className="group cursor-pointer border-border bg-card shadow-warm hover:shadow-temple transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleCardClick(acharya)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(acharya);
                }
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg leading-snug font-semibold text-foreground">
                    {acharya.title}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      <SanghDetailModal
        acharya={selectedAcharya}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default SanghParichay;
