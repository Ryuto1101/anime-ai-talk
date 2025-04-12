import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// キャラ情報を読み込み
const characters = JSON.parse(fs.readFileSync("characters.json", "utf-8"));
const gintoki = characters.find(c => c.name === "坂田銀時");
const luffy = characters.find(c => c.name === "モンキー・D・ルフィ");

// 初期化：会話スタート用のテーマ
const topic = "今日の昼飯、何食べるか話し合ってくれ";

// 各キャラごとの履歴（脳みそ）
let historyGintoki = [
  { role: "system", content: gintoki.prompt },
  { role: "user", content: topic }
];

let historyLuffy = [
  { role: "system", content: luffy.prompt },
  { role: "user", content: topic }
];

// 表示用ログ
let displayLog = [];

async function runDialogue(turns = 6) {
  for (let i = 0; i < turns; i++) {
    // STEP 1: 銀時が話す
    const resGintoki = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: historyGintoki
    });

    const gintokiLine = resGintoki.choices[0].message.content.trim();
    displayLog.push(`🗣️ 坂田銀時：${gintokiLine}`);
    historyGintoki.push({ role: "assistant", content: gintokiLine });

    // 銀時の発言をルフィに渡す
    historyLuffy.push({ role: "user", content: gintokiLine });

    // STEP 2: ルフィが返す
    const resLuffy = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: historyLuffy
    });

    const luffyLine = resLuffy.choices[0].message.content.trim();
    displayLog.push(`🗣️ モンキー・D・ルフィ：${luffyLine}`);
    historyLuffy.push({ role: "assistant", content: luffyLine });

    // ルフィの発言を銀さんに渡す
    historyGintoki.push({ role: "user", content: luffyLine });
  }

  console.log(displayLog.join("\n\n"));
}

runDialogue();
