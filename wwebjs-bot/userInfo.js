// User info object
const userInfo = {
  name: "Mokshit Jain",
  email: "mokshitjain18@gmail.com",
  school: "Lovely Professional University",
  phone: "+91 9103367481",
  work: "student",
  interest: "Coding and Developing",
  regNo: "12221263",
  address: "B416, Bh1, LPU, Jalandhar, Punjab",
  linkedin: "https://www.linkedin.com/in/mokshit-jain/",
  github: "https://github.com/mokbhai",
  bio: "Aspiring software developer with a passion for coding and technology.",
  skills: ["JavaScript", "Node.js", "React", "SQL", "MongoDB", "Python"],
  languages: ["English", "Hindi"],
  projects: [
    {
      name: "Techsprint",
      description: "A web application for event management.",
      link: "https://techsprint.lpu.in",
    },
    {
      name: "Swift",
      description: "A web app for emergency ambulance calling",
      link: "https://swiftaid.vercel.app/",
    },
    {
      name: "Book Management Backend",
      description:
        "This application is designed to manage books and users, track transactions, and provide various functionalities such as issuing and returning books, searching for books, and generating reports.",
      link: "https://book-managment-pi.vercel.app/",
    },
  ],
};

// Function to get user information
function getUserInfo(infoType) {
  return userInfo[infoType] || "I don't have that information.";
}

module.exports = getUserInfo;
