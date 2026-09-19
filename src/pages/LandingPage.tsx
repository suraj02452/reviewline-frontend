import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bug,
  ShieldCheck,
  Sparkles,
  Zap,
  GitCompare,
  FileCode2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "../components/ui/Logo.tsx";
import { Button } from "../components/ui/Button.tsx";
import { CodeDiff, type DiffLine } from "../components/ui/CodeDiff";
import AnnotationCallout from "../components/ui/AnnotationCallout.tsx";
import { heroDiffLines, heroAnnotations } from "../data/mockData";
import { billingApi } from "../api/billingApi";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../api/client";

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function HeroDiffPanel() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="relative">
      {/* Window chrome */}
      <div className="overflow-hidden rounded-xl border border-ink-600 bg-ink-800 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-ink-600 bg-ink-900 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-diff-red/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-diff-green/70" />
          <span className="ml-3 font-mono text-xs text-paper-500">
            orders.controller.js
          </span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs text-amber-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            reviewing
          </span>
        </div>
        <CodeDiff
          lines={heroDiffLines as DiffLine[]}
          highlightLines={inView ? [44, 45] : []}
        />
      </div>

      {/* Floating annotations */}
      <div className="pointer-events-none absolute -right-3 top-16 hidden w-64 -translate-y-2 sm:block">
        {inView &&
          heroAnnotations.map((ann, i) => (
            <div
              key={ann.id}
              className="pointer-events-auto mb-3"
              style={{
                animation: `fade-in-up 0.5s ease-out ${0.4 + i * 0.5}s forwards`,
                opacity: 0,
              }}
            >
              <AnnotationCallout
                tone={ann.severity}
                title={ann.title}
                lineLabel={String(ann.line)}
              >
                {ann.body}
              </AnnotationCallout>
            </div>
          ))}
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Bug;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800 p-6 transition-colors duration-150 hover:border-amber-500/40">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <h3 className="font-display text-lg font-semibold text-paper-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-paper-400">{children}</p>
    </div>
  );
}

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "For trying it out",
    tone: "neutral" as const,
    features: [
      "25 reviews / month",
      "Paste code only",
      "Bug & security checks",
      "1 language at a time",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    tagline: "For working developers",
    tone: "bug" as const,
    features: [
      "Unlimited reviews",
      "File upload up to 500KB",
      "All 12 languages",
      "Refactor suggestions",
      "Review history",
    ],
    cta: "Upgraded to Pro",
    featured: true,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleProCheckout = async () => {
    if (!user) {
      navigate("/register");
      return;
    }
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const { checkoutUrl } = await billingApi.createCheckoutSession();
      window.location.href = checkoutUrl;
    } catch (err) {
      const e = err as ApiError;
      setCheckoutError(e.message || "Could not start checkout. Try again.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-600/60 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how"
              className="text-sm text-paper-300 transition-colors hover:text-paper-100"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-paper-300 transition-colors hover:text-paper-100"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-paper-300 transition-colors hover:text-paper-100"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm">Go to dashboard</Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-paper-300 transition-colors hover:text-paper-100"
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800 px-3 py-1 font-mono text-xs text-paper-400">
              <span className="h-1.5 w-1.5 rounded-full bg-diff-green" />
              AI code review · no setup required
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl lg:text-6xl">
              Paste your code.
              <br />
              Get a real review
              <br />
              <span className="text-amber-500">in seconds.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-400">
              Reviewline reads your code the way a senior engineer would —
              flagging bugs, security holes, and refactor opportunities, then
              explaining each one at the exact line.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {user ? (
                  <Link to="/review/new">
                    <Button size="lg">
                      Run a review
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button size="lg">
                      Run your first review
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link to="/sample-review">
                  <Button size="lg" variant="outline">
                    See a sample review
                  </Button>
                </Link>
              </div>
            </div>
            <p className="mt-4 font-mono text-xs text-paper-500">
              No credit card. No repo access. Your code stays yours.
            </p>
          </div>

          <HeroDiffPanel />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-ink-600/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper-100">
            Three steps. No configuration.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: FileCode2,
                title: "Paste or upload",
                body: "Drop in a snippet or upload a file up to 500KB. Pick the language from a list of 12.",
              },
              {
                step: "02",
                icon: Zap,
                title: "AI reads it line by line",
                body: "The model traces control flow, data flow, and common vulnerability patterns — the way a reviewer does.",
              },
              {
                step: "03",
                icon: GitCompare,
                title: "Get anchored suggestions",
                body: "Each issue points to a line number with an explanation and a before/after diff you can apply.",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative">
                  <span className="font-mono text-sm text-amber-500">
                    {s.step}
                  </span>
                  <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-amber-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-paper-100">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-400">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-ink-600/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper-100">
            Built around the code review itself.
          </h2>
          <p className="mt-3 max-w-2xl text-paper-400">
            Not a chatbot bolted onto an editor. The interface borrows from
            diffs, PR comments, and terminal output — the artifacts developers
            already trust.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={Bug} title="Bug detection">
              Catches null derefs, off-by-one errors, unhandled async, and stale
              closures — with the line where they happen.
            </FeatureCard>
            <FeatureCard icon={ShieldCheck} title="Security analysis">
              SQL injection, XSS, hardcoded secrets, weak crypto. Each finding
              comes with a fixable diff, not just a warning.
            </FeatureCard>
            <FeatureCard icon={Sparkles} title="Refactor suggestions">
              Points out duplicated logic, overly complex functions, and
              patterns that read better another way.
            </FeatureCard>
            <FeatureCard icon={GitCompare} title="Before / after diffs">
              Every suggestion ships as a diff you can read in 5 seconds, not a
              paragraph of prose.
            </FeatureCard>
            <FeatureCard icon={FileCode2} title="12 languages">
              JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby,
              Swift, Kotlin, and C++.
            </FeatureCard>
            <FeatureCard icon={CheckCircle2} title="Line-anchored comments">
              Comments attach to the exact line, like a GitHub PR review — so
              you never lose context.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Testimonials as annotation callouts */}
      {/*<section className="border-t border-ink-600/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper-100">
            What teams say after the first review.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="space-y-3">
                <div className="rounded-md border border-ink-600 bg-ink-900 px-3 py-2 font-mono text-xs text-paper-400">
                  {t.snippet}
                </div>
                <AnnotationCallout
                  tone={t.severity}
                  title={t.name}
                  lineLabel={t.role}
                >
                  &ldquo;{t.quote}&rdquo;
                </AnnotationCallout>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Pricing */}
      <section id="pricing" className="border-t border-ink-600/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper-100">
            Pricing that scales with your reviews.
          </h2>
          <p className="mt-3 text-paper-400">
            Start free. Upgrade when reviews become part of your workflow.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-3xl">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={[
                  "rounded-xl border border-ink-600 bg-ink-800 p-6",
                  tier.featured ? "ring-1 ring-amber-500/50" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-paper-100">
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs text-amber-500">
                      most popular
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-paper-400">{tier.tagline}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-paper-100">
                    {tier.price}
                  </span>
                  <span className="text-sm text-paper-500">
                    / {tier.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-paper-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-diff-green" />
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.name === "Pro" ? (
                  <Button
                    variant={tier.featured ? "primary" : "secondary"}
                    fullWidth
                    className="mt-6"
                    loading={checkoutLoading}
                    onClick={handleProCheckout}
                  >
                    {tier.cta}
                  </Button>
                ) : (
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="mt-6 block"
                  >
                    <Button
                      variant={tier.featured ? "primary" : "secondary"}
                      fullWidth
                    >
                      {user ? "Go to dashboard" : tier.cta}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
          {checkoutError && (
            <p className="mt-4 text-center text-sm text-diff-red">
              {checkoutError}
            </p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-ink-600/60 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper-100 sm:text-4xl">
            Stop waiting for a reviewer to be free.
          </h2>
          <p className="mt-4 text-lg text-paper-400">
            Run a review on your next PR before you even open it.
          </p>
          <div className="mt-8 flex justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-600/60 bg-ink-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <Logo />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper-400">
              <a href="#how" className="hover:text-paper-100">
                How it works
              </a>
              <a href="#features" className="hover:text-paper-100">
                Features
              </a>
              <a href="#pricing" className="hover:text-paper-100">
                Pricing
              </a>
              {user ? (
                <Link to="/dashboard" className="hover:text-paper-100">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hover:text-paper-100">
                    Log in
                  </Link>
                  <Link to="/register" className="hover:text-paper-100">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-8 border-t border-ink-600 pt-6 font-mono text-xs text-paper-500">
            © 2026 Reviewline. Code is processed in memory and never stored
            unless you save a review.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
