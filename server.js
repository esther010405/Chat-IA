import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API proxy sécurisé
app.post("/chat", async (req, res) => {
  const userText = req.body.message;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.KEY}`,
          "Content-Type": "application/json",
          "X-Title": "Chat DeepSeek Node"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [{ role: "user", content: userText }]
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur OpenRouter" });
  }
});

app.listen(3000, () => {
  console.log("✅ Serveur lancé sur http://localhost:3000");
});
