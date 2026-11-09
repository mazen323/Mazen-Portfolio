/**
 * Single source of truth for portfolio content.
 * Everything here mirrors Mazen_Ahmed_Awad_Frontend_Developer_CV.pdf —
 * update the CV and this file together.
 */
import cvPdf from "../Assets/Mazen_Ahmed_Awad_Frontend_Developer_CV.pdf";

import spcImg from "../Assets/Projects/spc.webp";
import crocoitImg from "../Assets/Projects/crocoit.webp";
import almasryImg from "../Assets/Projects/almasry.webp";
import alsannatImg from "../Assets/Projects/alsannat.webp";
import etlalaImg from "../Assets/Projects/etlala.webp";

import yummyImg from "../Assets/Projects/yummy.webp";
import bookStoreImg from "../Assets/Projects/bookStoreImg.webp";
import gameOverImg from "../Assets/Projects/gameOverImg.webp";
import quizAppImg from "../Assets/Projects/quizAppImg.webp";
import weatherImg from "../Assets/Projects/weatherImg.webp";
import crudsImg from "../Assets/Projects/crudsImg.webp";

export const CV_FILE = cvPdf;
export const CV_FILE_NAME = "Mazen_Ahmed_Awad_Frontend_Developer_CV.pdf";

export const PROFILE = {
  name: "Mazen Ahmed",
  fullName: "Mazen Ahmed Awad",
  role: "Front-End Developer",
  focus: "React.js · Next.js · Magento 2",
  location: "Cairo, Egypt",
  email: "mazen.ahmed.dev@gmail.com",
  phone: "+20 102 069 3800",
  phoneHref: "tel:+201020693800",
  github: "https://github.com/mazen323",
  linkedin: "https://www.linkedin.com/in/mazen-elbardan-364061250/",
  company: "CrocoIT",
  summary:
    "Front-End Developer with 2+ years of experience building e-commerce and education applications with React.js, Next.js and Magento 2. I deliver Progressive Web Apps, server-side rendering and GraphQL/REST integrations with responsive, mobile-first design.",
  summary2:
    "I own user-flow and UX design when there's no dedicated designer, and I take every release through to production deployment.",
};

export const STATS = [
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 5, suffix: "", label: "Apps live in production" },
  { value: 98, suffix: "", label: "Top Lighthouse score" },
];

export const PILLARS = [
  {
    key: "perf",
    title: "Performance-first",
    text: "Server-side rendering, static generation and lean bundles — production apps score 95–98 on mobile Lighthouse performance.",
  },
  {
    key: "commerce",
    title: "E-commerce at scale",
    text: "Magento 2 storefronts and Progressive Web Apps with offline support, push notifications and GraphQL data layers.",
  },
  {
    key: "ux",
    title: "UX ownership",
    text: "I map user flows and turn them into responsive, accessible, production-ready interfaces — no designer required.",
  },
];

export const JOB = {
  title: "Front-End Developer",
  company: "CrocoIT",
  location: "Cairo, Egypt",
  period: "May 2024 — Present",
  points: [
    "Built 5 front-end applications across e-commerce, education and corporate websites — all live in production — using React.js, Next.js and Magento 2.",
    "Own production deployment and front-end server management for all of them.",
    "Own UX across projects in the absence of a dedicated UI/UX designer, mapping user flows and turning them into responsive, production-ready interfaces.",
  ],
};

/**
 * Client work — mobile Lighthouse scores.
 * Performance: launch audits as stated in the CV (Etlala has none: theme work only).
 * Accessibility / SEO / Best Practices: measured on the live sites with
 * Lighthouse 12 (mobile, 2 runs each, identical results), Nov 2026.
 * CrocoIT's four scores are all from the CV.
 */
