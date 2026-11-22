import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-5 md:gap-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl",
      "glass-card border border-white/10 dark:border-white/5",
      "p-6 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "transform-gpu transition-all duration-300 hover:scale-[1.01] hover:shadow-xl",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 transition-all duration-300 group-hover:-translate-y-2">
      <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-bold text-foreground tracking-tight">
        {name}
      </h3>
      <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none z-10 flex w-full translate-y-4 transform-gpu flex-row items-center pt-4 opacity-80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="pointer-events-auto p-0 text-primary font-semibold hover:bg-transparent hover:underline gap-1.5"
      >
        <a href={href}>
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/[0.03]" />
  </div>
);

export { BentoCard, BentoGrid };
export default BentoGrid;