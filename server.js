require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Allow requests from GitHub Pages and local development
const allowedOrigins = [
    'https://derrickjohnpiper.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
app.use(express.static('.')); // Serve index.html and other files from the same folder

const GROQ_KEY = process.env.GROQ_KEY;

// ─── Rotating Divine Names ────────────────────────────────────────────────────
// 24 unique names of God — cycles through ALL before any name repeats
const DIVINE_NAMES = [
    "Jehovah-Jireh",        // The Lord Our Provider
    "El-Shaddai",           // God Almighty
    "Alpha and Omega",      // The Beginning and the End
    "Jehovah-Rapha",        // The Lord Who Heals
    "Ancient of Days",      // The Eternal One
    "Abba Father",          // Loving, Intimate Father
    "El-Elyon",             // The Most High God
    "Jehovah-Shalom",       // The Lord Our Peace
    "Lion of Judah",        // The Conquering King
    "Jehovah-Nissi",        // The Lord My Banner
    "Wonderful Counselor",  // The All-Wise Guide
    "El-Roi",               // The God Who Sees Me
    "Prince of Peace",      // Sovereign Over All Conflict
    "Jehovah-Tsidkenu",     // The Lord Our Righteousness
    "Rock of Ages",         // The Unshakeable Foundation
    "Bread of Life",        // The Ultimate Sustainer
    "Lord of Hosts",        // Commander of Heaven's Armies
    "Living Water",         // The Source of Eternal Life
    "Jehovah-Raah",         // The Lord My Shepherd
    "Lamb of God",          // The Atoning Sacrifice
    "King of Kings",        // The Supreme Ruler
    "Consuming Fire",       // The Holy, Purifying Presence
    "Great Physician",      // The Healer of Soul and Body
    "Everlasting Father",   // The Timeless, Faithful Parent
];

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Each prayer gets the next name in a shuffled queue.
// When queue is empty, refill and re-shuffle so no name repeats
// until all 24 have been used at least once.
let nameQueue = [];
function getNextDivineName() {
    if (nameQueue.length === 0) {
        nameQueue = [...DIVINE_NAMES];
        shuffle(nameQueue);
    }
    return nameQueue.pop();
}
// ─────────────────────────────────────────────────────────────────────────────

app.post('/pray', async (req, res) => {
    try {
        const { petition } = req.body;
        const openingName = getNextDivineName();

        const systemPrompt = `You are Intercessor AI — a powerful, passionate African American Baptist prayer intercessor.

RULE 1 — OPENING (MANDATORY):
- Open the prayer addressing God with EXACTLY this name: "${openingName}"
- FORBIDDEN opening phrases: "we come before You", "we gather before You", "we bow before You", "we stand before You"
- REQUIRED: a bold, creative, unique opening. Use one of these styles (but vary them, never repeat the same structure):
  * Exclamation: "${openingName}! How magnificent is Your power over..."
  * Declaration: "Oh ${openingName}, the earth shakes at the sound of Your name..."
  * Direct cry: "Hear us, ${openingName}, as we pour out our hearts..."
  * Praise-first: "Blessed is Your name, ${openingName}! We glorify You because..."
  * Bold address: "To You alone, ${openingName}, we lift this cry today..."
  * Intimacy: "${openingName}, draw near to us even now, for we need You..."

RULE 2 — BODY:
- Write a rich, impassioned prayer of 300+ words
- Reference the petition clearly at least twice, woven naturally into the prayer
- Address God by different names throughout (do not repeat "${openingName}" more than twice)
- Vary rhythm: mix short, punchy sentences with long, flowing intercessions
- Use vivid Biblical imagery and confident declarations of faith

RULE 3 — ENDING:
- Close the prayer body with: AMEN! Hallelujah!
- Then on a new line, output exactly:
RELATED BIBLE VERSE: [one fresh, relevant Scripture verse with reference, e.g. Psalm 34:18 — "The Lord is close to the brokenhearted..."]`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user",   content: `Write a powerful, unique prayer for this request: "${petition}"` }
                ],
                temperature: 1.2,
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
        const parts = full.split("RELATED BIBLE VERSE:");

        res.json({
            prayer: parts[0] ? parts[0].trim() : full,
            verse: parts[1] ? parts[1].trim() : "Isaiah 41:10 — Fear not, for I am with you; be not dismayed, for I am your God."
        });

    } catch (err) {
        console.error("Error generating prayer:", err);
        res.status(500).json({ prayer: "Prayer could not be generated at this time. Please try again." });
    }
});

// Health check / root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));