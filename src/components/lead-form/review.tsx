import type { LeadForm } from "./types";

function Row({ children }: { children: string }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function Block({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold">{title}</h3>
        <span className="text-xs font-medium text-primary">Edit</span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </button>
  );
}

const inr = (v: string) => (v ? `₹${new Intl.NumberFormat("en-IN").format(Number(v))}` : "—");

export function Review({ form, goTo }: { form: LeadForm; goTo: (i: number) => void }) {
  const name = [form.salutation, form.firstName, form.lastName].filter(Boolean).join(" ") || "Unnamed lead";
  const address = [form.streetAddress, form.city, form.state, form.pincode].filter(Boolean).join(", ");
  return (
    <div className="space-y-3">
      <Block title="Contact" onEdit={() => goTo(0)}>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <Row>{`${form.phoneCountry} ${form.phone || "—"}`}</Row>
        <Row>{form.email || "No email"}</Row>
        <Row>{[form.dob, form.occupation].filter(Boolean).join(" · ") || "No personal details"}</Row>
      </Block>

      <Block title="Company" onEdit={() => goTo(1)}>
        <Row>{form.companyName || "No company"}</Row>
        <Row>{[form.jobTitle, form.department].filter(Boolean).join(", ") || "No role"}</Row>
        <Row>{[form.industry, form.companySize && `${form.companySize} employees`].filter(Boolean).join(" · ") || "—"}</Row>
      </Block>

      <Block title="Pipeline" onEdit={() => goTo(2)}>
        <Row>{`Status: ${form.leadStatus || "—"} · ${form.leadPriority || "no priority"}`}</Row>
        <Row>{`Value: ${inr(form.expectedDealValue)} · ${form.conversionProbability}% probability`}</Row>
        <Row>{form.actionType ? `Next: ${form.actionType}` : "No next action set"}</Row>
        <Row>{form.tags.length ? `Tags: ${form.tags.join(", ")}` : "No tags"}</Row>
      </Block>

      <Block title="Address" onEdit={() => goTo(3)}>
        <Row>{address || "No address"}</Row>
      </Block>

      <Block title="Notes & family" onEdit={() => goTo(4)}>
        <Row>{`${form.relations.length} relations · ${form.interests.length} interests`}</Row>
        <Row>{form.notes ? `Notes: ${form.notes.slice(0, 90)}` : "No notes"}</Row>
      </Block>
    </div>
  );
}
