import { Discord, Slash, SlashOption } from 'discordx';
import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, User, EmbedBuilder } from 'discord.js';

@Discord()
@Category('General')
export class userinfo {
    @Slash({
        name: 'userinfo',
        description: "View a user's information."
    })
    async userinfo(
        @SlashOption({
            name: 'member',
            description: 'Member to display the informations.',
            required: true,
            type: ApplicationCommandOptionType.User
        })
        user: User,
        interaction: CommandInteraction
    ) {
        const member = await interaction.guild?.members.fetch({ user });
        if (!member) return;
        const avatar = member.displayAvatarURL({ size: 1024 });

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username}'s informations`)
            .setThumbnail(`${avatar}`)
            .setFields(
                {
                    name: '<:Info:953897898481954827> Tag',
                    value: `\`${member.user.tag}\``,
                    inline: true
                },
                {
                    name: '<:Information:957490076567363645> ID',
                    value: `\`${member.user.id}\``,
                    inline: true
                },
                {
                    name: '<:time:957490078131830854> Created on',
                    value: `\`${member.user.createdAt.toLocaleDateString('pt-br')}\``,
                    inline: true
                },
                {
                    name: '<:invite:953914955311239168> Joined at',
                    value: `\`${member.joinedAt?.toLocaleDateString('pt-br')}\``,
                    inline: false
                }
            )
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }
}
