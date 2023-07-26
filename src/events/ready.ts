import { Client, Discord, Once, ArgsOf } from 'discordx';
import { ActivityType } from 'discord.js';
import { container } from 'tsyringe';
import { Banishment } from '../models/Banishment';
import { Infractions } from '../services/Infractions';

@Discord()
export default class ReadyEvent {
    @Once({ event: 'ready' })
    async onReady([]: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands();
        client.user?.setActivity({ name: `Life out`, type: ActivityType.Playing });
        console.log(`${client.user?.tag} is ready!`);

        const banishmentModel = container.resolve(Banishment);
        const banishments = await banishmentModel.all();

        console.debug(banishments);

        if (banishments) {
            const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID || '');
            if (!guild) return;

            const infractionsService = container.resolve(Infractions);

            banishments.forEach(async (banishment) => {
                const difference = Date.now() - banishment.until.getTime();
                if (difference <= 0) {
                    await infractionsService.unbanTask(banishment.user, guild);
                } else {
                    setTimeout(async () => infractionsService.unbanTask(banishment.user, guild), difference);
                }
            });
        }
    }
}
