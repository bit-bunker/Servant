import { Discord, Slash } from 'discordx';
import { Category } from '@discordx/utilities';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

@Discord()
@Category('User commands')
export default abstract class TopBumpsCommand {
    @Slash({
        name: 'topbumpers',
        description: "Show server's top bumpers"
    })
    async topBumps(interaction: CommandInteraction) {
        const prisma: PrismaClient = container.resolve('PrismaClient');

        const results = await prisma.users.findMany({
            take: 6,
            orderBy: {
                bumpCount: 'desc'
            }
        });

        if (!results.length) {
            await interaction.reply({ ephemeral: true, content: 'Nobody bumped the server yet :c' });
            return;
        }

        const formatted = results
            .map((user, idx) => `- **${idx + 1}º ** <@${user.id}> bumped the server ${user.bumpCount} times!`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setDescription(formatted)
            .setTitle('Top Bumps')
            .setColor('Blurple')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
