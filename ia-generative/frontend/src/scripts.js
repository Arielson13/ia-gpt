const form = document.getElementById("form");
const promptInput = document.getElementById("prompt");
const chat = document.getElementById("chat");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, "user");
  promptInput.value = "";
  promptInput.focus();

  appendMessage("...", "bot");
  const loadingMsg = chat.lastElementChild;

  try {
    const response = await fetch("http://localhost:3000/perguntar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    loadingMsg.remove();
    appendMessage(data.resposta, "bot");
  } catch (error) {
    loadingMsg.remove();
    appendMessage("Erro ao se conectar com o servidor.", "bot");
  }

  scrollToBottom();
});

function appendMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  chat.appendChild(msg);
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}
