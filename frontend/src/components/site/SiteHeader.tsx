import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:px-7",
          scrolled
            ? "mx-4 border border-white/10 bg-black/60 backdrop-blur-xl"
            : "mx-4 border border-transparent",
        )}
      >
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[11px] font-bold tracking-tighter text-primary-foreground">
            S.
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            SIRI<span className="text-primary">/</span>STUDIO
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group relative text-[11px] font-medium uppercase tracking-[0.3em] transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {n.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
          <Link
            to="/admin"
            className="group relative text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
            <span className="absolute -bottom-2 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden rounded-full border border-primary px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(255,107,53,0.45)] md:inline-flex"
          >
            Book Now
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-foreground hover:border-primary hover:text-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-3xl border border-white/10 bg-black/90 p-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-semibold text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-semibold text-foreground"
            >
              Admin
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-fit rounded-full border border-primary px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-primary"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/10 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary">
          Let&apos;s create
        </p>
        <h2 className="mt-4 font-display text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl lg:text-[110px]">
          Something
          <br />
          <span className="italic text-stroke">extraordinary.</span>
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-semibold">SIRI / STUDIO</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              An independent photography &amp; event studio crafting cinematic
              visual stories for people who care about the detail.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Studio
            </p>
            <p className="text-foreground">hello@siristudio.in</p>
            <p className="mt-1 text-muted-foreground">+91 00000 00000</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Follow
            </p>
            <div className="flex flex-col gap-1">
              {["Instagram", "Facebook", "YouTube", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-display text-lg font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {s} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Siri Studio — All rights reserved.</p>
          <p className="tracking-[0.3em]">CRAFTED WITH LIGHT &amp; TIME</p>
        </div>
      </div>
    </footer>
  );
}
