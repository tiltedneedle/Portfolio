"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, Code2, Play, Target, Users, Video } from "lucide-react";

const serviceRoutes: Record<string, string> = {
  "content-creation": "content-creation",
  "influencer-marketing": "influencer-marketing",
  "paid-advertising-performance": "paid-advertising-performance",
  "app-web-development": "app-web-development",
};

type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  imageUrl: string;
  videoUrl: string;
  icon: ReactNode;
  gradient: string;
};

const services: Service[] = [
  {
    id: "content-creation",
    title: "Content Creation",
    tagline: "Social-first content, engineered to perform.",
    description:
      "Short-form for personal brands and commercial campaigns, plus long-form YouTube. Built on a proven, data-driven formula refined across thousands of videos and 2B+ organic views.",
    features: [
      "Short-Form for Personal Brands",
      "Short-Form for Commercial",
      "Long-Form YouTube",
      "On-Camera Coaching",
      "Publishing & Analytics",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop",
    videoUrl:
      "https://videos.pexels.com/video-files/5081889/5081889-uhd_2560_1440_25fps.mp4",
    icon: <Video className="w-5 h-5" />,
    gradient: "from-[#ff9f0a] to-[#ff375f]",
  },
  {
    id: "influencer-marketing",
    title: "Influencer Marketing",
    tagline: "Reach through the world's most-watched voices.",
    description:
      "We manage and produce content for major global creators with 18M+ combined reach, connecting brands with audiences that genuinely convert across luxury, automotive, aviation, beauty and more.",
    features: [
      "The European Kid (4.4M+)",
      "Youmi (9.6M+)",
      "Gstaad Guy (2.9M+)",
      "Lord Aleem (1.4M+)",
      "End-to-End Management",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&h=600&fit=crop",
    videoUrl:
      "https://videos.pexels.com/video-files/5585918/5585918-hd_1920_1080_30fps.mp4",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-[#ff375f] to-[#af52de]",
  },
  {
    id: "paid-advertising-performance",
    title: "Paid & Performance",
    tagline: "Every dollar engineered for return.",
    description:
      "Meta ads and omnichannel media buying, ad-ready clipping, and digital PR. Our EuroEyes campaign returned £1.89M from £212k in spend, an 8.9x ROAS in a competitive vertical.",
    features: [
      "Meta Ads & Media Buying",
      "A/B Creative Testing",
      "Clipping for Ad Funnels",
      "Digital PR & Placements",
      "Transparent ROAS Tracking",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    videoUrl:
      "https://videos.pexels.com/video-files/7579968/7579968-hd_1920_1080_25fps.mp4",
    icon: <Target className="w-5 h-5" />,
    gradient: "from-[#64d2ff] to-[#2997ff]",
  },
  {
    id: "app-web-development",
    title: "App & Web Development",
    tagline: "Digital infrastructure built to scale.",
    description:
      "Full-stack websites and e-commerce storefronts built to handle major traffic spikes, plus membership sites and digital courses with LMS integration to build recurring revenue.",
    features: [
      "Website & E-Commerce Buildout",
      "Custom UI/UX",
      "Secure Payments",
      "Course & Membership Platforms",
      "LMS Integration (Skool, Kajabi)",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
    videoUrl:
      "https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_24fps.mp4",
    icon: <Code2 className="w-5 h-5" />,
    gradient: "from-[#5e5ce6] to-[#af52de]",
  },
];

const glowColor = (gradient: string) =>
  gradient.split(" ")[0].replace("from-[", "").replace("]", "");

export function ServicesShowcase() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(services[0]);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && active.videoUrl) {
      if (hovering) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [hovering, active]);

  return (
    <section id="services" className="py-16 md:py-20 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-black to-[#0a0a0a]" />

      <motion.div
        animate={reduced ? {} : { opacity: [0.02, 0.05, 0.02], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[200px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor(active.gradient)}20, transparent 70%)`,
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <p className="text-[#2997ff] text-[17px] font-medium mb-4">Services</p>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em] leading-[1.1]">
            Take a closer look.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div ref={tabsRef} className="flex justify-center gap-2 flex-wrap px-4">
            {services.map((service) => (
              <motion.button
                key={service.id}
                onClick={() => setActive(service)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative px-5 py-3 rounded-full text-[15px] font-medium transition-all duration-300
                  flex items-center gap-2
                  ${
                    active.id === service.id
                      ? "bg-white text-black"
                      : "bg-[#1c1c1e] text-[#86868b] hover:bg-[#2c2c2e] hover:text-white"
                  }
                `}
              >
                {service.icon}
                <span className="hidden sm:inline">{service.title}</span>
                <span className="sm:hidden">{service.title.split(" ")[0]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <div
              className="relative order-2 lg:order-1"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <motion.div
                className="relative aspect-[4/3] rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-br ${active.gradient} opacity-60`}
                />
                <div className="absolute inset-[2px] rounded-[22px] overflow-hidden bg-[#1c1c1e]">
                  {active.videoUrl && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hovering ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 z-10"
                    >
                      <video
                        ref={videoRef}
                        src={active.videoUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  <Image
                    src={active.imageUrl}
                    alt={active.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {active.videoUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: hovering ? 0 : 1, scale: hovering ? 0.8 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-2xl md:text-3xl lg:text-[32px] font-semibold bg-gradient-to-r ${active.gradient} bg-clip-text text-transparent`}
              >
                {active.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-[17px] md:text-[19px] text-[#a1a1a6] leading-relaxed"
              >
                {active.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                {active.features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + 0.05 * i }}
                    className="flex items-center gap-3 group"
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${active.gradient} flex items-center justify-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[15px] text-[#d1d1d6] group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <Link href={`/services/${serviceRoutes[active.id] || active.id}`}>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    mt-8 px-8 py-4 rounded-full text-[15px] font-medium inline-block
                    bg-gradient-to-r ${active.gradient}
                    text-white shadow-lg
                    hover:shadow-xl transition-shadow duration-300
                  `}
                >
                  Learn more about {active.title}
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "2B+", label: "Organic Views" },
            { value: "$250M+", label: "Revenue Generated" },
            { value: "11+", label: "Flagship Clients" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + 0.1 * i }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-[48px] font-semibold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[13px] text-[#86868b] uppercase tracking-wider mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
