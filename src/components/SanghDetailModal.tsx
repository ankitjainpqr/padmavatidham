import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SanghAcharya, SanghSection } from "@/data/sanghParichay";

type SanghDetailModalProps = {
  acharya: SanghAcharya | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SectionContent({ section }: { section: SanghSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h3 className="text-lg font-semibold text-primary mt-6 mb-3">
          {section.content as string}
        </h3>
      );
    case "poem":
      return (
        <blockquote className="my-4 border-l-4 border-primary/40 bg-primary/5 rounded-r-lg px-4 py-3 italic text-foreground/90">
          {(section.content as string[]).map((line, i) => (
            <p key={i} className="leading-relaxed">
              {line}
            </p>
          ))}
        </blockquote>
      );
    case "facts":
      return (
        <dl className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card/50 p-4">
          {Object.entries(section.content as Record<string, string>).map(
            ([label, value]) => (
              <div key={label}>
                <dt className="text-sm font-medium text-primary">{label}</dt>
                <dd className="text-sm text-muted-foreground mt-0.5">{value}</dd>
              </div>
            ),
          )}
        </dl>
      );
    case "paragraph":
    default:
      return (
        <p className="text-muted-foreground leading-relaxed mb-4">
          {section.content as string}
        </p>
      );
  }
}

function DetailBody({ acharya }: { acharya: SanghAcharya }) {
  return (
    <div className="space-y-1 pr-1">
      {acharya.sections.map((section, index) => (
        <SectionContent key={index} section={section} />
      ))}
    </div>
  );
}

const SanghDetailModal = ({ acharya, open, onOpenChange }: SanghDetailModalProps) => {
  const isMobile = useIsMobile();

  if (!acharya) return null;

  const title = acharya.popupTitle ?? acharya.title;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left border-b border-border pb-4">
            <DrawerTitle className="text-base sm:text-lg leading-snug text-primary pr-8">
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-5rem)] px-4 pb-6">
            <DetailBody acharya={acharya} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg leading-snug text-primary pr-6">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(85vh-5rem)] pr-2">
          <DetailBody acharya={acharya} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SanghDetailModal;
