require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/griddle-hello", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `hello, ${command.user_name}!\nLatency: ${latency}ms` });
});

app.command("/griddle-ping", async ({ ack, respond }) => {
  await ack();
  await respond({ text: "pong!" });
});

app.command("/griddle-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/griddle-hello - Check bot latency
/griddle-help - Show available commands
/griddle-ping - Check if the bot is alive
/griddle-catfact - Get a cat fact
/griddle-stardance - Countdown to the end of stardance 30th of september`
  });
});

app.command("/griddle-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/griddle-stardance", async ({ ack, respond }) => {
  await ack();

  const targetDate = new Date("2026-09-30T00:00:00Z"); 
  const now = new Date();
  
  const timeDiff = targetDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    await respond({ text: "Stardance has already ended!" });
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  await respond({
    text: `Countdown to Stardance:\n${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining.`
});
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();