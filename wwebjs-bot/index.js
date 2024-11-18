const express = require("express");
const { sendMessageToNumber } = require("./main");

const app = express();

const PORT = 4002;

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/send-message", async (req, res) => {
  console.log("requesting message");
  let { number, message } = req.body;

  try {
    // Remove spaces
    number = number.replace(/\s/g, "");

    // Remove leading plus sign
    if (number.startsWith("+")) {
      number = number.slice(1);
    }

    // Handle country code 91
    if (number.length === 12 && number.startsWith("91")) {
      number = number.slice(2);
    }

    // Validate number - Assuming 10 digit number for this example
    if (!/^\d{10}$/.test(number)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid number format" });
    }

    await sendMessageToNumber("91" + number + "@c.us", message);
    console.log("Message sent to ", number);
    res.status(200).json({ status: true, message: "Message sent" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ status: false, message: "Failed to send message" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
