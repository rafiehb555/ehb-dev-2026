export type JpsProfileRecord = {
  id: string;
  name: string;
  designation: string;
  industry: string;
  city: string;
  status: "Verified" | "Review" | "Basic";
  experience: string;
  education: string;
  certifications: string[];
  skills: string[];
  services: string[];
  jobs: string[];
  stlLevel: string;
};

export type JpsDesignationLevel = {
  level: number;
  title: string;
};

export type JpsSkillCategory = {
  category: string;
  exampleSkills: string[];
};

export type JpsOverview = {
  profiles: JpsProfileRecord[];
  skillCategories: JpsSkillCategory[];
  designationLadders: Record<string, JpsDesignationLevel[]>;
  systemNotes: string[];
};

export const JPS_PROFILES: JpsProfileRecord[] = [
  {
    id: "jps-1",
    name: "Ali Khan",
    designation: "Senior Electrician",
    industry: "Technical",
    city: "Lahore",
    status: "Verified",
    experience: "5 years",
    education: "Technical Diploma",
    certifications: ["CRB Certified Electrician", "PSS Verified"],
    skills: ["Wiring", "Solar Setup", "Maintenance"],
    services: ["Home Wiring", "Solar Maintenance", "Electrical Inspection"],
    jobs: ["Site Electrician", "Maintenance Lead", "Solar Technician"],
    stlLevel: "High",
  },
  {
    id: "jps-2",
    name: "Sara Ahmed",
    designation: "Senior Developer",
    industry: "Technology",
    city: "Karachi",
    status: "Verified",
    experience: "4 years",
    education: "BS Computer Science",
    certifications: ["CRB Software Skills Review", "PSS Verified"],
    skills: ["Software Development", "Web Design", "CRM Support"],
    services: ["Remote IT Support", "Web UI Development", "POS Setup"],
    jobs: ["Frontend Developer", "Support Specialist", "Deployment Technician"],
    stlLevel: "High",
  },
  {
    id: "jps-3",
    name: "Hamza Khan",
    designation: "General Physician",
    industry: "Health",
    city: "Islamabad",
    status: "Review",
    experience: "6 years",
    education: "MBBS",
    certifications: ["Medical Licensing Review", "PSS Verified"],
    skills: ["Patient Intake", "Emergency Support", "Clinical Assessment"],
    services: ["Clinic Assistance", "Primary Consultation", "Home Care Support"],
    jobs: ["Ward Assistant", "Clinic Coordinator", "Primary Care Doctor"],
    stlLevel: "Medium",
  },
  {
    id: "jps-4",
    name: "Ayesha Malik",
    designation: "Trainer",
    industry: "Education",
    city: "Faisalabad",
    status: "Basic",
    experience: "3 years",
    education: "B.Ed",
    certifications: ["Teaching Practice Review"],
    skills: ["Tutoring", "Training", "Curriculum Support"],
    services: ["Online Tutoring", "Exam Prep Coaching", "Teacher Training"],
    jobs: ["Tutor", "Learning Facilitator", "Training Assistant"],
    stlLevel: "Basic",
  },
];

export const JPS_SKILL_CATEGORIES = [
  { category: "IT", exampleSkills: ["Software Development", "Web Design", "Cloud Support"] },
  { category: "Technical", exampleSkills: ["Electrician", "Plumber", "Mechanic"] },
  { category: "Medical", exampleSkills: ["Nursing", "Physiotherapy", "General Practice"] },
  { category: "Legal", exampleSkills: ["Lawyer", "Legal Consultant", "Case Research"] },
  { category: "Education", exampleSkills: ["Tutoring", "Training", "Curriculum Design"] },
  { category: "Creative", exampleSkills: ["Graphic Design", "Video Editing", "Branding"] },
];

export const JPS_DESIGNATION_LADDERS: Record<string, JpsDesignationLevel[]> = {
  Technology: [
    { level: 1, title: "Intern" },
    { level: 2, title: "Junior Developer" },
    { level: 3, title: "Developer" },
    { level: 4, title: "Senior Developer" },
    { level: 5, title: "Team Lead" },
    { level: 6, title: "Project Manager" },
  ],
  Health: [
    { level: 1, title: "Medical Intern" },
    { level: 2, title: "Junior Doctor" },
    { level: 3, title: "General Physician" },
    { level: 4, title: "Specialist" },
    { level: 5, title: "Senior Specialist" },
    { level: 6, title: "Consultant" },
  ],
};

export const JPS_SYSTEM_NOTES = [
  "JPS professional identity EHB ke trust framework ke saath integrated hai.",
  "Primary industry activation ke liye PSS verification, CRB certification, aur verified service listing required hoti hai.",
  "Designation promotion STL, experience, certifications, aur service performance ke combined score par depend karti hai.",
  "6-month refilling miss hone par STL drop aur designation freeze ho sakta hai.",
];

export function getJpsOverview(): JpsOverview {
  return {
    profiles: JPS_PROFILES,
    skillCategories: JPS_SKILL_CATEGORIES,
    designationLadders: JPS_DESIGNATION_LADDERS,
    systemNotes: JPS_SYSTEM_NOTES,
  };
}
