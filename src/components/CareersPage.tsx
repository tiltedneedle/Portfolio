"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Earth,
  Gauge,
  MapPin,
  Plus,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { submitForm } from "@/lib/submit-form";

const EASE = [0.16, 1, 0.3, 1] as const;

type Perk = { icon: ReactNode; title: string; description: string; gradient: string };

const perks: Perk[] = [
  {
    icon: <Star className="w-6 h-6" />,
    title: "Work with icons",
    description:
      "Create for names that define their categories: The Jet Business, Aston Martin, Koenigsegg and the creators shaping culture. The brief is always world-class.",
    gradient: "from-[#2997ff] to-[#5e5ce6]",
  },
  {
    icon: <Earth className="w-6 h-6" />,
    title: "Global shoots",
    description:
      "From London to Dubai, LA to Hong Kong. We go where the story is, and bring the right people with us to capture it properly.",
    gradient: "from-[#ff375f] to-[#af52de]",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Best-in-class craft",
    description:
      "Cinematic capture, obsessive editing, a relentless standard. We sweat the frame, the cut and the hook until it's right.",
    gradient: "from-[#30d158] to-[#2997ff]",
  },
  {
    icon: <Gauge className="w-6 h-6" />,
    title: "Move fast",
    description:
      "A small, senior team that ships. No bloated process, just sharp people taking ownership and turning briefs into views.",
    gradient: "from-[#ff9f0a] to-[#ff375f]",
  },
];

