const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());

const GROQ_KEY = "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"; // ← Put your NEW key here

app.post('/pray', async (req, res) => {
    const { petition } = req.body;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "system",
                    content: `Write a rich, detailed, passionate prayer of at least 300 words... (same full instructions as before)`
                }, {
                    role: "user",
                    content: `Generate a powerful prayer for: "${petition}"`
                }],
                temperature: 1.1,
                max_tokens: 1400
            })
        });

        const data = await response.json();
        const fullText = data.choices[0].message.content;

        const [prayer, verse] = fullText.split("RELATED BIBLE VERSE:");

        res.json({
            prayer: prayer || fullText,
            verse: verse || "Isaiah 41:10 – Fear not, for I am with you."
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => console.log("✅ Prayer Proxy running on port 3000"));