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
token="TOKEN"
DISCORD_GUILD_ID="YOUR GUILD ID"
FIBO_BOT_ID="GET BUMP REMINDER BOT ID"
WELCOME_CHANNEL_ID="YOUR WELCOME CHANNEL ID"
RULES_CHANNEL_ID="YOUR RULES CHANNEL ID"
NEWS_CHANNEL_ID="YOUR NEWS CHANNEL ID"
INTRO_CHANNEL_ID="YOUR INTRO CHANNEL ID"
DATABASE_URL=file:/tmp/db.db
```
- Migrate the database using `npx prisma migrate dev`
- Run the bot running the script `build:start`


Join: [BitBunker](https://discord.gg/MVpxAxpZJ6)
