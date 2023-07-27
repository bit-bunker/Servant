import { Client, Discord, Once, ArgsOf } from 'discordx';
import { ActivityType } from 'discord.js';
<<<<<<< HEAD
import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';
import cron from 'node-cron';
import 'dotenv/config';
=======
import { container } from 'tsyringe';
import { Banishment } from '../models/Banishment';
import { Infractions } from '../services/Infractions';
>>>>>>> main

@Discord()
export default class ReadyEvent {
    @Once({ event: 'ready' })
    async onReady([]: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands();
        cron.schedule('* * * * *', async () => {
            const guildId = process.env.GUILD_ID || "";
            const roleId = process.env.ROLE_ID || "";
            const prisma: PrismaClient = container.resolve('PrismaClient');
            const guild = await client.guilds.fetch(guildId);
            const role = await guild.roles.fetch(roleId);
            if (role){
                const oldtop = await prisma.users.findFirst({where: {top: true}});
                const o_member = await guild.members.fetch(oldtop!.id);
                if (oldtop)
                    o_member.roles.remove(role);
                console.log(oldtop);
                const top = await prisma.users.findFirst({orderBy: {bumpCount: 'desc'}});
                const member = await guild.members.fetch(top!.id);
                member.roles.add(role);
                console.log(top);
                const users = await prisma.users.findMany();
                users.map(async (user)=> prisma.users.update({where: {id: user.id}, data: {bumpCount:0, top: false}}));
            }
        });
        client.user?.setActivity({ name: `Java no lixo`, type: ActivityType.Playing });
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
