"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { submitForm } from "@/lib/submit-form";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const CAREERS_REEL =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4";

const perks = [
  {
    title: "Work with icons",
    description:
      "Shoot alongside founders, athletes and brands whose content reaches hundreds of millions.",
  },
  {
    title: "Global shoots",
    description:
      "London and Dubai are home base; the work travels wherever the story is.",
  },
  {
    title: "Best-in-class craft",
    description:
      "Thousands of published videos have refined a formula — and a bar — you will be held to.",
  },
  {
    title: "Move fast",
    description:
      "Small team, no committees. What you cut this week is live this week.",
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

const inputClass =
  "w-full rounded-[2px] border border-[color:var(--rule-strong)] bg-white px-4 py-3 text-[15px] text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] outline-none transition-colors duration-300 focus:border-[color:var(--ink)]";

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
  // See ContactForm: a mailto hand-off has not been delivered yet.
  const [handedOff, setHandedOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (result.ok) {
      setHandedOff(result.handedOff);
      setSent(true);
    } else setError(result.error);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="border-t border-[color:var(--rule)] py-14"
        >
          <h3 className="text-[25px] md:text-[32px] font-extralight text-[color:var(--ink)]">
            {handedOff ? (
              <span>
                Almost <span className="em-serif">there</span>.
              </span>
            ) : (
              <span>
                Application <span className="em-serif">received</span>.
              </span>
            )}
          </h3>
          <p className="mt-4 text-[15px] text-[color:var(--ink-mid)] max-w-[52ch] leading-relaxed">
            {handedOff
              ? "We've opened your email app with your application ready. Send it and we'll read every word."
              : "Thanks for applying to Tilted Needle. We read every application and will be in touch if there's a fit."}
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 border-t border-[color:var(--rule)] pt-12"
        >
          <div>
            <label htmlFor="app-name" className="eyebrow mb-3 block">
              name
            </label>
            <input id="app-name" name="name" type="text" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="app-email" className="eyebrow mb-3 block">
              email
            </label>
            <input id="app-email" name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="app-role" className="eyebrow mb-3 block">
              role
            </label>
            <select
              id="app-role"
              name="role"
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              className={inputClass}
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="app-exp" className="eyebrow mb-3 block">
              years of experience
            </label>
            <input id="app-exp" name="experience" type="text" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="app-link" className="eyebrow mb-3 block">
              portfolio / cv link
            </label>
            <input
              id="app-link"
              name="link"
              type="url"
              placeholder="https://"
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="app-message" className="eyebrow mb-3 block">
              anything else (optional)
            </label>
            <textarea id="app-message" name="message" rows={5} className={inputClass} />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={submitting}
              className="pill pill-solid px-8 py-3.5 text-[15px] disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send application"}
            </button>
            <p aria-live="polite" className="text-[13px] text-[color:var(--ink-mid)]">
              {error}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function RoleRow({
  role,
  index,
  onApply,
}: {
  role: Role;
  index: number;
  onApply: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[color:var(--rule)]">
      <h3>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={"role-panel-" + index}
          id={"role-trigger-" + index}
          className="grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-6 md:gap-x-12 py-7 md:py-9 text-left"
        >
          <span className="text-[13px] text-[color:var(--ink-mid)] tabular-nums pl-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>
            <span className="block text-[21px] md:text-[32px] font-extralight text-[color:var(--ink)]">
              {role.title}
            </span>
            <span className="eyebrow-serif mt-1 block">
              {role.location.toLowerCase()} &middot; {role.type.toLowerCase()}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-[21px] text-[color:var(--ink-mid)] transition-transform duration-300 pr-1"
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          >
            +
          </span>
        </button>
      </h3>
      <motion.div
        id={"role-panel-" + index}
        role="region"
        aria-labelledby={"role-trigger-" + index}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
        className="overflow-hidden"
      >
        <div className="pb-9 md:grid md:grid-cols-[auto_1fr] md:gap-x-12">
          <span aria-hidden="true" className="hidden md:block text-[13px] pl-1">
            &nbsp;&nbsp;
          </span>
          <div>
            <p className="text-[15px] leading-relaxed text-[color:var(--ink-mid)] max-w-[62ch]">
              {role.description}
            </p>
            <p className="mt-4 text-[13px] text-[color:var(--ink-mid)]">
              {role.requirements.join(" · ").toLowerCase()}
            </p>
            <button
              onClick={() => onApply(role.title)}
              className="underline-draw mt-6 text-[15px] text-[color:var(--ink)]"
            >
              apply for this role <span aria-hidden="true">&#8600;</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CareersPage() {
  const reduced = useReducedMotion();
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);
  const applyRef = useRef<HTMLDivElement>(null);

  const applyFor = (title: string) => {
    setSelectedRole(title);
    applyRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <motion.p {...rise(0)} className="eyebrow mb-8">
            careers &mdash; london &middot; dubai
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="font-thin text-[color:var(--ink)] leading-[1.14] text-[11vw] sm:text-[56px] md:text-[72px] lg:text-[88px] max-w-[16ch]"
          >
            Join the team behind the <span className="em-serif">views</span>.
          </motion.h1>
          <motion.p
            {...rise(0.16)}
            className="mt-10 text-[17px] md:text-[21px] text-[color:var(--ink-mid)] max-w-[52ch] leading-relaxed"
          >
            A social-media production company working with world-class brands and
            creators. If your bar is as high as ours, we should talk.
          </motion.p>
        </div>

        <motion.div {...rise(0.24)} className="mx-auto max-w-[1600px] px-6 md:px-[60px] mt-14">
          <div className="plate aspect-[21/9] w-full">
            <video
              src={CAREERS_REEL}
              muted
              loop
              playsInline
              autoPlay={!reduced}
              preload="metadata"
              className="h-full w-full object-cover"
              aria-label="Behind the scenes of a Tilted Needle shoot"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>life here</SectionTag>
          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE_OUT_EXPO }}
                className="border-t border-[color:var(--rule)] py-8 md:py-10"
              >
                <h3 className="text-[21px] md:text-[25px] font-light text-[color:var(--ink)]">
                  {perk.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-mid)] max-w-[54ch]">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </section>

      <section id="roles" className="py-16 md:py-24 scroll-mt-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>open roles</SectionTag>
          <div className="mt-10 md:mt-14">
            {roles.map((role, i) => (
              <RoleRow key={role.title} role={role} index={i} onApply={applyFor} />
            ))}
            <div className="border-t border-[color:var(--rule)]" />
          </div>
          <p className="mt-8 text-[15px] text-[color:var(--ink-mid)]">
            Nothing that fits? Send an open application below anyway.
          </p>
        </div>
      </section>

      <section id="apply" ref={applyRef} className="py-16 md:py-24 scroll-mt-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>apply</SectionTag>
          <h2 className="mt-8 mb-12 font-thin text-[color:var(--ink)] leading-[1.15] text-[9vw] sm:text-[44px] md:text-[64px] max-w-[16ch]">
            Send us your <span className="em-serif">application</span>.
          </h2>
          <div className="max-w-[900px]">
            <ApplicationForm role={selectedRole} onRoleChange={setSelectedRole} />
          </div>
        </div>
      </section>
    </div>
  );
}
