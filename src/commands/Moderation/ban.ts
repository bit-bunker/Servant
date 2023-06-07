import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, DiscordAPIError, GuildMemberRoleManager } from 'discord.js';
import { memberIdsFromString } from '../../utils/members';

@Discord()
@Category('Moderation')
export default abstract class BanCommand {
    @Slash({
        name: 'ban',
        description: 'ban members with a given reason'
    })
    @Guard(
        PermissionGuard(['BanMembers'], {
            content: "You don't have ban members permission.",
            ephemeral: true
        })
    )
    async ban(
        @SlashOption({
            name: 'members',
            description: 'members to be banned',
            required: true,
            type: ApplicationCommandOptionType.String
        })
        members: string,
        @SlashOption({
            name: 'reason',
            description: 'reason of the ban',
            required: false,
            type: ApplicationCommandOptionType.String
        })
        reason: string,
        interaction: CommandInteraction
    ) {
        const guild = interaction.guild;
        if (!guild) return;

        const roles = interaction.member?.roles;
        if (!(roles instanceof GuildMemberRoleManager)) return;

        const memberIds = memberIdsFromString(members);
        const guildMembers = await guild.members.fetch({ user: memberIds, withPresences: false });
        const canBotBanMembers = guildMembers.every((member) => member.bannable);

        if (!canBotBanMembers)
            return await interaction.reply({
                content: `${interaction.member}, **I** cannot ban one or more of the given members!`,
                ephemeral: true
            });

        const canUserBanMembers =
            interaction.guild.ownerId === interaction.member?.user.id ||
            guildMembers.every((member) => roles.highest.comparePositionTo(member.roles.highest) > 0);

        if (!canUserBanMembers)
            return await interaction.reply({
                content: `${interaction.member}, **you** cannot ban one or more of the given members!`,
                ephemeral: true
            });

        try {
            guildMembers.each(async (member) => await member.ban({ reason }));

            await interaction.reply({
                content: `${interaction.member} banned **${guildMembers.size}** members banned with success!`
            });
        } catch (e) {
            const errorMessage = typeof e === 'string' ? e : e instanceof DiscordAPIError ? e.message : '';

            await interaction.reply({
                content: `Failed to ban members. Reason: ${errorMessage}`,
                ephemeral: true
            });
        }
    }
}
