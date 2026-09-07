import { Area, Card, Chips, DateField, Grid, Money, Phone, Select, Slider, Switch, Text, TimeField } from "./fields";
import type { Interest, LeadForm, Relation } from "./types";

type P = {
  form: LeadForm;
  set: <K extends keyof LeadForm>(k: K, v: LeadForm[K]) => void;
  errors: Record<string, string>;
};

export function StepContact({ form, set, errors }: P) {
  return (
    <div className="space-y-3">
      <Card title="Primary identity" subtitle="Who you're reaching out to">
        <div className="space-y-4">
          <Select
            label="Salutation"
            value={form.salutation}
            onChange={(v) => set("salutation", v)}
            options={["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]}
          />
          <Text label="First name" required value={form.firstName} onChange={(v) => set("firstName", v)} error={errors["firstName"]} placeholder="Jeevan" />
          <Text label="Last name" required value={form.lastName} onChange={(v) => set("lastName", v)} error={errors["lastName"]} placeholder="Prakash" />
        </div>
      </Card>

      <Card title="Phone numbers" subtitle="Mobile, alternate & WhatsApp">
        <div className="space-y-4">
          <Phone label="Mobile" required code={form.phoneCountry} onCodeChange={(v) => set("phoneCountry", v)} value={form.phone} onChange={(v) => set("phone", v)} error={errors["phone"]} />
          <Phone label="Alternate" code={form.phoneCountry} value={form.alternatePhone} onChange={(v) => set("alternatePhone", v)} />
          <Phone label="WhatsApp" code={form.phoneCountry} value={form.sameAsMobile ? form.phone : form.whatsApp} onChange={(v) => set("whatsApp", v)} disabled={form.sameAsMobile} />
          <Switch label="Same as mobile" hint="Copy the mobile number to WhatsApp" checked={form.sameAsMobile} onChange={(v) => set("sameAsMobile", v)} />
        </div>
      </Card>

      <Card title="Email addresses">
        <div className="space-y-4">
          <Text label="Primary email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors["email"]} placeholder="name@email.com" />
          <Text label="Secondary email" type="email" value={form.secondaryEmail} onChange={(v) => set("secondaryEmail", v)} placeholder="Optional" />
        </div>
      </Card>

      <Card title="Personal details">
        <div className="space-y-4">
          <DateField label="Date of birth" value={form.dob} onChange={(v) => set("dob", v)} />
          <Select label="Gender" value={form.gender} onChange={(v) => set("gender", v)} options={["Male", "Female", "Other"]} />
          <Select label="Marital status" value={form.maritalStatus} onChange={(v) => set("maritalStatus", v)} options={["Single", "Married", "Divorced", "Widowed"]} />
          <Text label="Occupation" value={form.occupation} onChange={(v) => set("occupation", v)} placeholder="Software engineer" />
          <Money label="Annual income" value={form.annualIncome} onChange={(v) => set("annualIncome", v)} />
          <Text label="Number of children" value={form.children} onChange={(v) => set("children", v.replace(/\D/g, ""))} placeholder="0" />
        </div>
      </Card>

      <Card title="Identifiers" subtitle="KYC references">
        <div className="space-y-4">
          <Text label="PAN" mono value={form.pan} onChange={(v) => set("pan", v.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" />
          <Text label="Aadhaar" mono value={form.aadhaar} onChange={(v) => set("aadhaar", v.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1 "))} placeholder="XXXX XXXX XXXX" />
        </div>
      </Card>

      <Card title="Communication preferences">
        <div className="space-y-4">
          <Chips label="Preferred contact" options={["Call", "WhatsApp", "Email", "In person"]} selected={form.preferredContact} onToggle={(v) => set("preferredContact", toggle(form.preferredContact, v))} />
          <Select label="Best time to call" value={form.bestTimeToCall} onChange={(v) => set("bestTimeToCall", v)} options={["Morning (9–12)", "Afternoon (12–5)", "Evening (5–9)"]} />
          <Select label="Language" value={form.language} onChange={(v) => set("language", v)} options={["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali"]} />
          <Switch label="Do not disturb" hint="Skip promotional outreach" checked={form.dnd} onChange={(v) => set("dnd", v)} />
          {form.dnd && (
            <Select label="DND reason" value={form.dndReason} onChange={(v) => set("dndReason", v)} options={["Requested by customer", "Registered on DND list", "Too many attempts", "Other"]} />
          )}
          <Switch label="Marketing consent" hint="Allowed to receive campaigns" checked={form.marketingConsent} onChange={(v) => set("marketingConsent", v)} />
        </div>
      </Card>
    </div>
  );
}

export function StepCompany({ form, set }: P) {
  return (
    <div className="space-y-3">
      <Card title="Organization">
        <div className="space-y-4">
          <Text label="Company name" value={form.companyName} onChange={(v) => set("companyName", v)} placeholder="ABC Technologies" />
          <Text label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://" />
          <Phone label="Company phone" code={form.phoneCountry} value={form.companyPhone} onChange={(v) => set("companyPhone", v)} />
          <Text label="Company email" type="email" value={form.companyEmail} onChange={(v) => set("companyEmail", v)} placeholder="info@company.com" />
        </div>
      </Card>

      <Card title="Role">
        <div className="space-y-4">
          <Text label="Job title" value={form.jobTitle} onChange={(v) => set("jobTitle", v)} placeholder="Senior manager" />
          <Select label="Department" value={form.department} onChange={(v) => set("department", v)} options={["Sales", "Marketing", "Engineering", "Finance", "HR", "Operations", "Legal"]} />
          <Select label="Industry" value={form.industry} onChange={(v) => set("industry", v)} options={["Technology / IT", "Banking & Finance", "Healthcare & Pharma", "Manufacturing", "Retail", "Education", "Real estate", "Government"]} />
        </div>
      </Card>

      <Card title="Company profile">
        <div className="space-y-4">
          <Select label="Company size" value={form.companySize} onChange={(v) => set("companySize", v)} options={["1–10", "11–50", "51–200", "201–1000", "1000+"]} />
          {form.companySize && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary" style={{ width: `${sizeScale(form.companySize)}%` }} />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{form.companySize} employees</span>
            </div>
          )}
          <Select label="Annual revenue" value={form.annualRevenue} onChange={(v) => set("annualRevenue", v)} options={["< ₹1 Cr", "₹1–10 Cr", "₹10–100 Cr", "₹100 Cr+"]} />
          <Area label="Company address" rows={2} value={form.companyAddress} onChange={(v) => set("companyAddress", v)} />
        </div>
      </Card>

      <Card title="Decision maker">
        <div className="space-y-4">
          <Select label="Role" value={form.decisionMakerRole} onChange={(v) => set("decisionMakerRole", v)} options={["Decision maker", "Influencer", "Gatekeeper", "End user"]} />
          <Select label="Level" value={form.decisionMakerLevel} onChange={(v) => set("decisionMakerLevel", v)} options={["C-level", "VP", "Director", "Manager", "Individual"]} />
        </div>
      </Card>
    </div>
  );
}

export function StepPipeline({ form, set, errors }: P) {
  const score = Number(form.leadScore || 0);
  const scoreColor = score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-destructive";
  return (
    <div className="space-y-3">
      <Card title="Pipeline status">
        <div className="space-y-4">
          <Select label="Lead status" required value={form.leadStatus} onChange={(v) => set("leadStatus", v)} error={errors["leadStatus"]} options={["New", "Contacted", "Qualified", "Proposal sent", "Negotiation", "Closed won", "Closed lost"]} />
          {form.leadStatus === "Closed lost" && (
            <Select label="Lost reason" value={form.lostReason} onChange={(v) => set("lostReason", v)} options={["Price too high", "Went to competitor", "No response", "Not interested", "Bad timing"]} />
          )}
          <Chips label="Temperature" options={["Hot", "Warm", "Cold"]} selected={form.temperature ? [form.temperature] : []} onToggle={(v) => set("temperature", form.temperature === v ? "" : v)} single />
          <Select label="Priority" required value={form.leadPriority} onChange={(v) => set("leadPriority", v)} error={errors["leadPriority"]} options={["Priority 1", "Priority 2", "Priority 3"]} />
          <Select label="Source" required value={form.leadSource} onChange={(v) => set("leadSource", v)} error={errors["leadSource"]} options={["Website", "Referral", "Cold call", "Social media", "Event", "Advertisement", "Walk-in"]} />
          <Text label="Campaign name" value={form.campaignName} onChange={(v) => set("campaignName", v)} placeholder="Summer promo" />
        </div>
      </Card>

      <Card title="Deal details">
        <div className="space-y-4">
          <Money label="Expected value" value={form.expectedDealValue} onChange={(v) => set("expectedDealValue", v)} />
          <Slider label="Conversion probability" value={form.conversionProbability} onChange={(v) => set("conversionProbability", v)} />
          <DateField label="Expected close date" value={form.expectedCloseDate} onChange={(v) => set("expectedCloseDate", v)} />
          <Select label="Budget range" value={form.budgetRange} onChange={(v) => set("budgetRange", v)} options={["Under ₹1L", "₹1–5L", "₹5–10L", "₹10L+"]} />
          <Select label="Urgency" value={form.urgency} onChange={(v) => set("urgency", v)} options={["Immediate", "This month", "This quarter", "Exploring"]} />
          <div>
            <Text label="Lead score (0–100)" value={form.leadScore} onChange={(v) => set("leadScore", v.replace(/\D/g, "").slice(0, 3))} placeholder="72" />
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${Math.min(score, 100)}%` }} />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{Math.min(score, 100)}/100</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Classification">
        <div className="space-y-4">
          <Select label="Customer tier" value={form.customerTier} onChange={(v) => set("customerTier", v)} options={["Platinum", "Gold", "Silver", "Bronze"]} />
          <Switch label="VIP lead" hint="Flag for senior attention" checked={form.vip} onChange={(v) => set("vip", v)} />
          <Chips label="Tags" options={["Urgent", "Hot", "Cold", "Renewal", "High value"]} selected={form.tags} onToggle={(v) => set("tags", toggle(form.tags, v))} />
          <Chips label="Policy interest" options={["Life", "Health", "Motor", "Term", "Investment", "Travel"]} selected={form.policyInterest} onToggle={(v) => set("policyInterest", toggle(form.policyInterest, v))} />
          <Select label="Lead owner" value={form.leadOwner} onChange={(v) => set("leadOwner", v)} options={["Rahul Sharma", "Priya Nair", "Arun Kumar", "Sneha Rao"]} />
        </div>
      </Card>

      <Card title="Referral">
        <div className="space-y-4">
          <Text label="Referred by" value={form.referralName} onChange={(v) => set("referralName", v)} placeholder="Name" />
          <Select label="Relationship" value={form.referralRelationship} onChange={(v) => set("referralRelationship", v)} options={["Friend", "Family", "Colleague", "Existing customer", "Partner"]} />
        </div>
      </Card>

      <Card title="Next action" subtitle="Only the selected action's fields show">
        <div className="space-y-4">
          <Chips
            label="What's next?"
            options={["Follow-up", "Appointment", "Video call", "Call back"]}
            selected={form.actionType ? [form.actionType] : []}
            onToggle={(v) => set("actionType", form.actionType === v ? "" : v)}
            single
          />
          {errors["actionType"] && <p className="text-xs font-medium text-destructive">{errors["actionType"]}</p>}

          {form.actionType === "Follow-up" && (
            <div className="animate-step-in space-y-4 rounded-xl border border-border bg-secondary/40 p-4">
              <Select label="Follow-up type" value={form.followUpType} onChange={(v) => set("followUpType", v)} options={["One-time", "Weekly", "Monthly"]} error={errors["followUpType"]} />
              <DateField label="Follow-up date" value={form.followUpDate} onChange={(v) => set("followUpDate", v)} error={errors["followUpDate"]} />
              <Chips label="Method" options={["Call", "WhatsApp", "Email", "In person", "Video"]} selected={form.followUpMethod ? [form.followUpMethod] : []} onToggle={(v) => set("followUpMethod", form.followUpMethod === v ? "" : v)} single />
            </div>
          )}
          {form.actionType === "Appointment" && (
            <div className="animate-step-in space-y-4 rounded-xl border border-border bg-secondary/40 p-4">
              <Grid>
                <DateField label="Date" value={form.appointmentDate} onChange={(v) => set("appointmentDate", v)} error={errors["appointmentDate"]} />
                <TimeField label="Time" value={form.appointmentTime} onChange={(v) => set("appointmentTime", v)} />
              </Grid>
              <Text label="Place" value={form.appointmentAddress} onChange={(v) => set("appointmentAddress", v)} placeholder="Office, café, home visit" />
              <Text label="Map link" value={form.locationLink} onChange={(v) => set("locationLink", v)} placeholder="Paste a maps link" />
            </div>
          )}
          {form.actionType === "Video call" && (
            <div className="animate-step-in space-y-4 rounded-xl border border-border bg-secondary/40 p-4">
              <Grid>
                <DateField label="Date" value={form.videoCallDate} onChange={(v) => set("videoCallDate", v)} />
                <TimeField label="Time" value={form.videoCallTime} onChange={(v) => set("videoCallTime", v)} />
              </Grid>
              <Text label="Meeting link" value={form.meetingLink} onChange={(v) => set("meetingLink", v)} placeholder="Zoom / Meet URL" />
            </div>
          )}
          {form.actionType === "Call back" && (
            <div className="animate-step-in space-y-4 rounded-xl border border-border bg-secondary/40 p-4">
              <Grid>
                <DateField label="Date" value={form.callbackDate} onChange={(v) => set("callbackDate", v)} />
                <TimeField label="Time" value={form.callbackTime} onChange={(v) => set("callbackTime", v)} />
              </Grid>
            </div>
          )}
          {form.actionType && (
            <Select label="Reminder" value={form.reminder} onChange={(v) => set("reminder", v)} options={["15 min before", "30 min before", "1 hour before", "1 day before"]} />
          )}
        </div>
      </Card>

      <Card title="Tracking" subtitle="Contact history & campaign attribution">
        <div className="space-y-4">
          <DateField label="First contact" value={form.firstContactDate} onChange={(v) => set("firstContactDate", v)} />
          <DateField label="Last contact" value={form.lastContactDate} onChange={(v) => set("lastContactDate", v)} />
          <Text label="UTM source" value={form.utmSource} onChange={(v) => set("utmSource", v)} />
          <Text label="UTM medium" value={form.utmMedium} onChange={(v) => set("utmMedium", v)} />
          <Text label="UTM campaign" value={form.utmCampaign} onChange={(v) => set("utmCampaign", v)} />
        </div>
      </Card>
    </div>
  );
}

const PINS: Record<string, { city: string; district: string; state: string }> = {
  "560001": { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  "600001": { city: "Chennai", district: "Chennai", state: "Tamil Nadu" },
  "400001": { city: "Mumbai", district: "Mumbai City", state: "Maharashtra" },
  "110001": { city: "New Delhi", district: "Central Delhi", state: "Delhi" },
  "500001": { city: "Hyderabad", district: "Hyderabad", state: "Telangana" },
};

export function StepAddress({ form, set }: P) {
  const lookup = () => {
    const hit = PINS[form.pincode];
    if (hit) {
      set("city", hit.city);
      set("district", hit.district);
      set("state", hit.state);
    }
  };
  const full = [form.streetAddress, form.addressLine2, form.landmark, form.city, form.state, form.pincode, form.country]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="space-y-3">
      <Card title="Address details" subtitle="Location for field visits">
        <div className="space-y-4">
          <Select label="Address type" value={form.addressType} onChange={(v) => set("addressType", v)} options={["Permanent", "Residential", "Office", "Billing"]} />
          <Text label="Street address" value={form.streetAddress} onChange={(v) => set("streetAddress", v)} placeholder="House / flat, building, street" />
          <Text label="Area / line 2" value={form.addressLine2} onChange={(v) => set("addressLine2", v)} placeholder="Apartment, suite" />
          <Text label="Landmark" value={form.landmark} onChange={(v) => set("landmark", v)} placeholder="Near Central Mall" />
          <div>
            <label className="label-xs">Pincode</label>
            <div className="flex gap-2">
              <input
                value={form.pincode}
                inputMode="numeric"
                placeholder="560001"
                onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="field flex-1"
              />
              <button type="button" onClick={lookup} className="h-11 shrink-0 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground">
                Lookup
              </button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Fills city, district and state automatically.</p>
          </div>
          <Text label="City" value={form.city} onChange={(v) => set("city", v)} />
          <Text label="District" value={form.district} onChange={(v) => set("district", v)} />
          <Text label="State" value={form.state} onChange={(v) => set("state", v)} />
          <Select label="Country" value={form.country} onChange={(v) => set("country", v)} options={["India", "UAE", "Singapore", "United Kingdom", "United States"]} />
        </div>
      </Card>

      <Card title="Quick actions">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!full}
            onClick={() => navigator.clipboard?.writeText(full)}
            className="h-10 rounded-xl border border-border px-4 text-sm font-medium disabled:opacity-50"
          >
            Copy full address
          </button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(full || "India")}`}
            target="_blank"
            rel="noreferrer"
            className="grid h-10 place-items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Open in Maps
          </a>
        </div>
        {full && <p className="mt-3 rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed text-muted-foreground">{full}</p>}
      </Card>
    </div>
  );
}

export function StepSocial({ form, set }: P) {
  return (
    <div className="space-y-3">
      <Card title="Social profiles">
        <div className="space-y-4">
          <Text label="LinkedIn" value={form.linkedIn} onChange={(v) => set("linkedIn", v)} placeholder="Paste URL" />
          <Text label="Facebook" value={form.facebook} onChange={(v) => set("facebook", v)} placeholder="Paste URL" />
          <Text label="Twitter / X" value={form.twitter} onChange={(v) => set("twitter", v)} placeholder="@username" />
          <Text label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="@username" />
        </div>
      </Card>
      <Card title="Notes" subtitle="Requirements & discussion">
        <Area label="Conversation notes" rows={4} value={form.notes} onChange={(v) => set("notes", v)} placeholder="What did they ask for?" hint={`${form.notes.length} characters`} />
      </Card>
      <Card
        title="Internal remarks"
        subtitle="Not shared with the customer"
        badge={<span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">Private</span>}
      >
        <Area label="Team-only remarks" rows={3} value={form.agentRemarks} onChange={(v) => set("agentRemarks", v)} />
      </Card>
      <Card title="Suggested plan">
        <Area label="Product recommendations" rows={2} value={form.planSuggested} onChange={(v) => set("planSuggested", v)} />
      </Card>
    </div>
  );
}

export function StepRelations({
  form,
  addRelation,
  removeRelation,
  updateRelation,
  addInterest,
  removeInterest,
  updateInterest,
}: {
  form: LeadForm;
  addRelation: () => void;
  removeRelation: (id: string) => void;
  updateRelation: (id: string, patch: Partial<Relation>) => void;
  addInterest: () => void;
  removeInterest: (id: string) => void;
  updateInterest: (id: string, patch: Partial<Interest>) => void;
}) {
  return (
    <div className="space-y-3">
      <Card title="Family / key relations">
        <div className="space-y-3">
          {form.relations.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No relations added yet
            </p>
          )}
          {form.relations.map((r) => (
            <div key={r.id} className="animate-step-in space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Relation</span>
                <button type="button" onClick={() => removeRelation(r.id)} className="text-xs font-medium text-destructive">
                  Remove
                </button>
              </div>
              <Text label="Name" value={r.name} onChange={(v) => updateRelation(r.id, { name: v })} />
              <Grid>
                <Select label="Relation" value={r.relation} onChange={(v) => updateRelation(r.id, { relation: v })} options={["Spouse", "Son", "Daughter", "Father", "Mother", "Sibling"]} />
                <Text label="Age" value={r.age} onChange={(v) => updateRelation(r.id, { age: v.replace(/\D/g, "").slice(0, 3) })} />
              </Grid>
            </div>
          ))}
          <button type="button" onClick={addRelation} className="h-11 w-full rounded-xl border border-dashed border-primary/50 text-sm font-semibold text-primary">
            + Add relation
          </button>
        </div>
      </Card>

      <Card title="Insurance interests">
        <div className="space-y-3">
          {form.interests.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No interests added yet
            </p>
          )}
          {form.interests.map((i) => (
            <div key={i.id} className="animate-step-in space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interest</span>
                <button type="button" onClick={() => removeInterest(i.id)} className="text-xs font-medium text-destructive">
                  Remove
                </button>
              </div>
              <Select label="Product" value={i.product} onChange={(v) => updateInterest(i.id, { product: v })} options={["Life", "Health", "Motor", "Term", "Investment", "Travel"]} />
              <Money label="Cover amount" value={i.cover} onChange={(v) => updateInterest(i.id, { cover: v })} />
              <Text label="Note" value={i.note} onChange={(v) => updateInterest(i.id, { note: v })} placeholder="Family floater, etc." />
            </div>
          ))}
          <button type="button" onClick={addInterest} className="h-11 w-full rounded-xl border border-dashed border-primary/50 text-sm font-semibold text-primary">
            + Add interest
          </button>
        </div>
      </Card>
    </div>
  );
}

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function sizeScale(size: string) {
  return { "1–10": 15, "11–50": 35, "51–200": 55, "201–1000": 78, "1000+": 100 }[size] ?? 0;
}
