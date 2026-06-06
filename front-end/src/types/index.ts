export type ProjectCategory = "AI" | "Fullstack" | "Tools";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  techStack: string[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  status: "live" | "in-progress" | "archived";
  metrics?: string;
  imageGradient: string;
}

export interface Skill {
  name: string;
  level: number;
  category: "AI/ML" | "Backend" | "Frontend" | "DevOps";
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  icon: string;
  color: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  techStack: string[];
  type: "full-time" | "contract" | "freelance";
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  open_issues_count: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
