import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { clearAuth } from "../utils/authStorage";
import Toast from "../components/Toast";

const emptyForm = {
  role: "",
  experience: "",
  topicsToFocus: "",
  description: "",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce(
      (sum, session) => sum + (session?.questions?.length || 0),
      0,
    );
    const pinnedQuestions = sessions.reduce(
      (sum, session) =>
        sum +
        (session?.questions?.filter((q) => q?.isPinned)?.length || 0),
      0,
    );
    return { totalSessions, totalQuestions, pinnedQuestions };
  }, [sessions]);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const loadSessions = async () => {
    setError("");
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response?.data?.sessions || []);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load sessions.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSession = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.role || !form.experience) {
      setError("Role and experience are required.");
      return;
    }

    try {
      setIsCreating(true);
      const payload = {
        role: form.role.trim(),
        experience: form.experience.trim(),
        topicsToFocus: form.topicsToFocus,
        description: form.description.trim(),
      };
      const response = await axiosInstance.post(
        API_PATHS.SESSION.CREATE,
        payload,
      );
      const createdSession = response?.data?.session;

      if (createdSession && autoGenerate) {
        await axiosInstance.post(
          API_PATHS.AI.GENERATE_QUESTIONS,
          { sessionId: createdSession._id },
          { timeout: 60000 },
        );
        showToast("Questions generated.");
      }

      showToast("Session created successfully.");
      setForm(emptyForm);
      await loadSessions();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create session.";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateQuestions = async (sessionId) => {
    setError("");
    try {
      setIsCreating(true);
      await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        { sessionId },
        { timeout: 60000 },
      );
      showToast("Questions regenerated.");
      await loadSessions();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate questions.";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const shouldDelete = window.confirm(
      "Delete this session and all questions?",
    );
    if (!shouldDelete) return;

    setError("");
    try {
      setIsCreating(true);
      await axiosInstance.delete(`${API_PATHS.SESSION.DELETE}/${sessionId}`);
      showToast("Session deleted.");
      await loadSessions();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete session.";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Toast
        message={toast?.message}
        tone={toast?.tone}
        onClose={() => setToast(null)}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/50">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                Interview Hub
              </div>
              <h1 className="text-3xl font-bold text-white">
                Welcome{user?.name ? `, ${user.name}` : ""}.
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Plan sessions, generate AI questions, and track your prep
                progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => loadSessions()}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full border border-rose-500/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total Sessions", value: stats.totalSessions },
              { label: "Total Questions", value: stats.totalQuestions },
              { label: "Pinned Notes", value: stats.pinnedQuestions },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40">
            <h2 className="text-xl font-semibold text-white">
              Create a new session
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Describe the role and experience level. We will generate curated
              questions for you.
            </p>

            <form
              className="mt-6 grid gap-4"
              onSubmit={handleCreateSession}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="role">
                    Role
                  </label>
                  <input
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="MERN full stack"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm text-slate-300"
                    htmlFor="experience"
                  >
                    Experience (years)
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="2"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm text-slate-300"
                  htmlFor="topicsToFocus"
                >
                  Topics to focus (comma separated)
                </label>
                <input
                  id="topicsToFocus"
                  name="topicsToFocus"
                  value={form.topicsToFocus}
                  onChange={handleChange}
                  placeholder="React, Node, System design"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm text-slate-300"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Anything specific you want to highlight..."
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(event) => setAutoGenerate(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-400 focus:ring-emerald-400"
                />
                Auto-generate questions with Gemini
              </label>

              {error ? (
                <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isCreating}
                className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? "Working..." : "Create session"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your sessions</h2>
              <span className="text-xs text-slate-500">
                {isLoading ? "Loading..." : `${sessions.length} total`}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {isLoading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-400">
                  Fetching sessions...
                </div>
              ) : sessions.length ? (
                sessions.map((session) => (
                  <div
                    key={session._id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">
                          {session.role}
                        </p>
                        <p className="text-xs text-slate-400">
                          {session.experience} years •{" "}
                          {(session.topicsToFocus || []).join(", ") ||
                            "General topics"}
                        </p>
                      </div>
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                        {session.questions?.length || 0} Q
                      </span>
                    </div>

                    {session.description ? (
                      <p className="mt-2 text-sm text-slate-400">
                        {session.description}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/interview/${session._id}`)}
                        className="rounded-full border border-emerald-400/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleGenerateQuestions(session._id)}
                        className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
                      >
                        Regenerate Q
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="rounded-full border border-rose-500/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-400">
                  No sessions yet. Create your first one to begin.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
