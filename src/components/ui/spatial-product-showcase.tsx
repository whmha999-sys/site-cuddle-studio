import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Battery, ChevronRight, Sliders, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShowcaseMetric {
  label: string;
  value: number; // 0-100 for bar fill
  displayValue?: string; // overrides percentage text
  icon: LucideIcon;
}

export interface ShowcaseState {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  statusLabel: string;
  batteryLabel: string;
  /** Tailwind gradient classes for halo, e.g. "from-emerald-500/40 to-teal-900/0" */
  haloGradient: string;
  /** Tailwind bg-* color for fills + dot */
  accentBg: string;
  /** Tailwind text-* color */
  accentText: string;
  /** Tailwind ring color */
  accentRing: string;
  metrics: ShowcaseMetric[];
}

interface Props {
  states: ShowcaseState[];
  initialId?: string;
  dir?: "ltr" | "rtl";
  viewSpecsLabel?: string;
  onViewSpecs?: () => void;
}

const containerV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 110, damping: 20 } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};
const imageV = (fromX: number): Variants => ({
  initial: { opacity: 0, scale: 1.3, filter: "blur(14px)", x: fromX, rotate: fromX < 0 ? -12 : 12 },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, rotate: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
  exit: { opacity: 0, scale: 0.7, filter: "blur(18px)", transition: { duration: 0.25 } },
});

export default function SpatialProductShowcase({
  states,
  initialId,
  dir = "ltr",
  viewSpecsLabel = "View Specs",
  onViewSpecs,
}: Props) {
  const [activeId, setActiveId] = useState(initialId ?? states[0]?.id);
  const active = states.find((s) => s.id === activeId) ?? states[0];
  const isRTL = dir === "rtl";
  const activeIdx = states.findIndex((s) => s.id === active.id);
  // Visual sits "opposite" side of content; in LTR visual=left when first state, mirror for RTL
  const visualOnStart = activeIdx === 0;
  const fromX = visualOnStart ? -60 : 60;

  return (
    <section
      dir={dir}
      className="relative w-full overflow-hidden rounded-3xl bg-[#0a0a0f] text-zinc-100 min-h-[560px] md:min-h-[640px]"
    >
      {/* Animated background halo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${active.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", active.haloGradient)} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(10,10,15,0.85)_70%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-4 p-6 md:p-12 min-h-[560px] md:min-h-[640px]">
        {/* VISUAL */}
        <div
          className={cn(
            "relative flex items-center justify-center min-h-[280px] md:min-h-0",
            visualOnStart ? "md:order-1" : "md:order-2",
          )}
        >
          {/* concentric rings */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`rings-${active.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {[0.55, 0.75, 0.95].map((s, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute rounded-full border",
                    active.accentRing,
                  )}
                  style={{
                    width: `${s * 100}%`,
                    height: `${s * 100}%`,
                    aspectRatio: "1 / 1",
                    maxWidth: 520,
                    maxHeight: 520,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${active.id}`}
              variants={imageV(fromX)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative z-10"
            >
              <motion.img
                src={active.image}
                alt={active.title}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="max-h-[360px] md:max-h-[460px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

        </div>

        {/* CONTENT */}
        <div className={cn("flex", visualOnStart ? "md:order-2" : "md:order-1")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${active.id}`}
              variants={containerV}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "flex flex-col gap-5 w-full justify-center",
                isRTL ? "items-end text-right" : "items-start text-left",
              )}
            >
              <motion.div
                variants={itemV}
                className={cn("text-xs tracking-[0.25em] uppercase", active.accentText)}
              >
                {active.eyebrow}
              </motion.div>
              <motion.h2
                variants={itemV}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                {active.title}
              </motion.h2>
              <motion.p
                variants={itemV}
                className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed"
              >
                {active.description}
              </motion.p>

              <motion.div variants={itemV} className="w-full max-w-md space-y-3 mt-2">
                {active.metrics.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={i} className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                        <span className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          {m.label}
                        </span>
                        <span className="text-zinc-200 font-medium">
                          {m.displayValue ?? `${m.value}%`}
                        </span>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className={cn("absolute top-0 h-full rounded-full", active.accentBg, isRTL ? "right-0" : "left-0")}
                          initial={{ width: 0 }}
                          animate={{ width: `${m.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div variants={itemV} className="flex items-center gap-4 mt-1">
                <button
                  type="button"
                  onClick={onViewSpecs}
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  {viewSpecsLabel}
                  <ChevronRight className={cn("w-4 h-4 transition-transform", isRTL && "rotate-180")} />
                </button>
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Battery className="w-3.5 h-3.5" />
                  {active.batteryLabel}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* THUMBNAIL SWITCHER */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(92%,720px)]">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 overflow-x-auto no-scrollbar">
          {states.map((s) => {
            const isActive = s.id === active.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                title={s.label}
                className={cn(
                  "relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all focus:outline-none bg-white/[0.03]",
                  isActive ? cn("scale-110 shadow-lg", s.accentRing) : "border-white/10 opacity-55 hover:opacity-100",
                )}
              >
                <img
                  src={s.image}
                  alt={s.label}
                  className="relative w-full h-full object-contain p-1"
                  draggable={false}
                />
                {isActive && (
                  <motion.span
                    layoutId="thumb-dot"
                    className={cn("absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full", s.accentBg)}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );


}
