import { Discord, Slash, SlashOption } from 'discordx';
import { Category } from '@discordx/utilities';
import { APIUser, ApplicationCommandOptionType, CommandInteraction, User } from 'discord.js';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

@Discord()
@Category('User')
export default abstract class BumpCountCommand {
    @Slash({
        name: 'bumps',
        description: 'Show the bump count of the user'
    })
    async bumpCount(
        @SlashOption({
            name: 'user',
            description: 'user to show bump count',
            required: false,
            type: ApplicationCommandOptionType.User
        })
        user: User | APIUser | undefined,
        interaction: CommandInteraction
    ) {
        if (!user) {
            user = interaction.member?.user;
        }

        const guild = interaction.guild;
        if (!guild) return;

        const prisma: PrismaClient = container.resolve('PrismaClient');

        let userData = await prisma.users.findFirst({ where: { id: user.id } });

        if (!userData) {
            userData = await prisma.users.create({ data: { id: user.id } });
        }

        await interaction.reply({ content: `<@${userData.id}> has **${userData.bumpCount}** bumps!`, ephemeral: true });
    }
}
