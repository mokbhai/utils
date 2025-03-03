# WhatsApp Web.js Bot

A Node.js-based WhatsApp bot that provides automated messaging capabilities using the WhatsApp Web API. This bot includes natural language processing (NLP) capabilities and can be controlled via a REST API.

## Features

- WhatsApp Web integration using `whatsapp-web.js`
- Natural Language Processing capabilities using `@nlpjs/basic` and `compromise`
- REST API endpoint for sending messages
- Scheduled message capabilities using `node-schedule`
- CSV parsing support
- Express.js server for API endpoints
- Automated responses to user queries using NLP
- Intelligent message handling and context awareness
- Advanced AI-powered responses using Google's Gemini API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A WhatsApp account
- Google Gemini API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mokbhai/utils/
cd utils/wwebjs-bot
```

2. Install dependencies:

```bash
npm install
```

## Usage

1. Start the server:

```bash
npm start
```

2. The server will start on port 4002. You'll need to scan the QR code that appears in the terminal to authenticate your WhatsApp account.

3. Once authenticated, you can send messages using the API endpoint:

```bash
curl -X POST http://localhost:4002/send-message \
  -H "Content-Type: application/json" \
  -d '{"number": "1234567890", "message": "Hello, World!"}'
```

The main bot provides the following features:

- Automated responses to user queries
- Scheduled message sending at specific times (11:00 AM and 5:00 PM)
- File sharing capabilities (CSV files)
- Registration count tracking and reporting
- User information handling
- Content moderation

## API Endpoints

### POST /send-message

Send a message to a specific WhatsApp number.

Request body:

```json
{
  "number": "1234567890",
  "message": "Your message here"
}
```

Response:

```json
{
  "status": true,
  "message": "Message sent"
}
```

## Query Response System

The bot is equipped with a Natural Language Processing system that allows it to understand and respond to user queries. It can:

- Process incoming messages using NLP
- Understand context and intent of user messages
- Provide relevant responses based on the query
- Handle multiple types of queries and conversations
- Maintain conversation context

The bot uses a combination of `@nlpjs/basic` and `compromise` libraries to provide intelligent responses to user messages. The NLP model is trained to understand various types of queries and can be further customized based on specific use cases.

## Model Training

The bot uses a custom-trained NLP model for understanding and responding to queries. Here's how to train or update the model:

1. The model data is stored in `model.nlp` file
2. To train the model, you can use the following format in your training data:

```javascript
// Example training data format
{
  "intent": "my_info",
  "utterances": [
    "what is your name",
    "tell me your name",
    "who are you",
    "what's your full name"
  ],
  "answers": [
    "My name is [name]",
    "I am [name]"
  ]
}
```

3. Key components for training:

   - `intent`: The purpose or category of the query
   - `utterances`: Different ways users might ask the same question
   - `answers`: Possible responses to the query

4. After updating the training data:

   - The model will automatically retrain when the bot starts
   - New intents and responses will be available for user queries

5. Common intents in the current model:
   - `my_info`: For personal information queries
   - `request_file`: For file sharing requests
   - `help`: For help and instruction requests

Note: The model uses both rule-based and machine learning approaches to provide accurate responses. Regular updates to the training data can improve response accuracy.

## Project Structure

- `index.js` - Main entry point and API server setup
- `main.js` - Core WhatsApp bot functionality
- `nlpModel.js` - Natural Language Processing model configuration
- `nlp2.js` - Additional NLP functionality
- `userInfo.js` - User information management
- `vlurgor.js` - Additional bot functionality
- `model.nlp` - Trained NLP model data
