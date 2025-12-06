import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Sparkles, Users, Clock } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-temple py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            Celebrating the Spiritual Heritage and Architectural Grandeur of India's Sacred Temples
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Temple Vista Gallery, we are dedicated to preserving and sharing the rich spiritual 
              and architectural heritage of India's magnificent temples. Our mission is to bring the 
              stories, artistry, and profound significance of these sacred spaces to people around 
              the world, fostering appreciation for one of humanity's greatest cultural treasures.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through our platform, we aim to connect visitors with the timeless beauty, intricate 
              craftsmanship, and deep spiritual meaning that these temples embody—serving as bridges 
              between the ancient and the modern, the sacred and the accessible.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Spiritual Heritage</CardTitle>
                </div>
                <CardDescription>
                  Honoring the sacred traditions and spiritual significance of each temple
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Architectural Beauty</CardTitle>
                </div>
                <CardDescription>
                  Showcasing the incredible artistry and architectural mastery of ancient India
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Cultural Preservation</CardTitle>
                </div>
                <CardDescription>
                  Preserving and sharing the rich cultural heritage for future generations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Timeless Stories</CardTitle>
                </div>
                <CardDescription>
                  Connecting visitors with the ancient stories and traditions of these sacred spaces
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* About Indian Temples Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl mb-4">The Legacy of Indian Temples</CardTitle>
              <CardDescription className="text-lg">
                A Journey Through Millennia of Devotion and Artistry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Architectural Marvels
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Indian temples represent one of the most sophisticated architectural traditions in 
                  human history. From the towering gopurams of South India to the intricate stone 
                  carvings of Central India, each temple showcases unique regional styles that have 
                  evolved over thousands of years. The Dravidian style of the South, the Nagara style 
                  of the North, and the Vesara style of Central India each tell their own story of 
                  cultural evolution and artistic expression.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beyond their architectural beauty, Indian temples serve as centers of spiritual 
                  practice, community gathering, and cultural preservation. They are places where 
                  devotees connect with the divine, where ancient rituals are performed, and where 
                  the wisdom of generations is passed down. Each temple is dedicated to specific 
                  deities and follows unique traditions that have been maintained for centuries, 
                  creating living connections to India's ancient past.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Cultural Heritage
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  These sacred structures are repositories of India's rich cultural heritage, 
                  housing not only religious significance but also artistic masterpieces, historical 
                  records, and architectural innovations. The intricate carvings depict scenes from 
                  ancient epics, mythological stories, and daily life, providing invaluable insights 
                  into the civilization that created them. Many temples are UNESCO World Heritage 
                  Sites, recognized globally for their outstanding universal value.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  A Living Tradition
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  What makes Indian temples truly remarkable is that they are not merely historical 
                  monuments—they are living, breathing centers of worship and community life. 
                  Millions of pilgrims visit these sacred sites each year, continuing traditions 
                  that span millennia. The sounds of bells, the fragrance of incense, and the 
                  devotion of worshippers create an atmosphere that transcends time, connecting 
                  the present with the eternal.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-card border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Respect</h3>
                <p className="text-muted-foreground">
                  We approach each temple with deep respect for its spiritual significance and 
                  cultural importance, honoring the traditions and beliefs they represent.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Authenticity</h3>
                <p className="text-muted-foreground">
                  We strive to present accurate, authentic information about each temple, ensuring 
                  that visitors receive genuine insights into their history and significance.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Preservation</h3>
                <p className="text-muted-foreground">
                  We are committed to supporting the preservation of these architectural and 
                  cultural treasures for future generations to experience and appreciate.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
