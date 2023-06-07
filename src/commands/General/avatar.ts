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
        user: User,
        interaction: CommandInteraction
    ) {
        const member = await interaction.guild?.members.fetch({ user });
        if (!member) return;
        const avatar = member.displayAvatarURL({ size: 1024 });
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username}'s Avatar`)
            .setImage(`${avatar}`)
            .setColor('#2f3136')
            .setTimestamp();
        await interaction.reply({ content: `${member}`, embeds: [embed] });
    }
}
