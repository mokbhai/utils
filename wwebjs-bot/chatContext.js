// Chat context management
class ChatContext {
  constructor() {
    this.contexts = new Map();
    this.maxHistory = 5; // Keep last 5 messages for context
  }

  // Add a message to the context
  addMessage(userId, message, isUser = true) {
    if (!this.contexts.has(userId)) {
      this.contexts.set(userId, []);
    }

    const userContext = this.contexts.get(userId);
    userContext.push({
      message,
      isUser,
      timestamp: new Date(),
    });

    // Keep only the last maxHistory messages
    if (userContext.length > this.maxHistory) {
      userContext.shift();
    }
  }

  // Get context for a user
  getContext(userId) {
    return this.contexts.get(userId) || [];
  }

  // Format context for Gemini prompt
  formatContextForPrompt(userId) {
    const context = this.getContext(userId);
    if (context.length === 0) return "";

    let formattedContext = "Previous conversation:\n";
    context.forEach((msg) => {
      const role = msg.isUser ? "User" : "Assistant";
      formattedContext += `${role}: ${msg.message}\n`;
    });
    formattedContext += "\nCurrent conversation:\n";
    return formattedContext;
  }

  // Clear context for a user
  clearContext(userId) {
    this.contexts.delete(userId);
  }

  // Clear all contexts
  clearAllContexts() {
    this.contexts.clear();
  }
}

module.exports = new ChatContext();
