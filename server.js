require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve index.html and other files from the same folder

const GROQ_KEY = process.env.GROQ_KEY;

app.get('/api/get-key', (req, res) => {
  // In production: read from environment variable only
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "Server configuration error" });
  }
  res.json({ apiKey: key });
  // OR just: res.send(key);  // if client expects plain text
});

app.post('/pray', async (req, res) => {
    try {
        const { petition } = req.body;

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
                    content: "You are Intercessor AI. Write a rich, long (300+ words), passionate African American Baptist style prayer. Variously address Divine presence using different names (e.g., Jehovah-Jireh, EL-Shaddai, Prince of Peace, Great I AM, etc.). Avoid starting every prayer with 'Dear Heavenly Father'. Use the petition twice then expand it. End with AMEN + Hallelujah. Then add exactly: RELATED BIBLE VERSE: [fresh relevant verse with reference]"
                }, {
                    role: "user",
                    content: `Generate a powerful prayer for this request: "${petition}"`
                }],
                temperature: 1.1,
                max_tokens: 1500
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Groq API Error:", response.status, data);
            return res.status(response.status).json({ error: "Groq API returned an error", details: data });
        }

        if (!data.choices || data.choices.length === 0) {
            console.error("Groq API returned no choices:", data);
            return res.status(500).json({ error: "Invalid response from Groq API" });
        }

        const full = data.choices[0].message.content;

        const [prayer, verse] = full.split("RELATED BIBLE VERSE:");

        res.json({
            prayer: prayer || full,
            verse: verse || "Isaiah 41:10 – Fear not, for I am with you."
        });

    } catch (err) {
        console.error("Error generating prayer:", err);
        res.status(500).json({ prayer: "Prayer could not be generated at this time. Please try again." });
    }
});

// Add a simple health check or root route if static fails
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy running safely on port ${PORT}`));