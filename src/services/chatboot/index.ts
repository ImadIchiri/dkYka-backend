import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askChatBot = async (message: string): Promise<string> => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Tu es un assistant utile, clair et professionnel pour une application web.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const reply = completion.choices?.[0]?.message?.content;

  return reply ?? "Aucune réponse";
};
