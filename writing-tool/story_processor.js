const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const { models, updateModelStats, getModelStats } = require("./models.js");

const API_KEY = "sk-ad42523786b7462695f9b52e33a159b7";
const API_URL = "http://localhost:9092/api/chat/completions";
const CHUNK_SIZE = 1000;
const OUTPUT_DIR = "processed_stories";
const MAX_RETRIES = 5; // Maximum number of retries with different models
const RATE_LIMIT = {
  chunks: 10, // Number of chunks to process
  time: 5000, // Time window in milliseconds (5 seconds)
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Rate limiter function
async function rateLimiter(chunks) {
  const results = [];
  for (let i = 0; i < chunks.length; i += RATE_LIMIT.chunks) {
    const batch = chunks.slice(i, i + RATE_LIMIT.chunks);
    const batchPromises = batch.map(({ chunk, index, model }) =>
      improveEnglish(chunk, model).then((result) => ({ index, result }))
    );

    console.log(`Processing batch of ${batch.length} chunks...`);
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if (i + RATE_LIMIT.chunks < chunks.length) {
      console.log(
        `Rate limit reached. Waiting ${RATE_LIMIT.time / 1000} seconds...`
      );
      await delay(RATE_LIMIT.time);
    }
  }
  return results;
}

async function readStory(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

function* splitIntoChunks(text) {
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    yield words.slice(i, i + CHUNK_SIZE).join(" ");
  }
}

async function improveEnglish(chunk, model, retryCount = 0) {
  const startTime = Date.now();
  try {
    const response = await axios.post(
      API_URL,
      {
        model: model.id,
        messages: [
          {
            role: "user",
            content: `Please improve the English in this text while maintaining the original meaning only. Do not add any other text or shorten the story: ${chunk}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseTime = Date.now() - startTime;
    updateModelStats(model.id, responseTime);

    let content = response.data.choices[0].message.content;

    const unwantedPhrases = [
      "Here is the rewritten text with improved English:",
      "Here is the rewritten text with improved English while maintaining the original meaning:",
      "(Tranlater took an hour",
      "Note: Some parts of the text",
      "I'm sorry if it's still not good",
      "let me know if I made any errors",
      "Here is the text with improved English:",
      "Here is the text with improved English while maintaining the original meaning:",
    ];

    content = content
      .split("\n")
      .filter(
        (line) => !unwantedPhrases.some((phrase) => line.includes(phrase))
      )
      .join("\n")
      .trim();

    return content;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    updateModelStats(model.id, responseTime, true);

    console.error(
      `Error processing chunk with model ${model.id}:`,
      error.message
    );

    if (retryCount < MAX_RETRIES) {
      const nextModelIndex = (models.indexOf(model) + 1) % models.length;
      const nextModel = models[nextModelIndex];
      console.log(
        `Retrying chunk with model ${nextModel.id} (attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`
      );
      return await improveEnglish(chunk, nextModel, retryCount + 1);
    }

    return chunk;
  }
}

async function processStory(inputFile) {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "");
    const outputFile = path.join(OUTPUT_DIR, `improved_story_${timestamp}.txt`);

    const story = await readStory(inputFile);
    const chunks = Array.from(splitIntoChunks(story));
    console.log(`Processing story in ${chunks.length} chunks...`);

    // Prepare chunks with their metadata
    const chunksWithMetadata = chunks.map((chunk, index) => ({
      chunk,
      index,
      model: models[index % models.length],
    }));

    // Process chunks with rate limiting
    const processedChunks = await rateLimiter(chunksWithMetadata);

    // Sort results by original index
    processedChunks.sort((a, b) => a.index - b.index);

    // Write results in correct order
    const outputStream = await fs.open(outputFile, "w");
    for (const { result } of processedChunks) {
      await outputStream.write(result + "\n\n");
    }
    await outputStream.close();

    // Print performance statistics
    console.log("\nModel Performance Statistics:");
    console.table(getModelStats());

    console.log(`Processing complete. Improved story saved to: ${outputFile}`);
  } catch (error) {
    console.error("Error processing story:", error);
  }
}

// Run the script
const inputFile = "output.txt";
processStory(inputFile);
