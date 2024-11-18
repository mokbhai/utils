const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");
const compromise = require("compromise");
const schedule = require("node-schedule");
const initializeNLP = require("./nlp2.js");
const getUserInfo = require("./userInfo.js");
const Papa = require("papaparse");

const scheduledTimes = [11, 17]; // (24-hour format)
const numbers = [
  "917000209021@c.us",
  "916284626764@c.us",
  "919103367481@c.us",
  "919888121794@c.us",
];

// const numbers = ["917000209021@c.us", "919168546881@c.us"];

const instructions = `
Welcome to the TechSprint WhatsApp Bot!

Here are some commands you can use:

* Send "hello" to receive a greeting.
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

      let resMessage = "";
      const nlp = compromise(message.body.toLowerCase());
      const reqMess = message.body.toLowerCase().replace(/\n/g, "").trim();

      if (nlp.has("help") || nlp.has("instruction") || nlp.has("start")) {
        resMessage += instructions;
      }

      const response = await manager.process("en", reqMess);

      if (response.answer) resMessage += response.answer;
      if (response.intent === "my_info") {
        const infoMap = {
          name: "name",
          phone: "phone",
          number: "phone",
          email: "email",
          work: "work",
          occupation: "work",
          role: "work",
          school: "school",
          college: "school",
          university: "school",
          interest: "interest",
          hobbies: "interest",
          "full name": "name",
          contact: "phone",
          "contact details": "phone",
          "how can I contact you": "phone",
          "where do you study": "school",
          "what do you do": "work",
          "where do you work": "work",
          "job title": "work",
          "professional background": "work",
          "educational background": "school",
          "favorite activities": "interest",
          "enjoy doing": "interest",
          address: "address",
          "where do you live": "address",
          linkedin: "linkedin",
          "linkedin profile": "linkedin",
          github: "github",
          "github username": "github",
          bio: "bio",
          "about yourself": "bio",
          skills: "skills",
          "what skills do you have": "skills",
          languages: "languages",
          "what languages do you speak": "languages",
          projects: "projects",
          "tell me about your projects": "projects",
          "project details": "projects",
          "registration number": "regNo",
          "registration no": "regNo",
          "reg no": "regNo",
          regno: "regNo",
        };

        let responses = [];

        for (const key in infoMap) {
          if (response.utterance.toLowerCase().includes(key)) {
            const infoKey = infoMap[key];
            let infoValue = getUserInfo(infoKey);

            if (Array.isArray(infoValue)) {
              infoValue = infoValue.join(", ");
            } else if (typeof infoValue === "object") {
              infoValue = JSON.stringify(infoValue, null, 2);
            }

            responses.push(`My ${key} is ${infoValue}.`);
          }
        }

        if (responses.length !== 0) {
          resMessage += responses.join("\n");
        }
      }

      if (response.intent === "request_file") {
        await client.sendMessage(
          message.from,
          response.answer + automatedMessage
        );
        return await sendFile(message);
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

scheduleMessages();

module.exports = { sendMessageToNumber };
