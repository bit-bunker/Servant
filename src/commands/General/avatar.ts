import { Discord, Slash, SlashOption } from 'discordx';
import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, User, EmbedBuilder } from 'discord.js';

@Discord()
@Category('General')
export class avatar {
    @Slash({
        name: 'avatar',
        description: "View a user's avatar."
    })
    async avatar(
        @SlashOption({
            description: 'Member to display the avatar.',
            name: 'member',
            type: ApplicationCommandOptionType.User,
            required: true
        })
        member: User,
        interaction: CommandInteraction
    ) {
        const user = interaction.guild?.members.cache.get(member.id);
        const avatar = user?.user.avatarURL({ size: 1024 });
        const embed = new EmbedBuilder()
            .setTitle(`${user?.user.username}'s Avatar`)
            .setImage(`${avatar}`)
            .setColor('#2f3136')
            .setTimestamp();
        await interaction.reply({ content: `${member}`, embeds: [embed] });
    }
}
