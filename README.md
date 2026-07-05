# degenite-telegram-alerts (community, unofficial)

A small Telegram bot that polls a DEGENITE-compatible trading API and
notifies a chat whenever an open position's PnL crosses a configurable
threshold.

## Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) and get a token.
2. Set environment variables:

```bash
export TELEGRAM_BOT_TOKEN=xxxx
export DEGENITE_API_URL=https://your-instance.example.com
export TELEGRAM_CHAT_ID=123456789   # your chat id, for scheduled polling
export ALERT_STEP_PCT=20            # alert every +/-20% move
export POLL_INTERVAL_MS=60000
```

3. Install and run:

```bash
npm install
npm start
```

Send `/status` to the bot at any time for a manual snapshot, or `/start`
for a health check message.

## Scope & disclaimer

This bot only reads position data — it never places trades. It contains no
strategy or risk logic; it's purely a notification convenience layer on top
of the public `/api/positions` endpoint.
