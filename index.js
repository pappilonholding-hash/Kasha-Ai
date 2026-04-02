const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize with your API Key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    // Correct method: getGenerativeModel
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Say 'System Online' if you can hear me.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("------------------------------");
    console.log("Gemini Response:", text);
    console.log("------------------------------");

  } catch (error) {
    console.error("Critical Error:", error.message);
  }
}

run();