export const CASE_STUDIES = [
  {
    id: "spc",
    name: "SPC Online Academy",
    category: "Education · Medical courses",
    url: "https://online.spc-eg.com/en",
    domain: "online.spc-eg.com",
    image: spcImg,
    stack: ["Next.js", "React.js", "REST APIs", "SSR"],
    summary:
      "A scalable medical-course platform — component library and page architecture built from scratch.",
    points: [
      "Launched the platform by building its Next.js component library and page architecture from scratch.",
      "Hit 95/100 mobile Lighthouse performance (1.1s LCP, 0 CLS) with server-side rendering, strengthening SEO.",
      "Integrated REST APIs with complete loading, empty and error-state handling on every data-driven screen.",
      "Shipped production-ready releases alongside backend developers across the full delivery cycle.",
    ],
    lighthouse: [
      { label: "Performance", score: 95 },
      { label: "Accessibility", score: 95 },
      { label: "SEO", score: 92 },
      { label: "Best Practices", score: 100 },
    ],
    vitals: [
      { label: "LCP", value: "1.1s" },
      { label: "CLS", value: "0" },
    ],
  },
  {
    id: "crocoit",
    name: "CrocoIT Company Website",
    category: "Corporate · Bilingual EN/AR",
    url: "https://crocoit.com",
    domain: "crocoit.com",
    image: crocoitImg,
    stack: ["Next.js 16", "React", "Tailwind CSS"],
    summary:
      "Bilingual (English/Arabic) corporate site covering services, case studies, products and blog.",
    points: [
      "Developed a bilingual English/Arabic corporate website with Next.js 16 and Tailwind CSS.",
      "Scored 98 Performance and 100 in Accessibility, SEO and Best Practices on mobile using static generation, Priority Hints and Open Graph metadata.",
    ],
    lighthouse: [
      { label: "Performance", score: 98 },
      { label: "Accessibility", score: 100 },
      { label: "SEO", score: 100 },
      { label: "Best Practices", score: 100 },
    ],
  },
  {
    id: "almasry",
    name: "Almasry Pharmacy",
    category: "E-commerce · Pharmacy PWA",
    url: "https://almasrypharmacy.com",
    domain: "almasrypharmacy.com",
    image: almasryImg,
    stack: ["Magento 2", "React.js", "PWA"],
    summary:
      "Pharmacy storefront as a Progressive Web App with offline support and push notifications.",
    points: [
      "Developed a PWA with offline support and push notifications to drive repeat customer engagement.",
      "Built responsive catalog, cart and checkout flows in React.js with centralized state management.",
      "Reached 98/100 mobile Lighthouse performance through page-load optimization and mobile-first design.",
    ],
    lighthouse: [
      { label: "Performance", score: 98 },
      { label: "Accessibility", score: 82 },
      { label: "SEO", score: 92 },
      { label: "Best Practices", score: 75 },
    ],
  },
  {
    id: "alsannat",
    name: "Alsannat for Luggage",
    category: "E-commerce · Magento PWA",
    url: "https://alsannat.com",
    domain: "alsannat.com",
    image: alsannatImg,
    stack: ["Magento 2", "React.js", "GraphQL"],
    summary:
      "Scalable Magento 2 storefront delivered as a Progressive Web App.",
    points: [
      "Delivered a scalable Magento 2 storefront as a PWA with a 96/100 mobile Lighthouse performance score.",
      "Reduced redundant network requests by integrating GraphQL APIs and optimizing client-side state.",
      "Standardized UI across browsers and breakpoints by fixing cross-browser and cross-device issues.",
    ],
    lighthouse: [
      { label: "Performance", score: 96 },
      { label: "Accessibility", score: 93 },
      { label: "SEO", score: 100 },
      { label: "Best Practices", score: 57 },
    ],
  },
  {
    id: "etlala",
    name: "Etlala",
    category: "E-commerce · Fashion",
    url: "https://etlala.sa",
    domain: "etlala.sa",
    image: etlalaImg,
    stack: ["Magento 2", "GraphQL"],
    summary:
      "Custom Magento 2 storefront themes tailored to the brand's identity.",
    perfNote: "My scope here was the storefront theme and the GraphQL integration, so I don't claim the performance score.",
    points: [
      "Customized Magento 2 storefront themes to match brand identity and UX requirements.",
      "Integrated GraphQL data fetching in close collaboration with backend developers.",
    ],
    lighthouse: [
      { label: "Accessibility", score: 84 },
      { label: "SEO", score: 100 },
      { label: "Best Practices", score: 89 },
    ],
  },
];