type Role = {
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

const roles: Role[] = [
  {
    title: "Experienced Videographer",
    location: "London",
    type: "Full Time",
    description:
      "Be able to film on various cameras, iPhone, and equipment to capture the highest quality cinematic content. Be able to take initiative.",
    requirements: ["10+ years experience", "Able to travel globally"],
  },
  {
    title: "Experienced Video Editor",
    location: "London",
    type: "Full Time",
    description:
      "Able to produce the highest quality video edits for long and short form content starting with raw footage provided. Able to adhere to deadlines and perform well under pressure.",
    requirements: ["10+ years experience"],
  },
  {
    title: "Experienced CRM Manager",
    location: "London",
    type: "Full Time",
    description:
      "Able to manage workflows, teams, and the A-Z pipeline efficiently so targets and deliverables are exceeded. Proficient in client communication. Able to organise and book logistics for global shoots.",
    requirements: ["10+ years experience"],
  },
];

const roleOptions = [...roles.map((r) => r.title), "Open application"];

function RoleCard({
  role,
  index,
  onApply,
}: {
  role: Role;
  index: number;
  onApply: (title: string) => void;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(index === 0);
  const panelId = `role-panel-${index}`;
  const buttonId = `role-button-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 * index, duration: 0.6, ease: EASE }}
      className="group relative rounded-[28px] bg-gradient-to-b from-[#1c1c1e] to-[#161616] overflow-hidden elevate-static"
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#2997ff] to-[#5e5ce6] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none" />

      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="relative w-full text-left p-8 md:p-10 flex items-start justify-between gap-6"
      >
        <div className="flex-1">
          <h3 className="text-[22px] md:text-[26px] font-semibold text-[#f5f5f7] tracking-[-0.02em] group-hover:text-white transition-colors duration-300">
            {role.title}
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] text-[12px] text-[#a1a1a6] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#2997ff]" />
              {role.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] text-[12px] text-[#a1a1a6] font-medium">
              <Briefcase className="w-3.5 h-3.5 text-[#2997ff]" />
              {role.type}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] text-[12px] text-[#a1a1a6] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#2997ff]" />
              On-site
            </span>
          </div>
        </div>

        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="shrink-0 mt-1 w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-[#f5f5f7] group-hover:bg-white/[0.09] transition-colors duration-300"
        >
          <Plus className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.5, ease: EASE }}
            className="relative overflow-hidden"
          >
            <div className="px-8 md:px-10 pb-8 md:pb-10">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-7" />
              <p className="text-[17px] md:text-[17px] text-[#a1a1a6] leading-relaxed max-w-2xl">
                {role.description}
              </p>

              <div className="mt-8">
                <h4 className="text-[12px] text-[#86868b] uppercase tracking-[0.08em] font-medium mb-4">
                  Key Requirements
                </h4>
                <ul className="space-y-3">
                  {role.requirements.map((requirement) => (
                    <li key={requirement} className="flex items-center gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#2997ff]/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#2997ff]" />
                      </span>
                      <span className="text-[15px] md:text-[17px] text-[#f5f5f7]">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-9">
                <button
                  type="button"
                  onClick={() => onApply(role.title)}
                  aria-label={`Apply for ${role.title}`}
                  className="group/apply inline-flex items-center gap-2 px-7 py-3.5 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[15px] font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                >
                  Apply for this role
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/apply:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ApplicationForm({
  role,
  onRoleChange,
}: {
  role: string;
  onRoleChange: (value: string) => void;
}) {
  const reduced = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldClass =
    "transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const result = await submitForm({
      type: "application",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      role: String(data.get("role") || role),
      experience: String(data.get("experience") || ""),
      link: String(data.get("link") || ""),
      message: String(data.get("message") || ""),
    });

    setSubmitting(false);
    if (result.ok) setSent(true);
    else setError(result.error);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-[28px] bg-gradient-to-b from-[#1c1c1e] to-[#161616] p-10 md:p-14 text-center"
          style={{ boxShadow: "var(--elev-1)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] flex items-center justify-center"
            style={{ boxShadow: "var(--glow-medium)" }}
          >
            <CheckCircle2 className="w-7 h-7 text-[#30d158]" />
          </motion.div>
          <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-2">Application received</h3>
          <p className="text-[17px] text-[#86868b] max-w-md mx-auto">
            Thanks for applying to Tilted Needle. We read every application and will be in touch if
            there&apos;s a fit.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-[28px] bg-gradient-to-b from-[#1c1c1e] to-[#161616] p-8 md:p-10 space-y-6"
          style={{ boxShadow: "var(--elev-1)" }}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="app-name"
                className="block text-[12px] uppercase tracking-[0.08em] mb-3 text-[#86868b]"
              >
                Full name
              </label>
              <Input
                id="app-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className={fieldClass}
              />
            </div>
            <div>
              <label
                htmlFor="app-email"
                className="block text-[12px] uppercase tracking-[0.08em] mb-3 text-[#86868b]"
              >
                Email
              </label>
              <Input
                id="app-email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="app-role"
                className="block text-[12px] uppercase tracking-[0.08em] mb-3 text-[#86868b]"
              >
                Role
              </label>
              <select
                id="app-role"
                name="role"
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                className={`h-11 w-full rounded-xl border-0 bg-[#1c1c1e] px-4 text-[15px] text-[#f5f5f7] outline-none ring-1 ring-white/[0.06] focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.15)] ${fieldClass}`}
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#1c1c1e] text-[#f5f5f7]">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="app-exp"
                className="block text-[12px] uppercase tracking-[0.08em] mb-3 text-[#86868b]"
              >
                Experience
              </label>
              <Input
                id="app-exp"
                name="experience"
                type="text"
                placeholder="e.g. 10+ years"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="app-link"
              className="block text-[12px] uppercase tracking-[0.08em] mb-3 text-[#86868b]"
            >
              Portfolio, showreel or CV link
            </label>
            <Input
              id="app-link"
              name="link"
              type="url"
              placeholder="https://"
              className={fieldClass}
            />
          </div>

          <div>
            <label
              htmlFor="app-message"
              className="block text-[12px] uppercase tracking-[0.08em] mb-3 text-[#86868b]"
            >
              Message
            </label>
            <Textarea
              id="app-message"
              name="message"
              rows={4}
              placeholder="Tell us about your experience and why you'd be a great fit..."
              className={fieldClass}
            />
          </div>

          {error && (
            <p className="text-[15px] text-[#ff453a]" role="alert">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 bg-[#f5f5f7] text-[#1c1c1e] rounded-2xl text-[17px] font-medium transition-all duration-500 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-[#1c1c1e] border-t-transparent rounded-full"
              />
            ) : (
              <>
                Submit application
                <Send className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <p className="text-[12px] text-[#86868b] text-center">
            Or email us directly at{" "}
            <a
              href="mailto:info@tiltedneedle.com"
              className="text-[#a1a1a6] hover:text-[#f5f5f7] underline-offset-2 hover:underline"
            >
              info@tiltedneedle.com
            </a>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export function CareersPage() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const [selectedRole, setSelectedRole] = useState("Open application");

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const applyFor = (title: string) => {
    setSelectedRole(title);
    scrollToId("apply");
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-black min-h-[85vh] flex items-center"
      >
        <motion.div style={{ scale: reduced ? 1 : videoScale }} className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          >
            <source
              src="https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_24fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          animate={reduced ? {} : { x: [0, 30, -20, 0], y: [0, -40, 20, 0], opacity: [0.15, 0.3, 0.2, 0.15] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#2997ff]/20 blur-[150px] pointer-events-none"
        />
        <motion.div
          animate={reduced ? {} : { x: [0, -25, 15, 0], y: [0, 30, -20, 0], opacity: [0.1, 0.2, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#af52de]/15 blur-[130px] pointer-events-none"
        />

        <motion.div
          style={{ opacity: reduced ? 1 : heroOpacity }}
          className="mx-auto max-w-[1200px] px-6 relative w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[#2997ff] text-[17px] font-medium mb-4"
            >
              Careers
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 1, ease: EASE }}
              className="text-5xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.03em] leading-[1.05] text-[#f5f5f7] mb-6"
            >
              Join the team
              <br />
              <span
                className="bg-gradient-to-r from-[#a1a1a6] via-[#f5f5f7] to-[#a1a1a6] bg-clip-text text-transparent animate-gradient-shift"
                style={{ backgroundSize: "200% 100%" }}
              >
                behind the views.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-[22px] text-[#86868b] max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Tilted Needle is a social-media production company based in London and Dubai, working
              with world-class brands and creators. Our team is global, on shoots for clients from
              LA to Hong Kong.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.button
                type="button"
                onClick={() => scrollToId("roles")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[17px] font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                View open roles
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-28 md:py-40 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0d0d0d]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-[1200px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-[#2997ff] text-[17px] font-medium mb-4">Why Tilted Needle</p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              A studio built to win.
            </h2>
            <p className="mt-6 text-xl md:text-[22px] text-[#86868b] max-w-xl mx-auto">
              Small team. Big briefs. The standard never drops.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: reduced ? 0 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.6, ease: EASE }}
              >
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE } }}
                  className="group relative p-8 md:p-10 rounded-[28px] bg-gradient-to-b from-[#1c1c1e] to-[#161616] h-full elevate-static-lg sheen"
                >
                  <div
                    className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${perk.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
                  />
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${perk.gradient} flex items-center justify-center mb-6 text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {perk.icon}
                  </motion.div>
                  <h3 className="text-[22px] md:text-[24px] font-semibold text-[#f5f5f7] mb-3 group-hover:text-white transition-colors duration-300">
                    {perk.title}
                  </h3>
                  <p className="text-[15px] md:text-[17px] text-[#86868b] leading-relaxed group-hover:text-[#a1a1a6] transition-colors duration-300">
                    {perk.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="roles"
        className="relative py-28 md:py-40 bg-[#0a0a0a] overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(41,151,255,0.05),transparent_60%)]" />
        <div className="mx-auto max-w-[900px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-20"
          >
            <p className="text-[#2997ff] text-[17px] font-medium mb-4">Open roles</p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              Where you come in.
            </h2>
            <p className="mt-6 text-xl md:text-[22px] text-[#86868b] max-w-xl mx-auto">
              We hire senior. If you&apos;re exceptional at your craft, we want to hear from you.
            </p>
          </motion.div>

          <div className="space-y-5">
            {roles.map((role, i) => (
              <RoleCard key={role.title} role={role} index={i} onApply={applyFor} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="apply"
        className="relative py-28 md:py-40 bg-black overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(175,82,222,0.05),transparent_60%)]" />
        <div className="mx-auto max-w-[760px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-[#af52de] text-[17px] font-medium mb-4">Apply now</p>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#f5f5f7] tracking-[-0.025em] leading-[1.08]">
              Send us your application.
            </h2>
            <p className="mt-6 text-xl md:text-[22px] text-[#86868b] max-w-xl mx-auto leading-relaxed">
              Apply for a role above or send an open application. Share your showreel, portfolio or
              CV, we read every one.
            </p>
          </motion.div>

          <ApplicationForm role={selectedRole} onRoleChange={setSelectedRole} />
        </div>
      </section>
    </>
  );
}
