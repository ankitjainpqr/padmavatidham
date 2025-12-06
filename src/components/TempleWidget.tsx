import { Card, CardContent } from "@/components/ui/card";

interface TempleWidgetProps {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
}

const TempleWidget = ({ title, description, imageUrl, location }: TempleWidgetProps) => {
  return (
    <Card className="group overflow-hidden shadow-warm hover:shadow-temple transition-all duration-300 transform hover:-translate-y-1 bg-card border-border">
      <div className="aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gradient-temple rounded-full"></div>
          <span className="text-sm text-muted-foreground font-medium">{location}</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default TempleWidget;