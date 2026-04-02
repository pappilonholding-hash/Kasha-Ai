require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const messages = history?.map(h => ({
      role: h.role === "model" ? "assistant" : "user",
      content: h.parts[0].text
    })) || [];

    if (!messages.length || messages[messages.length-1].content !== message) {
      messages.push({ role: "user", content: message });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Wewe ni Kasha AI, msaidizi wa akili bandia kwa Afrika Mashariki. Jibu kwa Kiswahili au Kiingereza kulingana na lugha ya mtumiaji. Saidia na biashara, afya, elimu, kilimo, teknolojia, na serikali." },
          ...messages
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data));

    const text = data?.choices?.[0]?.message?.content 
      || "Samahani, hitilafu imetokea. Jaribu tena.";

    res.json({ reply: text });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Hitilafu ya seva. Jaribu tena." });
  }
});

app.listen(3000, () => console.log("Server is running on http://localhost:3000"));