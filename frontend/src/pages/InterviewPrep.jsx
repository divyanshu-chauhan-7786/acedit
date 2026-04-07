
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import Toast from "../components/Toast";

const InterviewPrep = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [explanations, setExplanations] = useState({});
  const [explaining, setExplaining] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const questions = useMemo(
    () => session?.questions || [],
    [session?.questions],
  );

  const pinnedQuestions = useMemo(
    () => questions.filter((q) => q?.isPinned),
    [questions],
  );

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const loadSession = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.SESSION.GET_ONE}/${id}`,
      );
      setSession(response?.data?.session || null);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load session.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Missing session id.");
      setIsLoading(false);
      return;
    }
    loadSession();
  }, [id]);

  const handleGenerateQuestions = async () => {
    if (!id) return;
    setError("");
    try {
      setIsGenerating(true);
      await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        { sessionId: id },
        { timeout: 60000 },
      );
      await loadSession();
      showToast("Questions regenerated.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate questions.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplain = async (question) => {
    if (!question?.question) return;
    const key = question._id || question.id || question.question;
    setError("");
    try {
      setExplaining((prev) => ({ ...prev, [key]: true }));
      const response = await axiosInstance.post(
        API_PATHS.AI.EXPLAIN,
        { question: question.question },
        { timeout: 60000 },
      );
      const explanation = response?.data?.data;
      if (explanation) {
        setExplanations((prev) => ({ ...prev, [key]: explanation }));
        showToast("Explanation generated.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate explanation.";
      setError(message);
    } finally {
      setExplaining((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleTogglePin = async (question) => {
    const key = question?._id || question?.id;
    if (!key) return;
    setError("");
    try {
      const response = await axiosInstance.patch(
        `${API_PATHS.QUESTION.PIN}/${key}/pin`,
        { isPinned: !question.isPinned },
      );
      const updated = response?.data?.question;
      if (updated) {
        setSession((prev) => {
          if (!prev) return prev;
          const updatedQuestions = (prev.questions || []).map((q) =>
            q._id === updated._id ? updated : q,
          );
          return { ...prev, questions: updatedQuestions };
        });
      }
      showToast(question.isPinned ? "Unpinned." : "Pinned.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update pin.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Toast
        message={toast?.message}
        tone={toast?.tone}
        onClose={() => setToast(null)}
      />
      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                Interview Prep
              </div>
              <h1 className="text-3xl font-bold text-white">
                {session?.role || "Session"}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Practice questions, review answers, and build confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
              >
                Back to dashboard
              </button>
              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="rounded-full border border-emerald-400/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Generating..." : "Generate questions"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Experience
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {session?.experience ? `${session.experience} yrs` : "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Topics
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {(session?.topicsToFocus || []).join(", ") || "General topics"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Questions
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {questions.length}
              </p>
            </div>
          </div>

          {session?.description ? (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
              {session.description}
            </div>
          ) : null}
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <section className="space-y-4">
          {pinnedQuestions.length ? (
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                Pinned Notes
              </p>
              <div className="mt-4 grid gap-3">
                {pinnedQuestions.map((q, index) => (
                  <div
                    key={q._id || `${index}-pinned`}
                    className="rounded-2xl border border-emerald-400/20 bg-slate-950/50 p-4 text-sm text-emerald-100"
                  >
                    {q.question}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse"
                >
                  <div className="h-4 w-24 rounded bg-slate-800" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-slate-800" />
                  <div className="mt-2 h-3 w-full rounded bg-slate-800" />
                </div>
              ))}
            </div>
          ) : questions.length ? (
            questions.map((q, index) => {
              const key = q._id || q.id || `${index}`;
              const explanation = explanations[key];
              return (
                <div
                  key={key}
                  className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
                        Question {index + 1}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {q.question}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleExplain(q)}
                        disabled={explaining[key]}
                        className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {explaining[key] ? "Explaining..." : "Explain"}
                      </button>
                      <button
                        onClick={() => handleTogglePin(q)}
                        className="rounded-full border border-emerald-400/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
                      >
                        {q.isPinned ? "Unpin" : "Pin"}
                      </button>
                    </div>
                  </div>

                  {q.answer ? (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300 whitespace-pre-wrap">
                      {q.answer}
                    </div>
                  ) : null}

                  {explanation ? (
                    <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100 whitespace-pre-wrap">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                        {explanation.title || "Explanation"}
                      </p>
                      <div className="mt-2">{explanation.explanation}</div>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
              <p className="text-lg font-semibold text-white">
                No questions yet
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Generate AI questions for this session to get started.
              </p>
              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="mt-4 rounded-full border border-emerald-400/60 px-5 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Generating..." : "Generate questions"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default InterviewPrep;

