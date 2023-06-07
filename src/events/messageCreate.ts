import { PrismaClient } from '@prisma/client';
import { ArgsOf, Discord, On } from 'discordx';
import { container } from 'tsyringe';

const FIBO_BOT_ID = process.env.FIBO_BOT_ID;

@Discord()
export default class MessageCreateEvent {
    @On({ event: 'messageCreate' })
    async onMessageCreate([message]: ArgsOf<'messageCreate'>) {
        if (message.author.id === FIBO_BOT_ID) {
            if (message.content.startsWith('Thx for bumping our Server! We will remind you in 2 hours!')) {
                const bumper = message.mentions.members?.first();
                if (!bumper) return;
                const prisma: PrismaClient = container.resolve('PrismaClient');

                await prisma.users.upsert({
                    create: {
                        id: bumper.id,
                        bumpCount: 1
                    },
                    update: {
                        bumpCount: {
                            increment: 1
                        }
                    },
                    where: {
                        id: bumper.id
                    }
                });
            }
        }
    }
}