export const SIDE_PROJECTS = [
  {
    name: "Yummy",
    text: "Meal & recipe explorer for global cuisines, powered by a public API.",
    stack: ["JavaScript", "jQuery", "Bootstrap 5"],
    image: yummyImg,
    repo: "https://github.com/mazen323/yummy-project",
    demo: "https://mazen323.github.io/yummy-project/",
  },
  {
    name: "Game Over",
    text: "Catalogue of the best free-to-play and MMO games in one place.",
    stack: ["JavaScript", "jQuery", "Bootstrap 5"],
    image: gameOverImg,
    repo: "https://github.com/mazen323/Game-over",
    demo: "https://mazen323.github.io/Game-over/",
  },
  {
    name: "Book Store",
    text: "Book shop with login and registration flows.",
    stack: ["JavaScript", "HTML5", "CSS3"],
    image: bookStoreImg,
    repo: "https://github.com/mazen323/Book-store",
    demo: "https://mazen323.github.io/Book-store/",
  },
  {
    name: "Quiz App",
    text: "Configurable quiz with question types, counts and result summaries.",
    stack: ["JavaScript", "RegEx", "Bootstrap 5"],
    image: quizAppImg,
    repo: "https://github.com/mazen323/Quiz",
    demo: "https://mazen323.github.io/Quiz/",
  },
  {
    name: "Weather",
    text: "Live forecast page with geolocation support.",
    stack: ["JavaScript", "REST API", "Bootstrap 5"],
    image: weatherImg,
    repo: "https://github.com/mazen323/weather-App",
    demo: "https://mazen323.github.io/weather-App/",
  },
  {
    name: "CRUDS System",
    text: "Create, read, update, delete and search records in the browser.",
    stack: ["JavaScript", "HTML5", "CSS3"],
    image: crudsImg,
    repo: "https://github.com/mazen323/CRUD-Syestem",
    demo: "https://mazen323.github.io/CRUD-Syestem/",
  },
];

export const SKILL_GROUPS = [
  {
    key: "lang",
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"],
  },
  {
    key: "fw",
    title: "Frameworks & Libraries",
    items: ["React.js", "Next.js", "Redux", "Tailwind CSS", "jQuery", "Bootstrap"],
  },
  {
    key: "ecom",
    title: "E-Commerce",
    items: ["Magento 2", "PWA Studio", "Progressive Web Apps"],
  },
  {
    key: "api",
    title: "APIs & Data",
    items: ["GraphQL", "RESTful APIs", "MySQL", "SQL Server"],
  },
  {
    key: "tools",
    title: "Tools & Delivery",
    items: ["Git", "GitHub", "npm", "Figma", "Production Deployment", "Server Management"],
  },
  {
    key: "practice",
    title: "Practices",
    items: [
      "Server-Side Rendering",
      "User Flow & UX Design",
      "Responsive & Mobile-First",
      "Cross-Browser Compatibility",
      "Web Performance",
      "Web Accessibility",
      "SEO",
      "Agile Collaboration",
    ],
  },
];

export const EDUCATION = {
  degree: "B.Sc. in Computer Science",
  school: "Future Academy — Higher Future Institute for Specialized Technological Studies",
  period: "2018 — 2022",
  details: ["GPA 3.22", "Graduation Project: A"],
};

export const CERTIFICATIONS = [
  { title: "Full Stack Developer Course", issuer: "Route Academy" },
  { title: "Front-End React.js Course", issuer: "Eraasoft Academy" },
  {
    title: "MTA: Software Development Fundamentals",
    issuer: "Microsoft",
  },
  {
    title: "MTA: Introduction to Programming using Java",
    issuer: "Microsoft",
  },
];

export const LANGUAGES = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Conversational" },
];

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];
