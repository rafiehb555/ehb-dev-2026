export const PLATFORM_ARCHITECTURE = {
  version: "1.0.0",
  lastUpdated: "2026-03-11",
  coreModules: [
    { id: "home", name: "Home Page", description: "Primary entry point with AI Assistant and service discovery." },
    { id: "marketplace", name: "Legal Services Marketplace", description: "Global directory of verified lawyers and legal services." },
    { id: "ai_assistant", name: "AI Legal Assistant", description: "Gemini-powered guidance, case analysis, and document generation." },
    { id: "lawyer_system", name: "Lawyer System", description: "Dashboard for case management, billing, and client communication." },
    { id: "client_system", name: "Client System", description: "Personal legal portal for tracking cases and managing documents." },
    { id: "franchise_system", name: "Franchise System", description: "Multi-tier governance for global, country, and city operations." },
    { id: "knowledge_base", name: "Knowledge Base", description: "Comprehensive legal library and country-specific law guides." },
    { id: "payment_system", name: "Payment System", description: "Blockchain-backed escrow with EHBGC, Crypto, and Fiat support." },
    { id: "comm_system", name: "Communication System", description: "Encrypted chat, video consultation, and secure file sharing." },
    { id: "security_system", name: "Security System", description: "ID verification, fraud detection, and end-to-end encryption." }
  ],
  userTypes: [
    { type: "Client", permissions: ["Create Cases", "Hire Lawyers", "Manage Documents", "Pay Fees"] },
    { type: "Lawyer", permissions: ["Accept Cases", "Bill Clients", "Draft Documents", "Consultation"] },
    { type: "Franchise Manager", permissions: ["Vet Lawyers", "Manage Regional Services", "Revenue Tracking"] },
    { type: "Super Admin", permissions: ["Global Settings", "Platform Governance", "Financial Oversight"] }
  ],
  aiModules: [
    { name: "AI Case Analyzer", task: "Classifies legal issues and estimates complexity." },
    { name: "AI Lawyer Matcher", task: "Matches clients with the best specialized lawyers." },
    { name: "AI Document Generator", task: "Drafts legal contracts and notices instantly." },
    { name: "AI Legal Research", task: "Searches global law databases for precedents." }
  ],
  databaseSchema: {
    coreTables: [
      "users", "profiles", "lawyers", "franchises", "cases", "documents", 
      "payments", "transactions", "escrow_accounts", "messages", 
      "consultations", "reviews", "law_categories", "services", 
      "knowledge_articles", "compliance_logs"
    ]
  },
  techStack: {
    frontend: "Next.js, TypeScript, Tailwind CSS, Motion",
    backend: "Node.js, Express, Gemini AI SDK",
    blockchain: "EHBGC (EHB Global Coin) Ledger",
    mobile: "React Native (Android/iOS)"
  }
};
