<img align="left" style="vertical-align: middle" height="120" src="https://cdn.discordapp.com/avatars/924226147384954891/4c016bb4e0a2e66ab7101f654fd2aff6.webp?size=1024" alt="The Servant">

# The Servant
> Just a simple bot using DiscordX to assist with BitBunker moderation and support.

## Requirements
- Application Token - [Discord Developer Portal](https://discord.com/developers);
- Coffe Cup;
- Node and a node package manager;
- Don't be a robot;

## How to run?
- Install dependencies with your favourite node package manager (e.g: `pnpm install`)
- Configure .env file, example:
```sh
token=[TOKEN]
guilds=[YOUR GUILD ID]
FIBO_BOT_ID=[GET BOT ID]
DATABASE_URL=file:/tmp/db.db
```
- Migrate the database using `npx prisma migrate dev`
- Run the bot running the script `build:start`


Join: [BitBunker](https://discord.gg/MVpxAxpZJ6)
