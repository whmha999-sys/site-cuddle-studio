"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Quote, Star } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface AnimatedTestimonialsProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials?: Testimonial[];
  autoRotateInterval?: number;
  trustedCompanies?: string[];
  trustedCompaniesTitle?: string;
  className?: string;
  dir?: "ltr" | "rtl";
}

export function AnimatedTestimonials({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it.",
  badgeText = "Trusted by customers",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "",
  className,
  dir = "ltr",
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);
    return () => clearInterval(interval);
  }, [autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      dir={dir}
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-28",
        className
      )}
    >
      {/* Background ornaments */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto max-w-7xl px-4 md:px-8"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            {badgeText && (
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" />
                {badgeText}
              </div>
            )}

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {subtitle}
            </p>

            <div className="mt-8 flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    activeIndex === index
                      ? "w-10 bg-primary"
                      : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: cards */}
          <div className="relative min-h-[340px] md:min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.96,
                  y: activeIndex === index ? 0 : 16,
                  pointerEvents: activeIndex === index ? "auto" : "none",
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="relative h-full rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
                  <div className="mb-4 flex items-center gap-1">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>

                  <div className="relative mb-6">
                    <Quote
                      className={cn(
                        "absolute -top-2 h-8 w-8 text-primary/20",
                        dir === "rtl" ? "-right-1 rotate-180" : "-left-1"
                      )}
                    />
                    <p
                      className={cn(
                        "text-base leading-relaxed text-foreground md:text-lg",
                        dir === "rtl" ? "pr-8" : "pl-8"
                      )}
                    >
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      {testimonial.avatar && (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company ? `, ${testimonial.company}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Logo cloud */}
        {trustedCompanies.length > 0 && (
          <motion.div variants={itemVariants} className="mt-20 text-center">
            {trustedCompaniesTitle && (
              <p className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {trustedCompaniesTitle}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustedCompanies.map((company) => (
                <div
                  key={company}
                  className="text-lg font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
                >
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default AnimatedTestimonials;
