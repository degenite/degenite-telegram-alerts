export function loadConfig() {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiBaseUrl = process.env.DEGENITE_API_URL;
  const chatId = process.env.TELEGRAM_CHAT_ID ?? null;
  const alertStepPct = Number(process.env.ALERT_STEP_PCT ?? 20);
  const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS ?? 60000);

  if (!telegramToken) throw new Error("TELEGRAM_BOT_TOKEN is required.");
  if (!apiBaseUrl) throw new Error("DEGENITE_API_URL is required.");

  return { telegramToken, apiBaseUrl, chatId, alertStepPct, pollIntervalMs };
}
