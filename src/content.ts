import type { IconName } from "./icons";

/* ==========================================================
   PORTFOLIO CONTENT SYSTEM
   Edit the data at the bottom of this file.
   ========================================================== */

export type Link = {
  label: string;
  url: string;
};

export type Media = {
  src: string;
  caption: string;
};

export type Section = {
  title: string;
  text: string;
};

// Simple is a full, plain-language account, not a synopsis or a specification list.
// Explain any necessary terminology in ordinary language within these narratives.
export type SimpleProjectExplanation = {
  whatItIs: string;
  whyItExists: string;
  whatItDoes: string;
  howItWorks: string;
  accomplishments: string;
  challenges: string;
  plannedWork: string;
};

// Technical content should document engineering decisions and evidence in depth.
export type TechnicalProjectExplanation = {
  architecture: string;
  implementation: string;
  algorithms: string;
  interfaces: string;
  tradeOffs: string;
  testing: string;
  limitations: string;
  researchFindings: string;
  plannedWork: string;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  description: string;
  simple: SimpleProjectExplanation;
  technical: TechnicalProjectExplanation;
  technologies: string[];
  cover?: string;
  images: Media[];
  sections: Section[];
  links: Link[];
  documentation: Link[];
  featured: boolean;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
};

export type Education = {
  institution: string;
  qualification: string;
  period: string;
  details: string[];
};

export type Achievement = {
  title: string;
  organization: string;
  year: string;
  description: string;
};

export type Capability = {
  id: string;
  name: string;
  description: string;
  icon?: IconName;
  skills: string[];
  projectIds: string[];
  experienceLevel?: string;
  technicalNotes: Section[];
};

export type PersonalInterest = {
  id: string;
  title: string;
  summary: string;
  icon?: IconName;
  introduction: string;
  background: string;
  activities: Section[];
  sections: Section[];
  notes: Section[];
  images: Media[];
  links: Link[];
};

export type AboutContent = {
  greeting: string;
  introduction: string;
  portrait: Media;
  portraitLabel: string;
  portraitPlaceholder: string;
  birthdayWish: string;
  history: Section;
  capabilitiesTitle: string;
  capabilitiesIntroduction: string;
  capabilities: Capability[];
  outsideTitle: string;
  interests: PersonalInterest[];
  additionalInterestsTitle: string;
  closing: Section;
};

export type BlogPost = {
  title: string;
  slug: string;
  publicationDate: string;
  cover?: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
};

/* ==========================================================
   HELPER FUNCTIONS
   ========================================================== */

export function link(label: string, url: string): Link {
  return { label, url };
}

export function image(src: string, caption = ""): Media {
  return { src, caption };
}

export function section(title: string, text: string): Section {
  return { title, text };
}

export function project(
  id: string,
  title: string,
  options: Partial<Omit<Project, "id" | "title" | "simple" | "technical">> & {
    simple?: Partial<SimpleProjectExplanation>;
    technical?: Partial<TechnicalProjectExplanation>;
  } = {},
): Project {
  return {
    id,
    title,
    subtitle: options.subtitle ?? "",
    category: options.category ?? "",
    status: options.status ?? "",
    description: options.description ?? "",
    simple: {
      whatItIs: options.simple?.whatItIs ?? "",
      whyItExists: options.simple?.whyItExists ?? "",
      whatItDoes: options.simple?.whatItDoes ?? "",
      howItWorks: options.simple?.howItWorks ?? "",
      accomplishments: options.simple?.accomplishments ?? "",
      challenges: options.simple?.challenges ?? "",
      plannedWork: options.simple?.plannedWork ?? "",
    },
    technical: {
      architecture: options.technical?.architecture ?? "",
      implementation: options.technical?.implementation ?? "",
      algorithms: options.technical?.algorithms ?? "",
      interfaces: options.technical?.interfaces ?? "",
      tradeOffs: options.technical?.tradeOffs ?? "",
      testing: options.technical?.testing ?? "",
      limitations: options.technical?.limitations ?? "",
      researchFindings: options.technical?.researchFindings ?? "",
      plannedWork: options.technical?.plannedWork ?? "",
    },
    technologies: options.technologies ?? [],
    cover: options.cover,
    images: options.images ?? [],
    sections: options.sections ?? [],
    links: options.links ?? [],
    documentation: options.documentation ?? [],
    featured: options.featured ?? false,
  };
}

export function experience(
  id: string,
  role: string,
  organization: string,
  options: Partial<
    Omit<Experience, "id" | "role" | "organization">
  > = {},
): Experience {
  return {
    id,
    role,
    organization,
    period: options.period ?? "",
    description: options.description ?? "",
    highlights: options.highlights ?? [],
  };
}

