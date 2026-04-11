export type JpsProfile = {
  username: string;
  photo: string;
  name: string;
  stlLevel: string;
  verificationStatus: string;
  rating: number;
  bio: string;
  skills: string[];
};

const PROFILES: JpsProfile[] = [
  {
    username: "rafi",
    photo: "/images/profiles/rafi.png",
    name: "Rafi Ahmed",
    stlLevel: "STL - PRO",
    verificationStatus: "Verified via PSS + CRB + STL",
    rating: 4.9,
    bio: "I help beginners start earning through verified services and clean trust flows.",
    skills: ["Web Development", "SEO", "AI Matching"],
  },
  {
    username: "sara",
    photo: "/images/profiles/sara.png",
    name: "Sara Khan",
    stlLevel: "STL - ACTIVE",
    verificationStatus: "Verified via PSS + DMO + STL",
    rating: 4.7,
    bio: "I build service-ready profiles and guide onboarding with consistent trust signals.",
    skills: ["Education Tutoring", "Course Planning", "Customer Support"],
  },
  {
    username: "ali",
    photo: "/images/profiles/ali.png",
    name: "Ali Raza",
    stlLevel: "STL - PRO",
    verificationStatus: "Verified via PSS + CRB + STL",
    rating: 4.8,
    bio: "I deliver verified jobs across industries and help franchises scale safely.",
    skills: ["Delivery Ops", "Provider Onboarding", "Operations"],
  },
];

export function getJpsProfileByUsername(username: string): JpsProfile | undefined {
  return PROFILES.find((profile) => profile.username.toLowerCase() === username.toLowerCase());
}

export function getAllJpsProfiles(): JpsProfile[] {
  return PROFILES.slice();
}
