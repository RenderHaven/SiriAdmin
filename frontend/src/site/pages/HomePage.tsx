import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Camera, MapPin, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { api, type Category, type PortfolioImage, type Service } from "@/lib/api";
import heroImg from "@/assets/hero.jpg";
import { InlineErrorCard } from "@/components/errors/InlineErrorCard";
import { SectionSkeleton } from "@/components/errors/LoadingSkeleton";

export function HomePage() {
  return (
    <div className="overflow-hidden bg-background">
      <Hero />
      <MarqueeStrip />
      <FeaturedWork />
      <FeaturedProjects />
      <ServicesList />
      <AboutTimeline />
      <Stats />
      <Testimonials />
      <CTASection />
    </div>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-background pb-16 pt-32 md:pb-24">
      {/* Background image */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 -z-10"
      >
        <img
          src={heroImg}
          alt=""
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,107,53,0.15),transparent_50%)]" />
      </motion.div>

      {/* Floating thumbnails */}
      <FloatingThumbs />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-primary"
        >
          <span className="h-px w-10 bg-primary" />
          Photography &amp; Event Studio · Est. 2017
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-display text-[14vw] font-bold leading-[0.85] tracking-tighter md:text-[9vw] lg:text-[120px]"
        >
          We Don&apos;t Just
          <br />
          <span className="italic font-normal text-muted-foreground">Capture</span>{" "}
          Moments.
          <br />
          <span className="text-primary">We Create</span>{" "}
          <span className="text-stroke italic font-normal">Stories.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 grid items-end gap-8 md:grid-cols-[1.2fr_auto]"
        >
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            An independent studio in the business of slow craft — cinematic
            weddings, editorial portraits and event experiences engineered to
            outlast every trend.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/portfolio"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:shadow-[0_0_50px_rgba(255,107,53,0.5)]"
            >
              <span>Explore Work</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-foreground"
            >
              <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-primary group-hover:text-primary">
                Start a project
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="h-8 w-px bg-white/20" />
          <span>Scroll</span>
          <span className="text-primary">↓</span>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingThumbs() {
  const query = useQuery({
    queryKey: ["portfolio", "hero-thumbs"],
    queryFn: () => api.getPortfolioImages(),
  });

  if (query.isLoading) return null;
  if (query.isError || !query.data?.length) return null;

  const thumbs = query.data.slice(0, 4);

  const positions = [
    "right-[6%] top-[18%] h-32 w-24 rotate-[6deg] md:h-48 md:w-36",
    "right-[22%] top-[8%] h-24 w-32 -rotate-[8deg] md:h-32 md:w-44",
    "right-[12%] bottom-[28%] h-28 w-40 rotate-[-4deg] md:h-36 md:w-52 hidden md:block",
    "right-[32%] bottom-[40%] h-20 w-28 rotate-[10deg] hidden lg:block",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-[1]">
      {thumbs.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.15, duration: 1 }}
          className={`absolute overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] float-slow ${positions[i]}`}
          style={{ animationDelay: `${i * 1.2}s` }}
        >
          <img src={img.image_url} alt="" className="h-full w-full object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── MARQUEE ───────────────────────── */

function MarqueeStrip() {
  const items = [
    "Weddings",
    "Editorial",
    "Portraits",
    "Commercial",
    "Events",
    "Brand Films",
  ];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-background py-6">
      <div className="flex w-max marquee gap-12 whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-3xl font-semibold uppercase tracking-tight md:text-5xl"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className={i % 2 === 0 ? "text-stroke" : "text-foreground"}>
              {t}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── FEATURED WORK (MASONRY) ───────────────────────── */

function FeaturedWork() {
  const query = useQuery({
    queryKey: ["home", "featured-work"],
    queryFn: async () => ({
      categories: await api.getCategories(),
      images: await api.getPortfolioImages(),
    }),
  });

  if (query.isLoading) return <SectionSkeleton rows={4} />;
  if (query.isError) {
    return (
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <InlineErrorCard error={query.error} onRetry={() => query.refetch()} isRetrying={query.isFetching} />
      </section>
    );
  }

  if (!query.data) return <SectionSkeleton rows={4} />;

  const { categories, images: data } = query.data;
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const images = useMemo(
    () =>
      data
        .filter((img) => {
          const category = categoryMap.get(img.category_id);
          return img.is_active !== false && category?.is_active !== false;
        })
        .slice(0, 7),
    [data, categoryMap],
  );

  if (!images.length) return null;

  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-32">
      <div className="mb-16 grid items-end gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
            ✱ Selected archive
          </p>
          <h2 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl">
            Recent <span className="italic text-stroke">frames.</span>
          </h2>
        </div>
        <Link
          to="/portfolio"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary"
        >
          View all work
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </Link>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {images.map((img, i) => {
          const cat = categoryMap.get(img.category_id);
          // Vary heights for visual rhythm
          const span = [
            "aspect-[3/4]",
            "aspect-[4/5]",
            "aspect-[1/1]",
            "aspect-[3/4]",
            "aspect-[4/3]",
            "aspect-[2/3]",
            "aspect-[4/5]",
          ][i % 7];
          return (
            <motion.figure
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.05 }}
              className="group relative block break-inside-avoid overflow-hidden rounded-2xl bg-card"
            >
              <div className={`relative overflow-hidden ${span}`}>
                <img
                  src={img.image_url}
                  alt={img.caption ?? "Portfolio image"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-6 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary">
                    {cat?.name ?? "Story"}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold text-foreground">
                    {img.caption ?? "Untitled frame"}
                  </p>
                </div>
                <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── FEATURED PROJECTS (ALT LAYOUT) ───────────────────────── */

function FeaturedProjects() {
  const query = useQuery({
    queryKey: ["home", "featured-projects"],
    queryFn: async () => ({
      categories: await api.getCategories(),
      images: await api.getPortfolioImages(),
    }),
  });

  if (query.isLoading) return null;
  if (query.isError) {
    return (
      <section className="relative bg-card py-16">
        <div className="mx-auto max-w-[1400px] px-6">
          <InlineErrorCard error={query.error} onRetry={() => query.refetch()} isRetrying={query.isFetching} />
        </div>
      </section>
    );
  }

  if (!query.data) return null;

  const { categories, images: data } = query.data;
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const projects = useMemo(
    () =>
      data
        .filter((img) => {
          const c = categoryMap.get(img.category_id);
          return img.is_active !== false && c?.is_active !== false;
        })
        .slice(0, 3)
        .map((img, i) => ({
          ...img,
          location: ["Udaipur, IN", "Goa, IN", "Jaipur, IN"][i],
          year: ["2025", "2024", "2024"][i],
          story:
            [
              "A monsoon-soaked palace wedding shot across three days and four light moods — slow, deliberate, family-first.",
              "A coastal editorial built around stillness and salt — minimal direction, maximum atmosphere.",
              "Brand storytelling for a heritage textile label, photographed in the lanes where the craft began.",
            ][i],
        })),
    [data, categoryMap],
  );

  if (!projects.length) return null;

  return (
    <section className="relative bg-card py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-20 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
            ✱ Featured stories
          </p>
          <h2 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Projects we&apos;d frame
            <br />
            <span className="italic text-stroke">on the wall.</span>
          </h2>
        </div>

        <div className="space-y-32">
          {projects.map((p, i) => {
            const cat = categoryMap.get(p.category_id);
            const reverse = i % 2 === 1;
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9 }}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.caption ?? p.story}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.5s] hover:scale-105"
                    />
                  </div>
                  <div className="absolute left-4 top-4 rounded-full bg-background/80 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-foreground backdrop-blur">
                    {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="inline-flex items-center gap-2 text-primary">
                      <Camera className="h-3 w-3" />
                      {cat?.name ?? "Story"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {p.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {p.year}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-4xl font-bold leading-[1] tracking-tight md:text-6xl">
                    {p.caption ?? "Untitled story"}
                  </h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                    {p.story}
                  </p>
                  <Link
                    to="/portfolio"
                    className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    View Gallery
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SERVICES (HOVER LIST) ───────────────────────── */

function ServicesList() {
  const query = useQuery({
    queryKey: ["home", "services-list"],
    queryFn: async () => ({
      services: await api.getServices(),
      images: await api.getPortfolioImages(),
    }),
  });
  const [active, setActive] = useState(0);

  if (query.isLoading) return <SectionSkeleton rows={3} />;
  if (query.isError) {
    return (
      <section className="relative overflow-hidden bg-background py-16">
        <div className="mx-auto max-w-[1400px] px-6">
          <InlineErrorCard error={query.error} onRetry={() => query.refetch()} isRetrying={query.isFetching} />
        </div>
      </section>
    );
  }

  if (!query.data) return <SectionSkeleton rows={3} />;

  const { services, images: imgs } = query.data;
  const list = services.filter((s) => s.is_active !== false).slice(0, 6);

  if (!list.length) return null;

  return (
    <section className="relative overflow-hidden bg-background py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1fr_1.2fr] md:gap-24">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
            ✱ What we do
          </p>
          <h2 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Services
            <br />
            <span className="italic text-stroke">in motion.</span>
          </h2>
          <p className="mt-6 max-w-sm text-muted-foreground">
            Six disciplines, one obsession with the right frame at the right
            second. Hover a service to feel its mood.
          </p>

          <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-3xl md:block">
            {list.map((s, i) => {
              const img = s.image_url || imgs[i % imgs.length]?.image_url;
              return (
                <motion.img
                  key={s.id}
                  src={img}
                  alt=""
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    scale: i === active ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              );
            })}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </div>

        <ul className="divide-y divide-white/10 border-y border-white/10">
          {list.map((s, i) => (
            <li
              key={s.id}
              onMouseEnter={() => setActive(i)}
              className="group relative"
            >
              <Link
                to={`/services/${s.id}`}
                className="relative flex items-center justify-between gap-6 py-8 transition-all"
              >
                <div className="flex items-center gap-6">
                  <span className="font-grotesk text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-3xl font-semibold tracking-tight transition-all md:text-5xl ${
                      i === active
                        ? "translate-x-4 text-primary"
                        : "text-foreground group-hover:translate-x-2"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                <ArrowRight
                  className={`h-5 w-5 transition-all ${
                    i === active ? "translate-x-2 text-primary" : "text-muted-foreground"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── ABOUT TIMELINE ───────────────────────── */

function AboutTimeline() {
  const milestones = [
    { year: "2017", title: "Started Photography", body: "First camera, first wedding, first time we knew." },
    { year: "2019", title: "100+ Events", body: "From backyards to ballrooms across the country." },
    { year: "2022", title: "500+ Happy Clients", body: "Word of mouth became our only marketing." },
    { year: "2025", title: "International Projects", body: "Bali, Dubai, Italy — different light, same craft." },
  ];

  return (
    <section className="relative bg-background py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
              ✱ The studio
            </p>
            <h2 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              Eight years
              <br />
              of <span className="italic text-stroke">slow craft.</span>
            </h2>
            <p className="mt-8 max-w-md text-muted-foreground">
              We are a small team that took a long way around. No quick wins, no
              borrowed style — every chapter earned with a camera in hand.
            </p>
          </div>

          <ol className="relative space-y-12 border-l border-white/10 pl-8">
            {milestones.map((m, i) => (
              <motion.li
                key={m.year}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative"
              >
                <span className="absolute -left-[37px] top-2 grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background" />
                <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-primary">
                  {m.year}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {m.title}
                </h3>
                <p className="mt-2 max-w-md text-muted-foreground">{m.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── STATS ───────────────────────── */

function Stats() {
  const stats = [
    { n: "1000+", l: "Photos Delivered" },
    { n: "250+", l: "Events Covered" },
    { n: "8+", l: "Years Experience" },
    { n: "99%", l: "Client Satisfaction" },
  ];
  return (
    <section className="relative border-y border-white/10 bg-card py-24">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="border-l border-white/10 pl-6 first:border-l-0 md:first:pl-0"
          >
            <p className="font-display text-6xl font-bold leading-none tracking-tighter text-foreground md:text-7xl">
              <Counter value={s.n} />
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {s.l}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Counter({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <>
      {n}
      <span className="text-primary">{suffix}</span>
    </>
  );
}

/* ───────────────────────── TESTIMONIALS ───────────────────────── */

const TESTIMONIALS = [
  {
    quote:
      "They didn't just photograph our wedding — they remembered it for us, frame by frame. Years later we still find new details in every image.",
    name: "Ananya & Rohan",
    role: "Wedding · Udaipur",
  },
  {
    quote:
      "A studio that understands restraint. Every shot felt intentional, every edit felt patient. Worth every rupee and every minute.",
    name: "Meera Iyer",
    role: "Editorial · Vogue India",
  },
  {
    quote:
      "Calm on set, ruthless in the edit. Our brand campaign moved like a film and our team noticed first.",
    name: "Kabir Anand",
    role: "Commercial · Linen & Co.",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);
  const t = TESTIMONIALS[i];

  return (
    <section className="relative overflow-hidden bg-background py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
              ✱ Words on us
            </p>
            <h2 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              Trusted by
              <br />
              the <span className="italic text-stroke">quietly obsessed.</span>
            </h2>
          </div>
          <div className="hidden gap-2 md:flex">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-10 bg-primary" : "w-4 bg-white/20"
                }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 md:grid-cols-[auto_1fr]"
        >
          <div className="grid h-24 w-24 place-items-center rounded-full border border-primary/40 text-primary md:h-32 md:w-32">
            <span className="font-display text-6xl leading-none">"</span>
          </div>
          <blockquote>
            <p className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-foreground md:text-5xl">
              {t.quote}
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-primary" />
              <div>
                <p className="font-grotesk text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  {t.role}
                </p>
              </div>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA ───────────────────────── */

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-card via-background to-card p-10 md:p-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[var(--color-teal)]/15 blur-3xl" />

          <p className="relative text-[10px] uppercase tracking-[0.4em] text-primary">
            ✱ Let&apos;s begin
          </p>
          <h2 className="relative mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl">
            Have a story
            <br />
            worth <span className="italic text-stroke">telling well?</span>
          </h2>
          <div className="relative mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:shadow-[0_0_60px_rgba(255,107,53,0.55)]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
            <Link
              to="/services"
              className="text-xs font-medium uppercase tracking-[0.3em] text-foreground hover:text-primary"
            >
              Browse services →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
