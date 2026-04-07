import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getAuthToken } from "../utils/authStorage";

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useMemo(() => Boolean(getAuthToken()), []);
  const [theme, setTheme] = useState("dark");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")
      .matches;
    setTheme(prefersLight ? "light" : "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isLight = theme === "light";

  const pageClass = isLight
    ? "bg-slate-50 text-slate-900"
    : "bg-slate-950 text-slate-100";
  const mutedText = isLight ? "text-slate-600" : "text-slate-300";
  const subtleText = isLight ? "text-slate-500" : "text-slate-400";
  const headingText = isLight ? "text-slate-900" : "text-white";
  const cardClass = isLight
    ? "border-slate-200 bg-white/80 shadow-slate-200/40"
    : "border-slate-800 bg-slate-900/70 shadow-slate-950/40";
  const cardSoft = isLight
    ? "border-slate-200 bg-white/90"
    : "border-slate-800 bg-slate-950/60";
  const pillClass = isLight
    ? "border-slate-200 text-slate-700"
    : "border-slate-700 text-slate-200";

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${pageClass}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[140px] ${
            isLight ? "bg-emerald-200/60" : "bg-emerald-500/20"
          }`}
        />
        <div
          className={`absolute right-[-120px] top-24 h-[420px] w-[420px] rounded-full blur-[130px] ${
            isLight ? "bg-cyan-200/60" : "bg-cyan-500/20"
          }`}
        />
        <div
          className={`absolute bottom-[-160px] left-[-120px] h-[460px] w-[460px] rounded-full blur-[150px] ${
            isLight ? "bg-blue-200/60" : "bg-blue-500/20"
          }`}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="flex items-center justify-between">
          <div
            className={`text-base font-semibold uppercase tracking-[0.3em] ${
              isLight ? "text-emerald-500" : "text-emerald-300/80"
            }`}
          >
            Acedit.ai
          </div>
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              aria-label="Open settings"
              className={`flex items-center justify-center rounded-full border px-3 py-3 transition ${pillClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82 2 2 0 1 1-3.32 0 1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33 2 2 0 1 1 0-3.32 1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82 2 2 0 1 1 3.32 0 1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1.82.33 2 2 0 1 1 0 3.32 1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-.6 1z" />
              </svg>
            </button>

            {settingsOpen ? (
              <div
                className={`absolute right-0 top-12 z-10 w-56 rounded-2xl border p-4 shadow-xl ${cardClass}`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
                  Settings
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <button
                    onClick={() =>
                      setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${pillClass}`}
                  >
                    {isLight ? "Switch to dark" : "Switch to light"}
                  </button>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg border border-rose-500/40 px-3 py-2 text-left text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
                    >
                      Logout
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <section
          id="overview"
          className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
              Interview prep studio
            </p>
            <h1
              className={`mt-4 text-balance text-4xl font-extrabold tracking-tight ${headingText} hero-line-animate sm:text-6xl`}
            >
              Land interviews with a{" "}
              <span className="hero-typing bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                focused, AI-guided
              </span>{" "}
              practice flow.
            </h1>
            <p className={`mt-5 max-w-2xl text-pretty text-lg ${mutedText}`}>
              Build sessions, generate precise questions, and review clear
              explanations that keep you interview-ready without the noise.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-xl shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Open dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-xl shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    Get started
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className={`rounded-xl border px-6 py-3 text-base font-semibold transition ${
                      pillClass
                    }`}
                  >
                    Create account
                  </button>
                </>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Prep Speed", value: "2x faster" },
                { label: "Precision", value: "No fluff" },
                { label: "Confidence", value: "Built daily" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-4 ${cardClass}`}
                >
                  <p className={`text-xs uppercase tracking-[0.2em] ${subtleText}`}>
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-3xl border bg-gradient-to-br p-6 shadow-2xl ${
              isLight
                ? "border-slate-200 from-white via-slate-50 to-slate-100 shadow-slate-200/50"
                : "border-slate-800 from-slate-900/90 via-slate-900/60 to-slate-950/90 shadow-slate-950/40"
            }`}
          >
            <div className={`rounded-2xl border p-5 ${cardSoft}`}>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                Your next session
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">
                MERN full stack - 2 years
              </h2>
              <p className={`mt-2 text-sm ${subtleText}`}>
                Focus topics: React, Node, System design
              </p>
              <div className="mt-5 space-y-3">
                {[
                  "Explain how React reconciliation works.",
                  "Design a scalable JWT auth flow.",
                  "Plan caching for a read-heavy API.",
                ].map((item) => (
                  <div
                    key={item}
                    className={`rounded-xl border px-4 py-3 text-sm ${cardClass}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {[
                {
                  title: "Precision prompts",
                  text: "Get concise answers that cut distractions and stay interview-focused.",
                },
                {
                  title: "Guided review",
                  text: "Explainers and pinned notes keep your learning loop tight.",
                },
                {
                  title: "Session-first workflow",
                  text: "Organize by role, experience, and topic for faster prep.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-4 ${cardSoft}`}
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className={`mt-2 text-sm ${subtleText}`}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Plan the session",
              text: "Pick role, experience, and topics. Keep it focused.",
            },
            {
              title: "Generate questions",
              text: "AI builds concise questions aligned to your level.",
            },
            {
              title: "Explain and pin",
              text: "Summaries plus pinned notes to reinforce memory.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`rounded-3xl border p-6 shadow-lg ${cardClass}`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className={`mt-2 text-sm ${subtleText}`}>{item.text}</p>
            </div>
          ))}
        </section>

        <section
          id="ready"
          className={`mt-16 rounded-3xl border p-8 text-center ${
            isLight
              ? "border-emerald-200 bg-gradient-to-r from-emerald-200/60 via-cyan-100/60 to-blue-100/60"
              : "border-emerald-400/30 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-blue-500/20"
          }`}
        >
          <h2 className="text-2xl font-semibold text-white">
            Ready to prep like a pro?
          </h2>
          <p className={`mt-3 text-sm ${mutedText}`}>
            Build focused interview momentum with clear, precise practice.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Go to dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Get started
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className={`rounded-xl border px-6 py-3 text-sm font-semibold transition ${
                    pillClass
                  }`}
                >
                  Create account
                </button>
              </>
            )}
          </div>
        </section>

        <footer className={`mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs ${subtleText} ${
          isLight ? "border-slate-200" : "border-slate-800"
        }`}>
          <span>Built for focused interview prep.</span>
          <span>(c) {new Date().getFullYear()} Acedit.ai</span>
        </footer>
      </div>

    </div>
  );
};

export default LandingPage;
