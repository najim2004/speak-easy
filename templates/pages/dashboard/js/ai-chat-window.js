const chatLog = document.querySelector("[data-ai-chat-log]");
const chatInput = document.querySelector("[data-ai-chat-input]");
const chatSend = document.querySelector("[data-ai-chat-send]");
const typing = document.querySelector("[data-ai-typing]");

const appendMessage = (role, text) => {
  if (!chatLog) return;
  const row = document.createElement("div");
  row.className = role === "user" ? "flex justify-end" : "flex justify-start";
  const bubble = document.createElement("div");
  bubble.className =
    role === "user"
      ? "max-w-[80%] rounded-2xl rounded-tr-none bg-brand-accent p-3 text-sm font-bold text-black shadow-sm"
      : "max-w-[80%] rounded-2xl rounded-tl-none border border-white/5 bg-[#2a2a2a] p-3 text-sm font-bold text-white shadow-sm";
  bubble.textContent = text;
  row.appendChild(bubble);
  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
};

const sendMessage = () => {
  const text = chatInput?.value.trim();
  if (!text) return;
  appendMessage("user", text);
  chatInput.value = "";
  typing?.classList.remove("hidden");
  window.setTimeout(() => {
    typing?.classList.add("hidden");
    appendMessage("ai", "Konnichiwa! I am your Japanese Sensei. I can help with vocabulary, grammar, and study planning.");
  }, 700);
};

chatSend?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
