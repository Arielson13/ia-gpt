// backend/gnai.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});

const perguntar = async (prompt) => {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text();
}

module.exports = { perguntar };
