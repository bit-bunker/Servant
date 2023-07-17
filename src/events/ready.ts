import { Client, Discord, Once, ArgsOf } from 'discordx';
import { ActivityType } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';
import cron from 'node-cron';
import 'dotenv/config';

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
    }
}
