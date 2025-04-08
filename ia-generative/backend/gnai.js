const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Inicializa o modelo
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function perguntar(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return "Houve um erro ao processar sua pergunta.";
  }
}

module.exports = perguntar;