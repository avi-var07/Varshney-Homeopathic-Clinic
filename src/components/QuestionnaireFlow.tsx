"use client";

import { useState } from "react";
import { FiCheck, FiX, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import {
  ORGAN_CATEGORIES,
  type OrganCategory,
  type Symptom,
  type ComplaintAnswers,
  type PatientComplaint,
} from "@/lib/questionnaire";

interface Props {
  appointmentId?: string;       // if provided, POSTs to API (modal mode)
  mode?: "modal" | "inline";    // inline = embedded in booking flow
  onComplete: (complaints?: PatientComplaint[]) => void;
  onClose?: () => void;
}

type Stage = "organ" | "symptom" | "questions" | "done";

export default function QuestionnaireFlow({ appointmentId, mode = "modal", onComplete, onClose }: Props) {
  const [stage, setStage] = useState<Stage>("organ");
  const [selectedOrgan, setSelectedOrgan] = useState<OrganCategory | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ComplaintAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedComplaints, setSavedComplaints] = useState<PatientComplaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentQuestion = selectedSymptom?.followUp[questionIndex];
  const totalQuestions = selectedSymptom?.followUp.length ?? 0;
  const progress = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;

  const isInline = mode === "inline";

  const reset = (keepOrgan = false) => {
    setSelectedSymptom(null);
    setQuestionIndex(0);
    setAnswers({});
    setSearchQuery("");
    if (!keepOrgan) {
      setSelectedOrgan(null);
      setStage("organ");
    } else {
      setStage("symptom");
    }
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      // All questions answered — save this complaint
      saveComplaint(newAnswers);
    }
  };

  const saveComplaint = async (finalAnswers: ComplaintAnswers) => {
    if (!selectedOrgan || !selectedSymptom) return;

    const complaint: PatientComplaint = {
      organ: selectedOrgan.label,
      symptom: selectedSymptom.label,
      answers: finalAnswers,
      submittedAt: new Date().toISOString(),
    };

    // In inline mode, just store locally — parent handles submission
    if (isInline) {
      setSavedComplaints((prev) => [...prev, complaint]);
      setStage("done");
      return;
    }

    // Modal mode — POST to API
    if (!appointmentId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/patient/appointments/${appointmentId}/questionnaire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organ: selectedOrgan.label,
          symptom: selectedSymptom.label,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSavedComplaints((prev) => [...prev, complaint]);
      setStage("done");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (isInline) {
      onComplete(savedComplaints);
    } else {
      onComplete();
    }
  };

  // Filter organs by search
  const filteredOrgans = searchQuery.trim()
    ? ORGAN_CATEGORIES.filter(
        (o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.symptoms.some((s) =>
            s.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : ORGAN_CATEGORIES;

  const content = (
    <>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b border-green-100 ${isInline ? "bg-green-50/50 rounded-t-3xl" : "bg-green-50"} flex-shrink-0`}>
        <div>
          <p className="font-bold text-green-900">
            {isInline ? "🩺 Tell us about your health concern" : "Health Questionnaire"}
          </p>
          <p className="text-green-500 text-xs mt-0.5">
            {stage === "organ" && "Step 1 — Choose the affected area"}
            {stage === "symptom" && `Step 2 — ${selectedOrgan?.label}`}
            {stage === "questions" && `${selectedSymptom?.label} — Question ${questionIndex + 1} of ${totalQuestions}`}
            {stage === "done" && `${savedComplaints.length} complaint${savedComplaints.length !== 1 ? "s" : ""} saved ✓`}
          </p>
        </div>
        {!isInline && onClose && (
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-400 hover:text-gray-600">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={`overflow-y-auto flex-1 p-5 ${isInline ? "max-h-[65vh]" : ""}`}>

        {/* ── STAGE: Choose Organ ───────────────────────────────────────── */}
        {stage === "organ" && (
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-1">Which part of your body is affected?</h3>
            <p className="text-green-500 text-sm mb-4">Select the area that best matches your problem.</p>
            
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search... e.g. headache, skin, stomach"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field text-sm pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">🔍</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {filteredOrgans.map((organ) => (
                <button
                  key={organ.id}
                  onClick={() => { setSelectedOrgan(organ); setStage("symptom"); setSearchQuery(""); }}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 border-green-100 bg-white hover:border-green-400 hover:bg-green-50 transition-all text-left group"
                >
                  <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">{organ.icon}</span>
                  <span className="text-sm font-semibold text-green-800 leading-tight">{organ.label}</span>
                </button>
              ))}
            </div>

            {filteredOrgans.length === 0 && (
              <div className="text-center py-8">
                <p className="text-green-400 text-sm">No matching categories found.</p>
                <button onClick={() => setSearchQuery("")} className="text-green-600 text-sm font-medium mt-2 hover:underline">
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STAGE: Choose Symptom ─────────────────────────────────────── */}
        {stage === "symptom" && selectedOrgan && (
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-1">
              {selectedOrgan.icon} {selectedOrgan.label}
            </h3>
            <p className="text-green-500 text-sm mb-5">What is your main complaint?</p>
            <div className="space-y-2.5">
              {selectedOrgan.symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => { setSelectedSymptom(symptom); setQuestionIndex(0); setAnswers({}); setStage("questions"); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-green-100 bg-white hover:border-green-400 hover:bg-green-50 transition-all text-left"
                >
                  <span className="font-semibold text-green-800">{symptom.label}</span>
                  <FiChevronRight className="w-5 h-5 text-green-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STAGE: Questions (one at a time) ─────────────────────────── */}
        {stage === "questions" && currentQuestion && selectedSymptom && (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold text-green-700">{selectedSymptom.label}</span>
                <span>{questionIndex + 1} / {totalQuestions}</span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2.5">
                <div className="bg-green-gradient h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-green-900 mb-6 leading-snug">
              {currentQuestion.text}
            </h3>

            {/* Yes / No */}
            {currentQuestion.type === "yesno" && (
              <div className="grid grid-cols-2 gap-3">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={submitting}
                    className={`py-5 rounded-2xl border-2 text-lg font-bold transition-all ${
                      opt === "Yes"
                        ? "border-green-200 bg-green-50 text-green-700 hover:border-green-500 hover:bg-green-100"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {opt === "Yes" ? "✅ Yes" : "❌ No"}
                  </button>
                ))}
              </div>
            )}

            {/* Multiple choice */}
            {currentQuestion.type === "choice" && currentQuestion.options && (
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={submitting}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-green-100 bg-white text-left font-medium text-green-800 hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <span className="w-5 h-5 rounded-full border-2 border-green-300 flex-shrink-0" />
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Text */}
            {currentQuestion.type === "text" && (
              <div>
                <textarea
                  rows={3}
                  placeholder="Type your answer here..."
                  className="input-field resize-none text-base mb-3"
                  id="text-answer"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById("text-answer") as HTMLTextAreaElement;
                    handleAnswer(el.value || "—");
                  }}
                  disabled={submitting}
                  className="btn-primary w-full justify-center"
                >
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Next →"}
                </button>
              </div>
            )}

            {/* Skip option for non-last questions */}
            {questionIndex < totalQuestions - 1 && (
              <button
                onClick={() => handleAnswer("Not sure / Skip")}
                className="w-full text-center text-green-400 text-sm mt-4 hover:text-green-600"
              >
                Skip this question →
              </button>
            )}
          </div>
        )}

        {/* ── STAGE: Done ───────────────────────────────────────────────── */}
        {stage === "done" && (
          <div className="text-center py-4">
            <div className="text-6xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-green-900 mb-1">Complaint Saved!</h3>
            {savedComplaints.length > 0 && (
              <div className="text-left bg-green-50 rounded-2xl p-4 border border-green-100 mb-5 mt-3">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Your complaints ({savedComplaints.length}):</p>
                {savedComplaints.map((c, i) => {
                  const organ = ORGAN_CATEGORIES.find(o => o.label === c.organ);
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm text-green-800 font-medium py-1">
                      <span>{organ?.icon || "•"}</span>
                      <span>{c.organ} → {c.symptom}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-green-600 text-sm mb-5">Do you have any other complaints to add?</p>
            <div className="flex gap-3">
              <button
                onClick={() => reset(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-green-200 text-green-700 font-bold hover:bg-green-50 transition-colors"
              >
                + Add Another
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-2xl bg-green-gradient text-white font-bold shadow-soft"
              >
                {isInline ? "Continue →" : "Done ✓"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Back button footer — shown during organ/symptom/question stages */}
      {(stage === "symptom" || (stage === "questions" && questionIndex > 0)) && (
        <div className="px-5 py-4 border-t border-green-100 flex-shrink-0">
          <button
            onClick={() => {
              if (stage === "symptom") { setStage("organ"); setSelectedOrgan(null); }
              else if (stage === "questions" && questionIndex > 0) { setQuestionIndex((i) => i - 1); }
            }}
            className="flex items-center gap-2 text-green-600 text-sm font-medium hover:text-green-800"
          >
            <FiChevronLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      )}
    </>
  );

  // Inline mode — render directly without overlay
  if (isInline) {
    return (
      <div className="bg-white rounded-3xl shadow-card border border-green-100 overflow-hidden flex flex-col">
        {content}
      </div>
    );
  }

  // Modal mode — render with overlay
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {content}
      </div>
    </div>
  );
}