export function education(
  institution: string,
  qualification: string,
  options: Partial<
    Omit<Education, "institution" | "qualification">
  > = {},
): Education {
  return {
    institution,
    qualification,
    period: options.period ?? "",
    details: options.details ?? [],
  };
}

export function achievement(
  title: string,
  organization: string,
  options: Partial<
    Omit<Achievement, "title" | "organization">
  > = {},
): Achievement {
  return {
    title,
    organization,
    year: options.year ?? "",
    description: options.description ?? "",
  };
}

export function capability(
  id: string,
  name: string,
  description: string,
  options: Partial<Omit<Capability, "id" | "name" | "description">> = {},
): Capability {
  return {
    id, name, description,
    icon: options.icon,
    skills: options.skills ?? [],
    projectIds: options.projectIds ?? [],
    experienceLevel: options.experienceLevel,
    technicalNotes: options.technicalNotes ?? [],
  };
}

export function interest(
  id: string,
  title: string,
  summary: string,
  options: Partial<Omit<PersonalInterest, "id" | "title" | "summary">> = {},
): PersonalInterest {
  return {
    id, title, summary,
    icon: options.icon,
    introduction: options.introduction ?? summary,
    background: options.background ?? "",
    activities: options.activities ?? [],
    sections: options.sections ?? [],
    notes: options.notes ?? [],
    images: options.images ?? [],
    links: options.links ?? [],
  };
}

export function blogPost(
  slug: string,
  title: string,
  options: Partial<Omit<BlogPost, "slug" | "title">> = {},
): BlogPost {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Blog slugs must use lowercase words separated by hyphens.");
  }
  if (options.status === "published") {
    const date = options.publicationDate ?? "";
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!title.trim() || !options.content?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)
      || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      throw new Error("Published blog posts require a title, article content, and a valid YYYY-MM-DD publication date.");
    }
  }
  return {
    slug,
    title,
    publicationDate: options.publicationDate ?? "",
    cover: options.cover,
    excerpt: options.excerpt ?? "",
    content: options.content ?? "",
    tags: options.tags ?? [],
    status: options.status ?? "draft",
  };
}

/* ==========================================================
   PERSONAL INFORMATION
   ========================================================== */

// Fill optional fields and lists below to display them on the website.
export const profile = {
  name: "Aayan Baig",
  welcome: "My name is Aayan Baig. Welcome to my corner of the internet!",
  title: "",
  location: "Mumbai, India",
  birthDate: "2009-10-26",
  timeZone: "Asia/Kolkata",
  programmingSince: 2016,

  bio: "I'm Aayan Baig, a student and independent developer based in Mumbai, India. I founded Novoken, an independent technology initiative. I've been programming since 2016, starting with small experiments and gradually exploring how more complex software and computer systems work.",

  interests: [] as string[],

  email: "",

  links: [] as Link[],
};

/* ==========================================================
   ABOUT
   ========================================================== */

