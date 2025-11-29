const { NlpManager } = require("node-nlp");
const vulgarWords = require("./vlurgor.js");

const manager = new NlpManager({ languages: ["en"] });

function addDocumentsAndAnswers() {
  vulgarWords.forEach((vulgarWord) =>
    manager.addDocument("en", vulgarWord, "vulgarWords")
  );
  const vulgarAnswer = [
    "Mind your language.",
    "Please speak respectfully.",
    "Let's keep the conversation civil.",
    "I prefer not to use such language.",
    "Can we keep it polite, please?",
    "Let's use kind words.",
    "There's no need for that kind of language.",
    "Let's keep it friendly.",
    "Please refrain from using offensive language.",
    "Let's keep our conversation respectful.",
  ];
  vulgarAnswer.forEach((ans) => manager.addAnswer("en", "vulgarWords", ans));

  const greetings = [
    "hi",
    "hey",
    "holla",
    "hello",
    "howdy",
    "good morning",
    "good afternoon",
    "good evening",
    "greetings",
    "what's up",
    "yo",
    "hiya",
    "how's it going",
    "how are you",
    "sup",
    "hey there",
    "hi there",
    "hello there",
    "good day",
    "salutations",
  ];
  greetings.forEach((greeting) =>
    manager.addDocument("en", greeting, "greetings")
  );
  const greetingsAnswer = [
    "Hi! How can I help you?",
    "Hello there!",
    "Hey! What's up?",
    "Greetings!",
    "Hey there! How can I assist you?",
    "Hi! What can I do for you today?",
    "Hello! How's it going?",
    "Hey! How are you doing?",
    "Hi! Hope you're having a great day!",
    "Hello! What brings you here?",
    "Hey! Nice to meet you!",
    "Hi! What brings you here?",
    "Hello! How can I assist you?",
    "Hi! How can I assist you?",
  ];
  greetingsAnswer.forEach((ans) => manager.addAnswer("en", "greetings", ans));

  const wellBeing = [
    "how are you",
    "how's it going",
    "how are things",
    "how do you do",
  ];
  wellBeing.forEach((greeting) =>
    manager.addDocument("en", greeting, "wellBeing")
  );
  const wellBeingAnswer = [
    "I'm doing well, thank you! How about you?",
    "I'm great, thanks for asking!",
    "All good here, how are you?",
  ];
  wellBeingAnswer.forEach((ans) => manager.addAnswer("en", "wellBeing", ans));

  const fileRequests = [
    "Can I have the techsprint registrations?",
    "I need the registrations",
    "registrations for techsprint",
    "latest registrations",
    "techsprint",
    "Could you get me the latest data sheet?",
    "tech sprint",
    "sprint registrations",
    "excel file for techsprint",
  ];
  fileRequests.forEach((request) =>
    manager.addDocument("en", request, "request_file")
  );
  manager.addAnswer("en", "request_file", "Here's the requested file: ");

  const infoRequests = [
    "who are you?",
    "What is your name?",
    "Tell me your email address.",
    "What are your hobbies?",
    "What are your interests?",
    "Tell me your phone number",
    "What's your full name?",
    "How can I contact you?",
    "What do you do?",
    "Where do you study?",
    "What is your occupation?",
    "What is your role?",
    "Can you share your contact details?",
    "What university do you attend?",
    "What are your favorite activities?",
    "What do you enjoy doing?",
    "What is your job title?",
    "Where do you work?",
    "What is your professional background?",
    "What is your educational background?",
    "What is your address?",
    "Where do you live?",
    "Can you share your LinkedIn profile?",
    "What is your GitHub username?",
    "Tell me about yourself.",
    "What skills do you have?",
    "What languages do you speak?",
    "What projects have you worked on?",
    "Can you tell me about your projects?",
    "What is your bio?",
    "What is your registration number?",
    "registration no.",
    "reg no.",
    "What is your registration number lpu?",
    "What is your registration no?",
    "Describe your professional experience.",
  ];
  infoRequests.forEach((request) =>
    manager.addDocument("en", request, "my_info")
  );
}

async function initializeNLP() {
  try {
    const loadedManager = new NlpManager();
    await loadedManager.load("./model.nlp");

    return loadedManager;
  } catch (error) {
    console.error("Error loading the model:", error);
  }
}

async function trainNLP() {
  addDocumentsAndAnswers();
  await manager.train();
  manager.save();
}

trainNLP();

module.exports = initializeNLP;
