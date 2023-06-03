import { Client, Discord, Slash } from 'discordx';
import { Category } from '@discordx/utilities';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

@Discord()
@Category('geral')
export class serverinfo {
    @Slash({
        name: 'serverinfo',
        description: 'View server information.'
    })
    async serverinfo(interaction: CommandInteraction, client: Client) {
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild?.name}`)
            .setThumbnail(`${interaction.guild?.iconURL()}`)
            .setColor('#2f3136')
            .setFields(
                {
                    name: '<:moderator:957490077964066837> Owner',
                    value: `<@${interaction.guild?.ownerId}>`,
                    inline: true
                },
                {
                    name: '<:Information:957490076567363645> ID',
                    value: `\`${interaction.guild?.id}\``,
                    inline: true
                },
                {
                    name: '<:UserRyze:742191096989351947> Members',
                    value: `\`${interaction.guild?.members.cache.size}\``,
                    inline: true
                },
                {
                    name: '<:Tag:742191097496862870> Roles',
                    value: `\`${interaction.guild?.roles.cache.size}\``,
                    inline: true
                }
            )
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }
}