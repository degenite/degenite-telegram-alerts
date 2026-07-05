import TelegramBot from "node-telegram-bot-api";
import { DegeniteClient } from "degenite-sdk";
import { loadConfig } from "./config.js";

const config = loadConfig();
const bot = new TelegramBot(config.telegramToken, { polling: true });
const client = new DegeniteClient({ baseUrl: config.apiBaseUrl });

const lastAlerted = new Map(); // address -> last pnl% bucket alerted

function pnlBucket(pnlPct) {
  // Alert on crossing every configured threshold, e.g. +50%, +100%, -20%.
  return Math.floor(pnlPct / config.alertStepPct) * config.alertStepPct;
}

async function checkPositions(chatId) {
  try {
    const { positions, portfolio } = await client.getPositions();

    for (const p of positions) {
      const pnlPct = ((p.curPrice - p.entryPrice) / p.entryPrice) * 100;
      const bucket = pnlBucket(pnlPct);
      const key = p.address;

      if (lastAlerted.get(key) !== bucket) {
        lastAlerted.set(key, bucket);
        const emoji = pnlPct >= 0 ? "🟢" : "🔴";
        await bot.sendMessage(
          chatId,
          `${emoji} ${p.symbol}: ${pnlPct.toFixed(1)}% (entry ${p.entryPrice} → cur ${p.curPrice})`
        );
      }
    }

    return portfolio;
  } catch (err) {
    console.error("Failed to check positions:", err.message);
    return null;
  }
}

bot.onText(/\/status/, async (msg) => {
  const portfolio = await checkPositions(msg.chat.id);
  if (portfolio) {
    await bot.sendMessage(
      msg.chat.id,
      `Equity: ${portfolio.equitySol} SOL | Exposure: ${portfolio.exposureSol} SOL | Open: ${portfolio.openPositions}`
    );
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Degenite Alerts (unofficial community bot) is running. Use /status for a snapshot; " +
      `automatic alerts fire every ${config.alertStepPct}% PnL move.`
  );
});

console.log("degenite-telegram-alerts running. Polling every", config.pollIntervalMs, "ms");
setInterval(() => {
  if (config.chatId) checkPositions(config.chatId);
}, config.pollIntervalMs);
