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
/griddle-catfact - Get a cat fact`
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

(async () => {
  await app.start();
  console.log("bot is running!");
})();