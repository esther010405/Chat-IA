// === Chat DeepSeek via OpenRouter (tout en JS) ===


// === STYLE CSS ===
const css = `
  body { font-family: sans-serif; background:#0f172a; color:#fff; margin:0; padding:20px; }
  .chat { max-width:600px; margin:auto; background:#1e293b; padding:20px; border-radius:10px; }
  .messages { height:400px; overflow-y:auto; margin-bottom:15px; display:flex; flex-direction:column; gap:10px; }
  .bubble { padding:10px 15px; border-radius:15px; max-width:70%; }
  .user { align-self:flex-end; background:#3b82f6; color:#fff; }
  .bot { align-self:flex-start; background:#334155; color:#fff; }
  form { display:flex; gap:10px; }
  textarea { flex:1; padding:10px; border-radius:10px; border:none; resize:none; }
  button { padding:10px 20px; border:none; border-radius:10px; background:#22c55e; color:#fff; cursor:pointer; font-weight:bold; }
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

// === STRUCTURE HTML ===
const container = document.createElement("div");
container.className = "chat";

const title = document.createElement("h2");
title.textContent = "💬 Chat DeepSeek (via OpenRouter)";

const messagesDiv = document.createElement("div");
messagesDiv.className = "messages";
messagesDiv.id = "messages";

const form = document.createElement("form");
form.id = "chatForm";

const textarea = document.createElement("textarea");
textarea.id = "input";
textarea.rows = 2;
textarea.placeholder = "Écris ton message...";

const button = document.createElement("button");
button.type = "submit";
button.textContent = "Envoyer";

form.appendChild(textarea);
form.appendChild(button);

container.appendChild(title);
container.appendChild(messagesDiv);
container.appendChild(form);
document.body.appendChild(container);

// === FONCTIONS ===
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "bubble " + (sender === "user" ? "user" : "bot");
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// === LOGIQUE CHAT ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = textarea.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  textarea.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    if (!res.ok) {
      addMessage("❌ Erreur serveur", "bot");
      return;
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "(pas de réponse)";
    addMessage(reply, "bot");
  } catch (err) {
    addMessage("⚠️ Erreur réseau", "bot");
  }
});
