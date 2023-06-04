import { Discord, Guard, Slash, SlashOption, Client } from 'discordx';
import { Category, PermissionGuard } from '@discordx/utilities';
import {
    ApplicationCommandOptionType,
    CommandInteraction,
    DiscordAPIError,
    GuildMember,
    GuildMemberRoleManager
} from 'discord.js';
import { memberIdsFromString } from '../../utils/members';

@Discord()
@Category('Moderation')
export default class BanCommand {
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
        interaction: CommandInteraction,
        client: Client
    ) {
        const guild = interaction.guild;
        if (!guild) return;

        const memberIds: string[] = memberIdsFromString(members);
        const guildMembers = await guild.members.fetch({ user: memberIds, withPresences: false });

        let canBanAllMembers = interaction.guild.ownerId === interaction.member?.user.id;
        if (!canBanAllMembers) {
            const roles = interaction.member?.roles;
            if (roles instanceof GuildMemberRoleManager) {
                const membersHighestRole = guildMembers.map((member) => member.roles.highest);
                const botMember = await guild.members.fetch(client.botId);
                canBanAllMembers = membersHighestRole.every(
                    (role) => botMember.roles.highest.comparePositionTo(role) > 0
                );
                if (canBanAllMembers)
                    canBanAllMembers = membersHighestRole.every((role) => roles.highest.comparePositionTo(role) > 0);
            }
        }

        if (canBanAllMembers) {
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
}
