export type Relation = {
  id: string;
  name: string;
  relation: string;
  age: string;
};

export type Interest = {
  id: string;
  product: string;
  cover: string;
  note: string;
};

export type LeadForm = {
  // contact
  salutation: string;
  firstName: string;
  lastName: string;
  phoneCountry: string;
  phone: string;
  alternatePhone: string;
  whatsApp: string;
  sameAsMobile: boolean;
  email: string;
  secondaryEmail: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  annualIncome: string;
  children: string;
  pan: string;
  aadhaar: string;
  preferredContact: string[];
  bestTimeToCall: string;
  language: string;
  dnd: boolean;
  dndReason: string;
  marketingConsent: boolean;

  // company
  companyName: string;
  website: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  jobTitle: string;
  department: string;
  industry: string;
  companySize: string;
  annualRevenue: string;
  decisionMakerRole: string;
  decisionMakerLevel: string;

  // pipeline
  leadStatus: string;
  lostReason: string;
  temperature: string;
  leadPriority: string;
  leadSource: string;
  campaignName: string;
  expectedDealValue: string;
  conversionProbability: number;
  expectedCloseDate: string;
  budgetRange: string;
  urgency: string;
  leadScore: string;
  customerTier: string;
  vip: boolean;
  tags: string[];
  policyInterest: string[];
  leadOwner: string;
  referralName: string;
  referralRelationship: string;
  actionType: string;
  followUpType: string;
  followUpDate: string;
  followUpMethod: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentAddress: string;
  locationLink: string;
  videoCallDate: string;
  videoCallTime: string;
  meetingLink: string;
  callbackDate: string;
  callbackTime: string;
  reminder: string;
  firstContactDate: string;
  lastContactDate: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;

  // address
  addressType: string;
  streetAddress: string;
  addressLine2: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;

  // social & notes
  linkedIn: string;
  facebook: string;
  twitter: string;
  instagram: string;
  notes: string;
  agentRemarks: string;
  planSuggested: string;

  // dynamic
  relations: Relation[];
  interests: Interest[];
};

export type FormErrors = Record<string, string | undefined>;

export const emptyForm: LeadForm = {
  salutation: "Mr.",
  firstName: "",
  lastName: "",
  phoneCountry: "+91",
  phone: "",
  alternatePhone: "",
  whatsApp: "",
  sameAsMobile: false,
  email: "",
  secondaryEmail: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  occupation: "",
  annualIncome: "",
  children: "",
  pan: "",
  aadhaar: "",
  preferredContact: [],
  bestTimeToCall: "",
  language: "",
  dnd: false,
  dndReason: "",
  marketingConsent: true,

  companyName: "",
  website: "",
  companyPhone: "",
  companyEmail: "",
  companyAddress: "",
  jobTitle: "",
  department: "",
  industry: "",
  companySize: "",
  annualRevenue: "",
  decisionMakerRole: "",
  decisionMakerLevel: "",

  leadStatus: "",
  lostReason: "",
  temperature: "",
  leadPriority: "",
  leadSource: "",
  campaignName: "",
  expectedDealValue: "",
  conversionProbability: 50,
  expectedCloseDate: "",
  budgetRange: "",
  urgency: "",
  leadScore: "",
  customerTier: "",
  vip: false,
  tags: [],
  policyInterest: [],
  leadOwner: "",
  referralName: "",
  referralRelationship: "",
  actionType: "",
  followUpType: "",
  followUpDate: "",
  followUpMethod: "",
  appointmentDate: "",
  appointmentTime: "",
  appointmentAddress: "",
  locationLink: "",
  videoCallDate: "",
  videoCallTime: "",
  meetingLink: "",
  callbackDate: "",
  callbackTime: "",
  reminder: "",
  firstContactDate: "",
  lastContactDate: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",

  addressType: "Permanent",
  streetAddress: "",
  addressLine2: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",

  linkedIn: "",
  facebook: "",
  twitter: "",
  instagram: "",
  notes: "",
  agentRemarks: "",
  planSuggested: "",

  relations: [],
  interests: [],
};

export const STEPS = [
  { key: "contact", label: "Contact", title: "Contact information", subtitle: "Name, phones & email channels", mins: "2 min" },
  { key: "company", label: "Company", title: "Company & role", subtitle: "Employer, designation & industry", mins: "2 min" },
  { key: "pipeline", label: "Pipeline", title: "Lead pipeline", subtitle: "Status, priority & deal tracking", mins: "3 min" },
  { key: "address", label: "Address", title: "Address details", subtitle: "Location & pincode lookup", mins: "1 min" },
  { key: "social", label: "Notes", title: "Social & notes", subtitle: "Profiles & conversation notes", mins: "1 min" },
  { key: "relations", label: "Family", title: "Relations & interests", subtitle: "Family members & product interests", mins: "2 min" },
  { key: "review", label: "Review", title: "Review & save", subtitle: "Confirm details before saving", mins: "1 min" },
] as const;
