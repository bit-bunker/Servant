/*
  The Servant ~
    BitBunker - Official bot
*/
import 'reflect-metadata';
import 'dotenv/config';
import { GatewayIntentBits } from 'discord.js';
import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import { importx, dirname } from '@discordx/importer';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

container.register<PrismaClient>('PrismaClient', {
    useValue: new PrismaClient()
});

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

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

async function main() {
    const AppToken = process.env.token || '';
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);
    await client.login(AppToken);
}
main();
