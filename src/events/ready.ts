import { Client, Discord, Once, ArgsOf } from 'discordx';
import { ActivityType } from 'discord.js';
import {PrismaClient} from '@prisma/client';
import { container } from 'tsyringe';
import cron from 'node-cron';

@Discord()
export default class ReadyEvent {
    @Once({ event: 'ready' })
    async onReady([]: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands();

        /*Bump Cron*/
        const prisma: PrismaClient = container.resolve('PrismaClient');
        cron.schedule('* * * * *', async () => {
            const guild = await client.guilds.fetch("950325788429934652");
            const role = await guild.roles.fetch("1129861625361485844");
            if (role){
                // remove old top ranking
                const oldtop = await prisma.users.findFirst({where: {top: true}});
                const o_member = await guild.members.fetch(oldtop!.id);
                if (oldtop)
                    o_member.roles.remove(role);
                console.log(oldtop);
                // add new top ranking
                const top = await prisma.users.findFirst({orderBy: {bumpCount: 'desc'}});
                const member = await guild.members.fetch(top!.id);
                member.roles.add(role);
                console.log(top);
                // clean members
                const users = await prisma.users.findMany();
                users.map(async (user)=> prisma.users.update({where: {id: user.id}, data: {bumpCount:0, top: false}}));
            }
        });

        client.user?.setActivity({ name: `Java out`, type: ActivityType.Playing });
        console.log(`${client.user?.tag} is ready!`);
    }
}
