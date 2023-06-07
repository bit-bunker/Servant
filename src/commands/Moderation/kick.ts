import {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    GuildMemberRoleManager,
    User
} from 'discord.js';
import { Discord, Slash, SlashOption, Guard } from 'discordx';
import { Category, PermissionGuard } from '@discordx/utilities';

@Discord()
@Category('Moderation')
export class kickCmd {
    @Slash({ name: 'kick', description: 'Kick a member' })
    @Guard(
        PermissionGuard(['KickMembers'], {
            content: "You don't have kick members permission.",
            ephemeral: true
        })
    )
    async kick(
        @SlashOption({
            name: 'member',
            description: 'member to kick',
            required: true,
            type: ApplicationCommandOptionType.User
        })
        user: User,
        @SlashOption({
            name: 'reason',
            description: 'reason for kick',
            required: false,
            type: ApplicationCommandOptionType.String
        })
        reason: string,
        interaction: CommandInteraction
    ) {
        const member = await interaction.guild?.members.fetch({ user });
        if (!member) return interaction.reply('The member appears to no longer be on the server now.');
        if (member.id == interaction.member?.user.id) return interaction.reply('You cannot punish yourself!');
        if (!member.bannable) return interaction.reply('That member cannot be punished by me.');

        const roles = interaction.member?.roles;
        if (!(roles instanceof GuildMemberRoleManager)) return;

        if (
            interaction.member?.user.id !== interaction.guild?.ownerId ||
            roles.highest.comparePositionTo(member.roles.highest) < 1
        )
            return interaction.reply('You cannot punish this member.');

        member.kick(`Kicked by ${interaction.member?.user.username}`);

        const avatarUrl = member.displayAvatarURL({ size: 1024 });

        const embed = new EmbedBuilder()
            .setTitle('Kick')
            .setTimestamp()
            .setThumbnail(`${avatarUrl}`)
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
