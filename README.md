# 🙏 AI Prayer Warrior

Would you like to give your followers a treat this Easter? In the age of AI, they can realize that the power of prayer exists in many forms. I can make a directly branded app for your organization (I create great logos too if needed). Think how special your organization will feel once you deploy a personalized Prayer Warrior!

I will create a personal app for you or you can use this simple app to encourage yourself and others.

---

## 🚀 Getting Started (Personal Version)

If you want to create your own personal version of the **AI Prayer Warrior**, follow these steps:

### 1. Prerequisites
- **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
- **Groq API Key**: You'll need an API key from [Groq](https://console.groq.com/) to power the AI.

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/derrickjohnpiper/AI_Prayer_Warrior.git
cd AI_Prayer_Warrior
npm install
```

### 3. Configuration
Create a `.env` file in the root directory and add your Groq API key:

```env
GROQ_KEY=your_groq_api_key_here
PORT=3000
```

### 4. Setup CORS (Important)
Open `server.js` and update the `allowedOrigins` array (lines 8-14) to include your local and production domains:

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://your-username.github.io', // Your GitHub Pages URL
    'https://your-custom-domain.com'   // Your custom domain
];
```

### 5. Running Locally
Start the server:

```bash
npm start
```
By default, the app will be available at `http://localhost:3000`.

---

## 🌐 Deployment

### Backend (Proxy)
We recommend deploying the `server.js` (proxy) to **Render** or **Heroku**.
1. Create a new "Web Service".
2. Connect your GitHub repository.
3. Set the Environment Variable `GROQ_KEY` in the dashboard.

### Frontend
You can host the `index.html` on **GitHub Pages**, **Netlify**, or **Vercel**.
- **Important**: In `index.html`, ensure the `fetch` request points to your deployed backend URL instead of `localhost`.

---

## 📩 Contact
Please contact me directly for any questions:

**AI Prayer Warrior**  
**Derrick-John Piper**  
📞 281-924-8713  
📧 [DerrickJohnPiper@Gmail.com](mailto:DerrickJohnPiper@Gmail.com)
