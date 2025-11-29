const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");
const compromise = require("compromise");
const schedule = require("node-schedule");
const initializeNLP = require("./nlp2.js");
const Papa = require("papaparse");
const { getGeminiResponse } = require("./geminiService");
const chatContext = require("./chatContext");
require("dotenv").config();

const scheduledTimes = [11, 17]; // (24-hour format)
const numbers = ["917000209021@c.us"];

// const numbers = [
// "916284626764@c.us",
// "919103367481@c.us",
// "919888121794@c.us",
// "917000209021@c.us",
// "919168546881@c.us",
// ];

const instructions = `
Welcome to the Mokshit Jain's MokBhaiMJ WhatsApp Bot! 👋

Here are the available commands and features:

1. Basic Commands:
   - "help" or "start" - Show this help message
   - "hello" - Get a greeting

2. Information Queries:
   - Ask about my name, contact, work, education
   - Ask about my skills, projects, or experience
   - Ask about my interests or background

3. Features:
   - Automated responses to your queries
   - Registration file sharing
   - Event registration tracking
   - Content moderation for respectful communication

4. Examples:
   - "What's your name?"
   - "Tell me about your projects"
   - "What skills do you have?"
   - "How can I contact you?"

Note: This is an AI-powered bot that can understand natural language queries. Feel free to ask questions in your own words!
`;

const automatedMessage = "\n\nPlease note: This is an automated bot message.";

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

async function main() {
  const manager = await initializeNLP(); // Await the initialization

  client.on("ready", () => {
    console.log("Client is ready!");
    scheduleMessages();
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("message_create", async (message) => {
    try {
      if (
        message.fromMe ||
        message.from.includes("g.us") ||
        message.from === "919103367481@c.us"
      ) {
        return;
      }

      // Ignore file and image messages
      if (message.hasMedia || message.type === "document") {
        return;
      }

      let resMessage = "";
      const nlp = compromise(message.body.toLowerCase());
      const reqMess = message.body.toLowerCase().replace(/\n/g, "").trim();

      // Only show instructions for help, start, or instruction commands
      if (
        reqMess === "help" ||
        reqMess === "start" ||
        reqMess === "instruction"
      ) {
        return client.sendMessage(
          message.from,
          instructions + automatedMessage
        );
      }

      // // First try NLP processing
      // const response = await manager.process("en", reqMess);

      // // Handle NLP intents first
      // if (response.intent === "request_file") {
      //   await client.sendMessage(
      //     message.from,
      //     response.answer + automatedMessage
      //   );
      //   return await sendFile(message);
      // }

      // // If NLP has an answer, use it
      // if (response.answer) {
      //   resMessage += response.answer;
      // }

      // If no NLP response, try Gemini
      if (!resMessage) {
        const geminiResponse = await getGeminiResponse(reqMess, message.from);
        if (
          geminiResponse &&
          geminiResponse !==
            "I apologize, but I'm having trouble processing your request at the moment."
        ) {
          resMessage += geminiResponse;
        }
      }

      if (resMessage && resMessage !== "") {
        return client.sendMessage(message.from, resMessage + automatedMessage);
      }
    } catch (error) {
      console.error(error);
    }
  });

  client.initialize();
}

main().catch(console.error);

const sendFile = async (message) => {
  try {
    if (numbers.includes(message.from)) {
      const response = await fetch(
        "https://techsprint.lpu.in/api/registration/whatsapp"
      );

      const buffer = await response.buffer();

      // Time
      const now = new Date();

      let options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      let formatter = new Intl.DateTimeFormat([], options);

      const formattedDateTime = formatter.format(now);
      const [dateString, timeString] = formattedDateTime.split(", ");

      const filename = `TS Registrations ${dateString.replace(
        /\//g,
        "-"
      )} ${timeString}.csv`;

      const media = new MessageMedia(
        "text/csv",
        buffer.toString("base64"),
        filename
      );
      const eventCounts = await countRegistrationsAndSendMessage(buffer);
      await client.sendMessage(message.from, media);
      await client.sendMessage(message.from, eventCounts);
    }
  } catch (error) {
    console.error("Error fetching or processing file:", error);
    await client.sendMessage(message.from, "Error fetching file.");
  }
};

const countRegistrationsAndSendMessage = async (buffer) => {
  try {
    const decoder = new TextDecoder();
    const csvText = decoder.decode(buffer);
    const results = Papa.parse(csvText, {
      header: true,
      args: ["--no-sandbox"],
      dynamicTyping: true,
    }); // Parse CSV
    const registrations = results.data;

    const eventCounts = {};

    registrations.forEach((registration) => {
      if (
        registration["Payment Status"] &&
        registration["Payment Status"].toLowerCase() === "completed"
      ) {
        const eventColumns = ["Event 1", "Event 2", "Event 3", "Event 4"];
        eventColumns.forEach((eventColumn) => {
          const eventName = registration[eventColumn];
          if (eventName) {
            eventCounts[eventName] = (eventCounts[eventName] || 0) + 1;
          }
        });
      }
    });

    let messageBody = "Event Registration Counts:\n";
    for (const eventName in eventCounts) {
      messageBody += `${eventName}: ${eventCounts[eventName]}\n`;
    }

    return messageBody;
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

async function sendMessageToSpecificNumber() {
  const message = "Hello Registration File For Today" + automatedMessage;

  try {
    numbers.forEach(async (number) => {
      await client.sendMessage(number, message);
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function sendMessageToNumber(number, message) {
  try {
    await client.sendMessage(number, message + automatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function sendFileToSpecificNumber() {
  try {
    numbers.forEach(async (number) => {
      message = { from: number };
      await sendFile(message);
      console.log("File sent successfully! to ", number);
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

function scheduleMessages() {
  scheduledTimes.forEach((hour) => {
    schedule.scheduleJob({ hour, minute: 0, second: 0 }, () => {
      sendMessageToSpecificNumber();
      sendFileToSpecificNumber();
    });
    schedule.scheduleJob({ hour, minute: 30, second: 0 }, () => {
      sendMessageToSpecificNumber();
      sendFileToSpecificNumber();
    });
  });
}

// scheduleMessages();

module.exports = { sendMessageToNumber };
