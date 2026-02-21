import React, { useState } from "react";

const BIOTECH_TOPICS = [
  "Molecular Biology",
  "Genetics & Genomics",
  "Cell Biology",
  "Immunology",
  "Microbiology",
  "Bioprocess Engineering",
  "Bioinformatics",
  "Genetic Engineering & CRISPR",
  "Proteomics",
  "Drug Discovery & Pharmacology",
  "Industrial Biotechnology",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const GOALS = [
  "Semester Exams",
  "Entrance Exams / Competitive Exams",
  "Research / Projects",
  "Skill Building & Internships",
];

function buildPath(topic, level, goal) {
  if (!topic || !level || !goal) return [];

  const base = [
    {
      title: `1. Foundations in ${topic}`,
      duration: "3–5 days",
      focus: [
        "Key definitions and fundamental concepts",
        "Essential biological molecules and pathways related to the topic",
        "High‑yield diagrams, charts, and concept maps",
      ],
      type: "Conceptual",
    },
    {
      title: `2. Core Concepts & Mechanisms`,
      duration: "5–7 days",
      focus: [
        "Step‑wise mechanisms (with flowcharts)",
        "Important enzymes, genes, and regulatory checkpoints",
        "Typical exam / viva questions on this module",
      ],
      type: "Core",
    },
    {
      title: `3. Lab Skills & Experimental Design`,
      duration: "4–6 days",
      focus: [
        "Relevant wet‑lab techniques (e.g., PCR, electrophoresis, cloning, culture)",
        "Common troubleshooting points and sources of error",
        "How to write observation, results, and inference in records",
      ],
      type: "Practical",
    },
    {
      title: `4. Application & Case Studies`,
      duration: "3–4 days",
      focus: [
        "Real‑world applications of the topic (clinical, industrial or research)",
        "Short case studies and previous year questions",
        "Mini‑project ideas you can actually implement",
      ],
      type: "Application",
    },
    {
      title: `5. Revision & Self‑Assessment`,
      duration: "2–3 days",
      focus: [
        "Timed quizzes and flash‑card style revision",
        "Summarising each subtopic in one page",
        "Creating your own question bank from weak areas",
      ],
      type: "Revision",
    },
  ];

  if (level === "Beginner") {
    base[0].duration = "4–6 days";
    base[1].duration = "6–8 days";
  } else if (level === "Advanced") {
    base[0].duration = "2–3 days";
    base[1].duration = "4–5 days";
  }

  if (goal === "Research / Projects") {
    base.push({
      title: "6. Research Extension",
      duration: "5–10 days",
      focus: [
        `Identify 2–3 recent papers in ${topic} and summarise them`,
        "Define a small project / review topic with clear objectives",
        "Prepare a basic presentation or poster from your findings",
      ],
      type: "Research",
    });
  } else if (goal === "Skill Building & Internships") {
    base.push({
      title: "6. Skill Portfolio Building",
      duration: "5–7 days",
      focus: [
        "Document all lab techniques you have learnt in this path",
        "Create a simple CV section focused on this topic",
        "Draft emails to approach labs / companies for internships",
      ],
      type: "Career",
    });
  }

  return base;
}

const PersonalizedPath = () => {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("3–5");
  const [path, setPath] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    const finalTopic = topic === "Other" ? customTopic.trim() : topic;

    if (!finalTopic || !level || !goal) return;

    const generated = buildPath(finalTopic, level, goal);
    setPath(generated);
    setSubmitted(true);
  };

  const handleReset = () => {
    setTopic("");
    setCustomTopic("");
    setLevel("");
    setGoal("");
    setHoursPerWeek("3–5");
    setPath([]);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-10">
      {/* header banner */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950/90 via-sky-900/50 to-slate-900/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            Personalized Learning Path
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Design a learning route tailored to your{" "}
            <span className="font-semibold text-sky-300">
              biotechnology
            </span>{" "}
            interests, current level, and weekly study time.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* left: form */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/70 p-5 md:p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
            <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
            Input your preferences
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* topic */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-100">
                Preferred biotechnology topic
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              >
                <option value="">Select a topic</option>
                {BIOTECH_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="Other">Other (type manually)</option>
              </select>

              {topic === "Other" && (
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your specific biotechnology topic"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              )}
              <p className="text-xs text-slate-400">
                Examples: Genomics, CRISPR, Cancer biology, Stem cell technology, Fermentation technology.
              </p>
            </div>

            {/* level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-100">
                Current understanding level
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      level === lvl
                        ? "bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/40"
                        : "bg-slate-950/60 text-slate-200 border-slate-700 hover:border-sky-500 hover:text-sky-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* goal */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-100">
                Primary goal
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`text-left px-3 py-2 rounded-xl text-xs border transition ${
                      goal === g
                        ? "bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/40"
                        : "bg-slate-950/70 text-slate-200 border-slate-700 hover:border-sky-500 hover:text-sky-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* hours per week */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-100">
                Approximate study time per week
              </label>
              <select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="1–2">1–2 hours</option>
                <option value="3–5">3–5 hours</option>
                <option value="6–8">6–8 hours</option>
                <option value="9+">9+ hours</option>
              </select>
              <p className="text-xs text-slate-400">
                The suggested duration for each step assumes about {hoursPerWeek} hours per week.
              </p>
            </div>

            {/* buttons */}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-full text-xs font-medium border border-slate-700 text-slate-300 bg-slate-950/70 hover:bg-slate-900 hover:text-slate-100 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-sky-500/40 hover:shadow-sky-500/60 hover:translate-y-[-1px] transition"
              >
                Generate learning path
              </button>
            </div>
          </form>
        </section>

        {/* right: generated path */}
        <section className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl shadow-slate-950/70">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" />
              Suggested path
            </h2>

            {!submitted && (
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  Start by selecting your{" "}
                  <span className="font-semibold text-sky-300">
                    topic, level, and goal
                  </span>{" "}
                  on the left.
                </p>
                <p>
                  You will get a step‑by‑step learning path tailored for{" "}
                  biotechnology students, including concepts, lab skills, and
                  revision.
                </p>
              </div>
            )}

            {submitted && path.length === 0 && (
              <p className="text-sm text-rose-300">
                Please fill all the required fields to generate a learning path.
              </p>
            )}

            {path.length > 0 && (
              <div className="space-y-3 mt-1">
                <div className="text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-2 bg-slate-950/70 flex flex-wrap gap-2 justify-between">
                  <span>
                    Topic:{" "}
                    <span className="font-semibold text-sky-300">
                      {topic === "Other" ? customTopic || "Custom topic" : topic}
                    </span>
                  </span>
                  <span>
                    Level:{" "}
                    <span className="font-semibold text-emerald-300">
                      {level}
                    </span>
                  </span>
                  <span>
                    Goal:{" "}
                    <span className="font-semibold text-indigo-300">
                      {goal}
                    </span>
                  </span>
                </div>

                <ol className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scroll">
                  {path.map((step, index) => (
                    <li
                      key={step.title}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-50 text-[0.8rem]">
                          {step.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[0.65rem] bg-sky-500/10 border border-sky-500/40 text-sky-300">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-[0.7rem] text-slate-400 uppercase tracking-[0.25em]">
                        {step.type} • Phase {index + 1}
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 mt-1">
                        {step.focus.map((f) => (
                          <li key={f} className="text-[0.75rem] text-slate-200">
                            {f}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="text-[0.7rem] text-slate-400 bg-slate-900/80 border border-dashed border-slate-700 rounded-2xl p-4">
            Tip: Use this plan along with your{" "}
            <span className="text-sky-300 font-medium">
              existing dashboard, quizzes, and feedback form
            </span>{" "}
            to track how your understanding in biotechnology improves week by week.
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonalizedPath;
