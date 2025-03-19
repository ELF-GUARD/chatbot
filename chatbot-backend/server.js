const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Chatbot API
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
});

// Text-to-Speech API
app.post("/speak", async (req, res) => {
    try {
        const { text } = req.body;

        const response = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${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}`
            },
            body: JSON.stringify({
                model: "tts-1",
                input: text,
                voice: "alloy" // Choose from alloy, echo, fable, onyx, nova, or shimmer
            })
        });

        const audioBuffer = await response.arrayBuffer();
        res.set("Content-Type", "audio/mpeg");
        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
