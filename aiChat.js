import OpenAI from "openai";
import fs from "fs";

// .env 読み込み（dotenv 使ってる場合）
import dotenv from "dotenv";
dotenv.config();

const characters = JSON.parse(fs.readFileSync("characters.json", "utf-8"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ← .env のキー使う
});

// キャラ選択
const charA = characters.find((c) => c.name === "坂田銀時");
const charB = characters.find((c) => c.name === "モンキー・D・ルフィ");

// 初期テーマ
let conversation = "今日の昼飯、何食べるか話し合ってくれ";

async function startConversation() {
  let aMessage = conversation;

  for (let i = 0; i < 5; i++) {
    // Aの返答
    const resA = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: charA.prompt },
        { role: "user", content: aMessage },
      ],
    });
    const replyA = resA.choices[0].message.content;
    console.log(`\n🗣️ ${charA.name}：${replyA}`);

    // Bの返答
    const resB = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: charB.prompt },
        { role: "user", content: replyA },
      ],
    });
    const replyB = resB.choices[0].message.content;
    console.log(`\n🗣️ ${charB.name}：${replyB}`);

    aMessage = replyB;
  }
}

startConversation();

