const { dockStart } = require("@nlpjs/basic");

async function initializeNLP() {
  const dock = await dockStart({ use: ["Basic"] });
  const manager = dock.get("nlp");
  manager.addLanguage("en");

  // Add greetings
  manager.addDocument("en", "hi", "greetings");
  manager.addDocument("en", "hello", "greetings");
  manager.addDocument("en", "howdy", "greetings");
  manager.addDocument("en", "good morning", "greetings");
  manager.addDocument("en", "good afternoon", "greetings");
  manager.addDocument("en", "good evening", "greetings");
  manager.addAnswer("en", "greetings", "Hello there!");
  manager.addAnswer("en", "greetings", "Hi! How can I help you?");

  // Add file requests
  manager.addDocument(
    "en",
    "Can I have the techsprint registrations?",
    "request_file"
  );
  manager.addDocument("en", "I need the registrations", "request_file");
  manager.addDocument("en", "registrations for techsprint", "request_file");
  manager.addDocument("en", "latest registrations", "request_file");
  manager.addDocument("en", "techsprint", "request_file");
  manager.addDocument(
    "en",
    "Could you get me the latest data sheet?",
    "request_file"
  );
  manager.addAnswer("en", "request_file", "Here's the file you requested.");
  manager.addAnswer(
    "en",
    "request_file",
    "The file you requested is available."
  );

  // Train the model
  await manager.train();

  return manager;
}

module.exports = initializeNLP;
