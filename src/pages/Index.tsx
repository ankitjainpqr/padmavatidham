import Navigation from "@/components/Navigation";
import TempleWidget from "@/components/TempleWidget";
import temple1 from "@/assets/temple1.jpg";
import temple2 from "@/assets/temple2.jpg";
import temple3 from "@/assets/temple3.jpg";
import temple4 from "@/assets/temple4.jpg";
import temple5 from "@/assets/temple5.jpg";
import temple6 from "@/assets/temple6.jpg";
import temple7 from "@/assets/temple7.jpg";
import temple8 from "@/assets/temple8.jpg";
import temple9 from "@/assets/temple9.jpg";

const temples = [
  {
    title: "Golden Temple Complex",
    location: "Amritsar, Punjab",
    description: "The most sacred shrine of Sikhism, known for its stunning golden facade and spiritual significance. This architectural marvel stands majestically, reflecting divine light and offering peace to millions of devotees.",
    imageUrl: temple1,
  },
  {
    title: "Meenakshi Temple",
    location: "Madurai, Tamil Nadu", 
    description: "A historic Hindu temple dedicated to Goddess Meenakshi, featuring towering gopurams adorned with thousands of colorful sculptures. This architectural wonder represents the pinnacle of Dravidian temple design.",
    imageUrl: temple2,
  },
  {
    title: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    description: "One of the twelve Jyotirlingas dedicated to Lord Shiva, situated on the banks of the sacred Ganges. This ancient temple has been a center of pilgrimage for thousands of years.",
    imageUrl: temple3,
  },
  {
    title: "Khajuraho Temple",
    location: "Madhya Pradesh",
    description: "UNESCO World Heritage site famous for its intricate stone carvings and sculptures. These ancient temples showcase the artistic brilliance and cultural heritage of medieval India.",
    imageUrl: temple4,
  },
  {
    title: "Lotus Temple",
    location: "New Delhi",
    description: "A Bahá'í House of Worship known for its distinctive lotus-shaped architecture. This modern temple welcomes people of all faiths and represents unity in diversity.",
    imageUrl: temple5,
  },
  {
    title: "Dilwara Temples",
    location: "Mount Abu, Rajasthan",
    description: "Exquisite Jain temples carved entirely from white marble, showcasing incredible architectural precision. These temples are renowned for their intricate ceiling designs and detailed craftsmanship.",
    imageUrl: temple6,
  },
  {
    title: "Bodhgaya Temple",
    location: "Bihar",
    description: "The sacred site where Buddha attained enlightenment, featuring ancient stupas and peaceful meditation spaces. This temple complex is a pilgrimage destination for Buddhists worldwide.",
    imageUrl: temple7,
  },
  {
    title: "Hoysaleswara Temple",
    location: "Halebidu, Karnataka",
    description: "A masterpiece of Hoysala architecture with detailed stone sculptures depicting epic stories. This 12th-century temple showcases the artistic excellence of ancient Indian craftsmen.",
    imageUrl: temple8,
  },
  {
    title: "Padmanabhaswamy Temple",
    location: "Thiruvananthapuram, Kerala",
    description: "A coastal temple dedicated to Lord Vishnu, known for its traditional Kerala architecture and oceanic setting. This ancient temple offers breathtaking views and spiritual serenity.",
    imageUrl: temple9,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-temple py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Sacred Temples of India
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            Discover the spiritual magnificence and architectural wonders of India's most revered temples. 
            Each sacred space tells a story of devotion, artistry, and timeless tradition that has inspired 
            generations of pilgrims and visitors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Temple Introduction */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            A Journey Through Sacred Architecture
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Indian temples represent more than mere structures of stone and marble—they are living embodiments 
              of spiritual devotion, architectural genius, and cultural heritage. From the golden spires that pierce 
              the sky to the intricate carvings that tell ancient stories, each temple is a testament to the 
              profound connection between the divine and the artistic.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These sacred spaces have served as centers of worship, learning, and community for millennia. 
              They showcase diverse architectural styles from different regions and periods, reflecting the 
              rich tapestry of Indian civilization and the enduring power of faith to inspire magnificent creation.
            </p>
          </div>
        </section>

        {/* Temple Grid */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Explore Sacred Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temples.map((temple, index) => (
              <TempleWidget
                key={index}
                title={temple.title}
                location={temple.location}
                description={temple.description}
                imageUrl={temple.imageUrl}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;