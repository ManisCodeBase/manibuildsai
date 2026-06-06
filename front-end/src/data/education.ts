export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  status: "completed" | "in-progress";
  grade?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: "completed" | "in-progress";
  year?: string;
}

export const education: Education[] = [
  {
    id: "ljmu-ms",
    degree: "Master of Science",
    field: "Artificial Intelligence & Machine Learning",
    institution: "Liverpool John Moores University",
    location: "United Kingdom",
    period: "Expected 2026",
    status: "in-progress",
  },
  {
    id: "iiitb-pgdip",
    degree: "Postgraduate Diploma",
    field: "Generative AI & Applied Machine Learning",
    institution: "IIIT Bangalore",
    location: "India",
    period: "2025",
    status: "completed",
    grade: "CGPA 3.85 / 4.0",
  },
  {
    id: "jntu-btech",
    degree: "Bachelor of Technology",
    field: "Electronics & Communication Engineering",
    institution: "JNTU Kakinada",
    location: "India",
    period: "2016",
    status: "completed",
  },
];

export const certifications: Certification[] = [
  {
    id: "az-ai102",
    name: "Azure AI Engineer Associate (AI-102)",
    issuer: "Microsoft",
    status: "in-progress",
    year: "Expected 2026",
  },
  {
    id: "iiitb-pgai",
    name: "Executive PG in AI/ML",
    issuer: "IIIT Bangalore",
    status: "completed",
    year: "2025",
  },
];
