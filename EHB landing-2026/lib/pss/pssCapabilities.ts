/**
 * EHB PSS — verification & monitoring capability catalog (KYC / AML / fraud stack).
 * Used by DMO PSS page; wire to product config / vendor modules later.
 */

export type PssCapabilityCategory =
  | "identity"
  | "aml"
  | "monitoring"
  | "business"
  | "risk_signals"
  | "operations";

export type PssCapability = {
  id: string;
  title: string;
  category: PssCapabilityCategory;
  /** Short label for chips */
  short: string;
  purpose: string;
  useCase: string;
};

export const PSS_CAPABILITY_CATEGORIES: Record<PssCapabilityCategory, { label: string; description: string }> = {
  identity: {
    label: "Identity & documents",
    description: "Who the user is — documents, biometrics, and frictionless paths.",
  },
  aml: {
    label: "AML & sanctions",
    description: "Watchlists, counterparties, and payment message screening.",
  },
  monitoring: {
    label: "Ongoing monitoring",
    description: "After onboarding — money movement, crypto, behaviour, and refresh cycles.",
  },
  business: {
    label: "Business (KYB)",
    description: "Legal entities, registration, and merchant onboarding.",
  },
  risk_signals: {
    label: "Risk & intelligence",
    description: "Scores and signals from devices, email, phone, and IP.",
  },
  operations: {
    label: "Operations & compliance",
    description: "Questionnaires, strong auth, travel rule, and regulatory reporting.",
  },
};