// Configure a local portrait with image("assets/your-photo.jpg", "caption").
// Only supplied technologies are listed. Supporting project IDs and experience levels remain optional.
export const about: AboutContent = {
  greeting: "Hey, I'm Aayan!",
  // {age} is rendered as the live age control with its birthday tooltip.
  introduction: "I'm {age}, from Mumbai, India, and I spend a rather unreasonable amount of time around computers. I've always enjoyed making things, taking them apart (sometimes metaphorically), and figuring out why they work the way they do.\n\nWhen I'm not programming, I'm probably doing something involving music, aviation, or motorsport. This website is where I've put together the things I build, the ideas I explore, and a little bit of everything else.",
  portrait: image(""),
  portraitLabel: "Portrait",
  portraitPlaceholder: "Portrait to be added",
  birthdayWish: "Wish me on {birthday}!",
  history: section("How It Started", "I started programming in 2016, mostly because I was curious about what I could make a computer do. Back then, it was about writing small programs, experimenting with things I didn't fully understand, and seeing what happened when I changed something.\n\nEventually, making things work wasn't enough. I wanted to know why they worked. I began paying more attention to what happened behind the applications I was building, from how software communicated with hardware to how entire systems were put together.\n\nThat curiosity has taken me through different programming languages, applications, operating systems, and research. I still find myself going down rabbit holes over questions that probably started as something much simpler.\n\nI don't think there's a particular point where I'll consider myself finished learning. There's always something else worth figuring out."),
  capabilitiesTitle: "What I Do",
  capabilitiesIntroduction: "",
  capabilities: [
    capability("software", "Programming & Software Engineering", "I've worked with quite a few programming languages over the years, including Python, JavaScript, TypeScript, C, C++, Rust, Assembly, and Dart. I enjoy writing software, but also figuring out how to structure it properly, debug difficult problems, and make things reliable rather than just functional.", { icon: "programs", skills: ["Python", "JavaScript", "TypeScript", "C", "C++", "Rust", "Assembly", "Dart"] }),
    capability("systems", "Systems & Low-Level Computing", "I'm particularly interested in what happens underneath the applications we use every day. That includes operating systems, memory management, scheduling, concurrency, and how software communicates with hardware. I enjoy working at a level where even a small mistake can have consequences throughout an entire system.", { icon: "drive" }),
    capability("applications", "Web & Mobile Development", "I build websites, web applications, mobile applications, and the backend services that support them. I've worked with React, Node.js, Flutter, Dart, HTML, CSS, and TypeScript, alongside APIs, authentication, and database integration. I enjoy both the engineering behind an application and the experience of actually using it.", { icon: "network", skills: ["HTML", "CSS", "React", "Node.js", "Flutter"] }),
    capability("infrastructure", "Cloud, Infrastructure & Databases", "I've worked with AWS, Docker, Git, and PostgreSQL, including deploying applications, connecting services, managing data, and dealing with the infrastructure that keeps software running. Building something is one challenge; making it work reliably outside your own computer is another.", { icon: "text", skills: ["AWS", "Docker", "Git", "PostgreSQL"] }),
    capability("ai", "AI, Computer Vision & Data", "I've explored AI systems, computer vision, image processing, and data analysis. I'm interested in using these technologies to solve actual problems, but also in understanding their limitations, measuring their performance, and deciding whether they're the right approach in the first place.", { icon: "image" }),
    capability("hardware", "Hardware, Electronics & Research", "I've experimented with electronics, microcontrollers, and software that interacts with physical devices. I also enjoy research involving algorithms, mathematics, and computing systems, particularly when an idea needs to be tested rather than simply assumed to work.", { icon: "computer" }),
  ],
  outsideTitle: "Outside Computing",
  // Photos can be added with images: [image("assets/your-photo.jpg", "caption")].
  // The same entries supply the About links and dedicated interest pages.
  interests: [
    interest("music", "Music", "I have perfect pitch and have been playing guitar for approximately ten years.", {
      icon: "audio",
      notes: [section("Arrangements and keyboards", "I'm interested in musical arrangements and MIDI keyboards.")],
    }),
    interest("aviation", "Aviation", "I'm an aviation enthusiast with flight simulation experience in Microsoft Flight Simulator, X-Plane, and VATSIM.", {
      icon: "network",
      introduction: "I'm an aviation enthusiast with a strong interest in flight simulation.",
      activities: [section("Flight simulation", "I have experience with Microsoft Flight Simulator, X-Plane, and VATSIM.")],
    }),
    interest("motorsport", "Motorsport", "I'm interested in motorsport and racing.", {
      icon: "image",
    }),
  ],
  additionalInterestsTitle: "Further Interests",
  closing: section("Still Exploring", "I like learning by building things, questioning how they work, and seeing where an idea takes me. There's always something new I want to understand, whether it's a piece of software, a technical problem, or something completely unrelated to computing."),
};

/* ==========================================================
   PROJECTS
   ========================================================== */

// Project names are placeholders. Add optional details using project() options.
export const projects: Project[] = [
  project("bluemoon", "BlueMoon", { featured: true }),
  project("scudio", "Scudio", { featured: true }),
  project("transsched", "TransSched", { featured: true }),
  project("lunar", "Lunar"),
  project("nselivescanner", "Stock Scanner"),
];

/* ==========================================================
   EXPERIENCE
   ========================================================== */

export const experiences: Experience[] = [];

/* ==========================================================
   EDUCATION
   ========================================================== */

export const educationHistory: Education[] = [];

/* ==========================================================
   ACHIEVEMENTS
   ========================================================== */

export const achievements: Achievement[] = [];

/* ==========================================================
   DOCUMENTS
   ========================================================== */

export const documents: Link[] = [];

/* ==========================================================
   RESEARCH
   ========================================================== */

// Set a project category to "Research" to include it here.
export const research: Project[] = projects.filter(
  (item) => item.category === "Research",
);

/* ==========================================================
   BLOG
   ========================================================== */

// Add inline blogPost("slug", "Title", { ... }) calls here.
// Use literal values, including status: "published" and publicationDate: "YYYY-MM-DD".
// Posts default to draft. Vite removes draft entries before bundling or serving.
// content is plain text; separate paragraphs with a blank line.
export const blogPosts: BlogPost[] = [];
