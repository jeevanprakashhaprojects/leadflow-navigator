import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Review } from "@/components/lead-form/review";
import {
  StepAddress,
  StepCompany,
  StepContact,
  StepPipeline,
  StepRelations,
  StepSocial,
} from "@/components/lead-form/steps";
import { emptyForm, STEPS, type FormErrors, type Interest, type LeadForm, type Relation } from "@/components/lead-form/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Add Lead — Insurance CRM Wizard" },
      {
        name: "description",
        content:
          "A mobile-first Add Lead wizard for insurance agents: stepped contact, company, pipeline, address, notes and review screens with validation and draft autosave.",
      },
      { property: "og:title", content: "Add Lead — Insurance CRM Wizard" },
      {
        property: "og:description",
        content: "Stepped Add Lead form for field agents with grouped cards, chips, sliders and a review summary.",
      },
    ],
  }),
  component: AddLead,
});

function validate(form: LeadForm, step: number): FormErrors {
  const e: FormErrors = {};
  if (step === 0) {
    if (!form.firstName.trim()) e["firstName"] = "First name is required";
    if (!form.lastName.trim()) e["lastName"] = "Last name is required";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) e["phone"] = "Mobile number is required";
    else if (digits.length !== 10) e["phone"] = "Enter a valid 10-digit number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e["email"] = "Enter a valid email";
  }
  if (step === 2) {
    if (!form.leadStatus) e["leadStatus"] = "Select a lead status";
    if (!form.leadPriority) e["leadPriority"] = "Select a priority";
    if (!form.leadSource) e["leadSource"] = "Select a source";
    if (!form.actionType) e["actionType"] = "Pick what happens next";
    if (form.actionType === "Follow-up") {
      if (!form.followUpType) e["followUpType"] = "Required";
      if (!form.followUpDate) e["followUpDate"] = "Required";
    }
    if (form.actionType === "Appointment" && !form.appointmentDate) e["appointmentDate"] = "Required";
  }
  return e;
}

const uid = () => Math.random().toString(36).slice(2, 9);

function AddLead() {
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [done, setDone] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const set = <K extends keyof LeadForm>(k: K, v: LeadForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // debounced draft autosave
  useEffect(() => {
    if (form === emptyForm) return;
    const t = setTimeout(() => {
      setSaved(true);
      const h = setTimeout(() => setSaved(false), 2200);
      return () => clearTimeout(h);
    }, 900);
    return () => clearTimeout(t);
  }, [form]);

  // live re-validation once the user has tried to advance
  useEffect(() => {
    if (touched) setErrors(validate(form, step));
  }, [form, step, touched]);

  const stepErrors = useMemo(() => validate(form, step), [form, step]);
  const canAdvance = Object.keys(stepErrors).length === 0;
  const isReview = step === STEPS.length - 1;

  const goTo = (i: number) => {
    setStep(i);
    setTouched(false);
    setErrors({});
    scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (!canAdvance) {
      setTouched(true);
      setErrors(stepErrors);
      return;
    }
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const relationOps = {
    addRelation: () =>
      setForm((f) => ({ ...f, relations: [...f.relations, { id: uid(), name: "", relation: "", age: "" }] })),
    removeRelation: (id: string) => setForm((f) => ({ ...f, relations: f.relations.filter((r) => r.id !== id) })),
    updateRelation: (id: string, patch: Partial<Relation>) =>
      setForm((f) => ({ ...f, relations: f.relations.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
    addInterest: () =>
      setForm((f) => ({ ...f, interests: [...f.interests, { id: uid(), product: "", cover: "", note: "" }] })),
    removeInterest: (id: string) => setForm((f) => ({ ...f, interests: f.interests.filter((i) => i.id !== id) })),
    updateInterest: (id: string, patch: Partial<Interest>) =>
      setForm((f) => ({ ...f, interests: f.interests.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
  };

  const current = STEPS[step]!;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {/* header + stepper */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            type="button"
            onClick={() => goTo(Math.max(step - 1, 0))}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground"
            aria-label="Back"
          >
            ‹
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-bold leading-tight">Add lead</h1>
            <p className="truncate text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length} · {current.mins}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-opacity ${
              saved ? "bg-success/12 text-success opacity-100" : "opacity-0"
            }`}
          >
            Draft saved
          </span>
        </div>

        <div className="mt-3 h-1 w-full bg-border">
          <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex gap-1 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => {
            const state = i === step ? "active" : i < step ? "done" : "todo";
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(i)}
                className="flex shrink-0 items-center gap-1.5 pr-2"
              >
                <span
                  className={`grid size-7 place-items-center rounded-full text-[11px] font-bold ${
                    state === "active"
                      ? "bg-primary text-primary-foreground"
                      : state === "done"
                        ? "bg-success text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  {state === "done" ? "✓" : i + 1}
                </span>
                <span
                  className={`text-xs ${
                    state === "active" ? "font-semibold text-primary" : "font-medium text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* body */}
      <div ref={scroller} className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
        <div key={step} className="animate-step-in">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight">{current.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{current.subtitle}</p>
          </div>

          {step === 0 && <StepContact form={form} set={set} errors={errors} />}
          {step === 1 && <StepCompany form={form} set={set} errors={errors} />}
          {step === 2 && <StepPipeline form={form} set={set} errors={errors} />}
          {step === 3 && <StepAddress form={form} set={set} errors={errors} />}
          {step === 4 && <StepSocial form={form} set={set} errors={errors} />}
          {step === 5 && <StepRelations form={form} {...relationOps} />}
          {isReview && <Review form={form} goTo={goTo} />}
        </div>
      </div>

      {/* footer */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        {done ? (
          <p className="rounded-xl bg-success/12 px-4 py-3 text-center text-sm font-semibold text-success">
            Lead saved
          </p>
        ) : isReview ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                goTo(0);
              }}
              className="h-12 flex-1 rounded-xl border border-border text-sm font-semibold"
            >
              Save & add another
            </button>
            <button
              type="button"
              onClick={() => setDone(true)}
              className="h-12 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            >
              Save lead
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => goTo(step - 1)}
              className="h-12 rounded-xl border border-border px-5 text-sm font-semibold text-muted-foreground disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              className={`h-12 flex-1 rounded-xl text-sm font-semibold transition-opacity ${
                canAdvance ? "bg-primary text-primary-foreground" : "bg-primary/40 text-primary-foreground"
              }`}
            >
              Continue to {STEPS[step + 1]?.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
