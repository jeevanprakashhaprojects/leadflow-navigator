import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  badge?: ReactNode | undefined;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <header className="flex items-center gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h2 className="text-[14px] font-semibold leading-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {badge && <div className="ml-auto">{badge}</div>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Grid({ cols = 2, children }: { cols?: 1 | 2 | 3 | undefined; children: ReactNode }) {
  const cls = cols === 3 ? "sm:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : "";
  return <div className={`grid grid-cols-1 gap-4 ${cls}`}>{children}</div>;
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  type = "text",
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  required?: boolean | undefined;
  error?: string | undefined;
  type?: string | undefined;
  mono?: boolean | undefined;
}) {
  return (
    <div>
      <label className="label-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`field ${mono ? "font-mono tracking-wider" : ""} ${
          error ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/15" : ""
        }`}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  rows?: number | undefined;
  hint?: string | undefined;
}) {
  return (
    <div>
      <label className="label-xs">{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field h-auto resize-y py-3 leading-relaxed"
      />
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  required,
  error,
  placeholder = "Select",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean | undefined;
  error?: string | undefined;
  placeholder?: string | undefined;
}) {
  return (
    <div>
      <label className="label-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`field appearance-none pr-9 ${value ? "" : "text-muted-foreground"} ${
            error ? "border-destructive bg-destructive/5" : ""
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ▾
        </span>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function DateField({
  label,
  value,
  onChange,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean | undefined;
  error?: string | undefined;
}) {
  return (
    <div>
      <label className="label-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`field ${error ? "border-destructive bg-destructive/5" : ""}`}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-xs">{label}</label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}

export function Phone({
  label,
  value,
  onChange,
  code,
  onCodeChange,
  required,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  code: string;
  onCodeChange?: ((v: string) => void) | undefined;
  required?: boolean | undefined;
  error?: string | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <div>
      <label className="label-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div
        className={`flex h-11 overflow-hidden rounded-xl border bg-card ${
          error ? "border-destructive bg-destructive/5" : "border-border"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <select
          value={code}
          disabled={disabled || !onCodeChange}
          onChange={(e) => onCodeChange?.(e.target.value)}
          className="border-r border-border bg-secondary/60 px-2.5 font-mono text-sm text-muted-foreground outline-none"
        >
          {["+91", "+1", "+44", "+61", "+971"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          value={value}
          disabled={disabled}
          inputMode="numeric"
          placeholder="98765 43210"
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3.5 text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string | undefined;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3.5 py-3 text-left transition-colors hover:bg-secondary"
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-card shadow transition-transform ${
            checked ? "translate-x-4.5" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </button>
  );
}

export function Chips({
  label,
  options,
  selected,
  onToggle,
  single,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  single?: boolean | undefined;
}) {
  return (
    <div>
      <label className="label-xs">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={`h-9 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              } ${single ? "" : ""}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Slider({
  label,
  value,
  onChange,
  suffix = "%",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string | undefined;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="label-xs mb-0">{label}</label>
        <span className="font-mono text-sm font-semibold text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
      />
    </div>
  );
}

export function Money({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const digits = value.replace(/\D/g, "");
  const pretty = digits ? new Intl.NumberFormat("en-IN").format(Number(digits)) : "";
  return (
    <div>
      <label className="label-xs">{label}</label>
      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-border bg-card">
        <span className="border-r border-border bg-secondary/60 px-3.5 text-sm font-medium text-muted-foreground">
          ₹
        </span>
        <input
          value={pretty}
          inputMode="numeric"
          placeholder="5,00,000"
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          className="h-full flex-1 bg-transparent px-3.5 text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
