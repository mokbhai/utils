// User info object
const userInfo = {
  name: "Mokshit Jain",
  title: "Software Developer, IOT engineer",
  email: "mokshitjain18@gmail.com",
  phone: "+91-7000209021",
  school: "Lovely Professional University",
  work: "Software Developer, IOT engineer",
  interest: "AI/ML, Full-stack Development, IOT",
  regNo: "12221263",
  address: "LPU, Punjab, IN",
  linkedin: "linkedin.com/in/mokshit-jain",
  github: "github.com/mokbhai",
  website: "mokshitjain.netlify.app",
  bio: "Results-driven computer science student graduating 2026. Delivered 2+ AI/ML projects & 5+ full-stack applications with focus on scalable architecture and real-time performance. Looking forward to contribute as AI/ML engineer at a startup.",
  skills: [
    "TypeScript",
    "JavaScript",
    "C++",
    "Node.js",
    "Git",
    "Docker",
    "Server Management",
    "Nest.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "NextJS",
    "Astro.js",
    "React.js",
    "HTML",
    "TailwindCSS",
    "Redis",
    "AWS",
    "ESP32",
    "Arduino",
    "ESP8266",
  ],
  languages: ["English", "Hindi"],
  projects: [
    {
      name: "AutoTube",
      description:
        "AI-Powered Text-to-Video Content Generator using Python, FFmpeg, Edge_tts, Selenium, Googletranslator",
      link: "https://github.com/mokbhai",
    },
    {
      name: "Hireza",
      description:
        "AI-powered job matching platform with MERN Stack and OpenAI API",
      link: "https://github.com/ApexUnifier/Backend-Inotek",
    },
    {
      name: "Thrombocizer",
      description:
        "Real-time exercising hardware prototype for patients using ESP32",
      link: "https://github.com/mokbhai",
    },
    {
      name: "ANPR System",
      description: "Vehicle management system with license plate recognition",
      link: "https://github.com/mokbhai/SiddhCoder/tree/main/Python/anpr",
    },
    {
      name: "WhatsApp Bot",
      description:
        "Automated registration system with payment integration and messaging APIs",
      link: "https://github.com/mokbhai/utils/blob/main/wwebjs-bot",
    },
  ],
  achievements: [
    "Secured 1st position in CipherThon hackathon for developing Hireza",
    "Finalist for Medha 2024 Hackathon with Thrombocizer Device National Level",
  ],
  certifications: [
    "Complete Machine Learning & Data Science Program GFG (Feb 2025 - continued)",
    "Generative AI: Introduction and Applications Coursera (Feb 2024)",
  ],
};

// Function to get user information
function getUserInfo(infoType) {
  return userInfo[infoType] || "I don't have that information.";
}

module.exports = getUserInfo;
