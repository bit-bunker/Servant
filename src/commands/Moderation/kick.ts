import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { Discord, Slash, SlashOption, Guard } from 'discordx';
import { PermissionGuard } from '@discordx/utilities';

@Discord()
export class kickCmd {
    @Slash({ name: 'kick', description: 'Kick a member' })
    @Guard(
        PermissionGuard(['KickMembers'], {
            content: "You don't have kick members permission.",
            ephemeral: true
        })
    )
    kick(
        @SlashOption({
            name: 'member',
            description: 'member to ban',
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        @SlashOption({
            name: 'reason',
            description: 'reason for ban',
            required: false,
            type: ApplicationCommandOptionType.String
        })
        reason: string,
        interaction: CommandInteraction
    ) {
        const user = interaction.guild?.members.cache.get(member.id);
        if (!user) return interaction.reply('The member appears to no longer be on the server now.');
        if (!user.bannable) return interaction.reply('That member cannot be punished by me.');
        user.kick(`Kicked by ${interaction.member?.user.username}`);
        const embed = new EmbedBuilder()
            .setTitle('Kick')
            .setTimestamp()
            .setThumbnail(`${user.user.avatarURL()}`)
            .setFields(
                {
                    name: 'Author',
                    value: `**Tag:** ${interaction.member?.user.username}\n**ID:** ${interaction.member?.user.id}`
                },
                {
                    name: 'Member',
                    value: `**Tag:** ${member.user.tag}\n**ID:** ${member.id}`
                },
                {
                    name: 'Reason',
                    value: `${reason ? reason : "It's kicked!"}`
                }
            );
        interaction.reply({ embeds: [embed] });
    }
}
