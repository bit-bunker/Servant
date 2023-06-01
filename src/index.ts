/*
  The Servant ~
    BitBunker - Official bot
*/
import 'dotenv/config';
import {GatewayIntentBits} from 'discord.js';
import {Client} from 'discordx';
import {importx, dirname} from '@discordx/importer';

/* Build the Client */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ],
  silent: false
});

async function main () {
  const AppToken = process.env.token || "";
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);
  await client.login(AppToken);
}
main();
