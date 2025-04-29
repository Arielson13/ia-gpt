const form = document.getElementById("form");
const input = document.getElementById("user-input");
const chat = document.getElementById("chat");

// Função para adicionar mensagem ao chat
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const content = document.createElement("div");
  content.classList.add("content");
  content.textContent = text;

  message.appendChild(content);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

// Função de digitação da resposta da IA
function showTypingEffect(htmlText) {
  return new Promise((resolve) => {
    const message = document.createElement("div");
    message.classList.add("message", "bot");

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = ""; // Inicia vazio

    message.appendChild(content);
    chat.appendChild(message);

    let index = 0;

    function typeChar() {
      if (index < htmlText.length) {
        content.innerHTML = htmlText.slice(0, index + 1);
        index++;
        chat.scrollTop = chat.scrollHeight;
        setTimeout(typeChar, 8);
      } else {
        resolve();
      }
    }

    typeChar();
  });
}

// Evento de envio
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();

  if (!prompt) return;

  addMessage("user", prompt);
  input.value = "";

  try {
    const res = await fetch("http://localhost:3000/perguntar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();

    // Verifica se a resposta tem estrutura
    if (!data.resposta) {
      await showTypingEffect("Não foi possível entender a resposta da IA.");
      return;
    }

    // Mostra a resposta com efeito de digitação
    const formatted = formatTextToHTML(data.resposta);
    await showTypingEffect(formatted);
  } catch (error) {
    await showTypingEffect("Erro ao obter resposta.");
    console.error("Erro:", error);
  }
});

function formatTextToHTML(text) {
  // Negrito com **texto**
  let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Coloca <li> nos itens de lista com "*"
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');

  // Agrupa os <li> em listas <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Parágrafos: quebra dupla de linha
  html = html.replace(/\n{2,}/g, '</p><p>');

  // Quebra simples vira <br> (opcional) ou nada se usar <p>
  html = `<p>${html}</p>`;
  
  return `<p>${html}</p>`;
}

// Envio com Enter
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});
