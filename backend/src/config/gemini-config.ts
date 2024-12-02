const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const generate = async (prompt:string) => {
  const result = await model.generateContent(prompt);

  console.log(result.response.text());
  return result.response.text()
};