export const PSS_CAPABILITIES: PssCapability[] = [
  {
    id: "id-verification",
    title: "ID Verification",
    category: "identity",
    short: "ID doc",
    purpose: "Confirm the person is real using official ID — passport, national ID, or driver licence.",
    useCase: "Bank asks a new customer to upload ID before opening an account.",
  },
  {
    id: "liveness",
    title: "Liveness",
    category: "identity",
    short: "Liveness",
    purpose: "Prove the user is physically present — block photos, replays, and deepfakes.",
    useCase: "Selfie step: blink, smile, or turn head during capture.",
  },
  {
    id: "aml-screening",
    title: "AML Screening",
    category: "aml",
    short: "AML",
    purpose: "Screen individuals and businesses against sanctions, PEP, and terrorist lists.",
    useCase: "Approve onboarding only after global watchlist checks pass.",
  },
  {
    id: "address-verification",
    title: "Address Verification",
    category: "identity",
    short: "Address",
    purpose: "Confirm the user lives at the claimed address.",
    useCase: "Utility bill or bank statement matching for regulated onboarding.",
  },
  {
    id: "ongoing-id-monitoring",
    title: "Ongoing ID Monitoring",
    category: "monitoring",
    short: "ID monitor",
    purpose: "Continuous checks after go-live — alerts when ID or risk status changes.",
    useCase: "Notify ops when a customer ID expires or becomes invalid.",
  },
  {
    id: "questionnaires",
    title: "Questionnaires",
    category: "operations",
    short: "Q&A",
    purpose: "Custom questions documents alone cannot answer.",
    useCase: "Source of funds, intended use of service, or industry-specific attestations.",
  },
  {
    id: "transaction-monitoring",
    title: "Transaction Monitoring",
    category: "monitoring",
    short: "Tx monitor",
    purpose: "Detect suspicious money movement patterns early.",
    useCase: "Flag unusually large or frequent transfers vs baseline.",
  },
  {
    id: "crypto-monitoring",
    title: "Crypto Monitoring (Active)",
    category: "monitoring",
    short: "Crypto",
    purpose: "Analyse wallets and on-chain flows for illicit exposure.",
    useCase: "Block deposits from wallets linked to scams, hacks, or mixers.",
  },
  {
    id: "kyb",
    title: "Business Verification (KYB)",
    category: "business",
    short: "KYB",
    purpose: "Verify companies are real, registered, and legally operating.",
    useCase: "Merchant onboarding with registry and ownership checks.",
  },
  {
    id: "behavior-monitoring",
    title: "Behavior Monitoring",
    category: "monitoring",
    short: "Behaviour",
    purpose: "Detect bots, account takeover, and abnormal in-app behaviour.",
    useCase: "Alert when logins come from new devices or impossible travel.",
  },
  {
    id: "face-2fa",
    title: "Face Authentication (2FA)",
    category: "operations",
    short: "Face 2FA",
    purpose: "Use face as a second factor for high-risk actions.",
    useCase: "Face scan before approving a withdrawal or limit change.",
  },
  {
    id: "travel-rule",
    title: "Travel Rule",
    category: "operations",
    short: "Travel Rule",
    purpose: "Meet crypto travel-rule obligations — share originator/beneficiary data.",
    useCase: "Exchange-to-exchange transfer with required metadata.",
  },
  {
    id: "non-doc-verification",
    title: "Non-Doc Verification",
    category: "identity",
    short: "Non-doc",
    purpose: "Verify without document upload — databases and authoritative sources.",
    useCase: "Low-friction onboarding using national ID databases or bureau data.",
  },
  {
    id: "reusable-kyc",
    title: "Reusable KYC",
    category: "identity",
    short: "Reusable",
    purpose: "Let users reuse verified identity across partners or products.",
    useCase: "Instant signup when user already completed KYC with a trusted issuer.",
  },
  {
    id: "age-estimation",
    title: "Age Estimation",
    category: "identity",
    short: "Age",
    purpose: "Estimate age from face for age-gated products.",
    useCase: "Block underage access to gambling or adult content without full doc KYC.",
  },
  {
    id: "video-identification",
    title: "Video Identification",
    category: "identity",
    short: "Video ID",
    purpose: "Highest assurance — live video with agent or automated interview.",
    useCase: "Remote bank account opening with recorded verification session.",
  },
  {
    id: "applicant-scoring",
    title: "Applicant Scoring",
    category: "risk_signals",
    short: "Score",
    purpose: "Single risk score from all collected signals for routing decisions.",
    useCase: "Send high-risk applicants to manual review queue.",
  },
  {
    id: "device-intelligence",
    title: "Device Intelligence",
    category: "risk_signals",
    short: "Device",
    purpose: "Fingerprint and reputation of devices to spot multi-account abuse.",
    useCase: "Detect many accounts from one device or emulator farms.",
  },
  {
    id: "email-risk",
    title: "Email Risk Scoring",
    category: "risk_signals",
    short: "Email",
    purpose: "Score email addresses for disposable, risky, or fraudulent patterns.",
    useCase: "Reject signups from throwaway or high-risk domains.",
  },
  {
    id: "phone-risk",
    title: "Phone Risk Scoring",
    category: "risk_signals",
    short: "Phone",
    purpose: "Validate numbers and detect burner / VoIP / SIM-box patterns.",
    useCase: "Block VoIP-only numbers for high-value actions.",
  },
  {
    id: "ip-scoring",
    title: "IP Scoring",
    category: "risk_signals",
    short: "IP",
    purpose: "Evaluate IP reputation — VPN, proxy, Tor, hosting ranges.",
    useCase: "Flag users hiding location during sensitive flows.",
  },
  {
    id: "counterparty-screening",
    title: "Counterparty Screening",
    category: "aml",
    short: "Counterparty",
    purpose: "Screen beneficiaries and recipients of transfers.",
    useCase: "Outbound wire screening before release.",
  },
  {
    id: "institution-screening",
    title: "Institution Screening",
    category: "aml",
    short: "Institution",
    purpose: "Screen banks and institutions in the payment path.",
    useCase: "Block rails involving sanctioned financial institutions.",
  },
  {
    id: "payment-details-screening",
    title: "Payment Details Screening",
    category: "aml",
    short: "Payment text",
    purpose: "Scan payment narratives and reference fields for risky content.",
    useCase: "Flag references that suggest illicit purpose.",
  },
  {
    id: "suspicious-payment-details",
    title: "Suspicious Payment Details",
    category: "aml",
    short: "Susp. metadata",
    purpose: "Deep inspection of payment metadata for subtle laundering patterns.",
    useCase: "Unknown or inconsistent names in transfer notes.",
  },
  {
    id: "periodic-verifications",
    title: "Periodic Verifications",
    category: "monitoring",
    short: "Periodic",
    purpose: "Scheduled re-verification to stay compliant long term.",
    useCase: "Annual KYC refresh for high-risk customer segments.",
  },
  {
    id: "regulatory-reports",
    title: "Regulatory Reports",
    category: "operations",
    short: "Reports",
    purpose: "Generate and file regulator-ready reports (e.g. SAR).",
    useCase: "Export suspicious activity report after case review.",
  },
];

export function capabilitiesByCategory(cat: PssCapabilityCategory | "all") {
  if (cat === "all") return PSS_CAPABILITIES;
  return PSS_CAPABILITIES.filter((c) => c.category === cat);
}
