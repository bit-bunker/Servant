import { Discord, Guard, Slash, SlashOption, SlashChoice } from 'discordx';
import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, DiscordAPIError, GuildMemberRoleManager } from 'discord.js';
import { memberIdsFromString } from '../../utils/members';

const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;

@Discord()
@Category('Moderation')
export default abstract class TimeoutCommand {
    @Slash({
        name: 'timeout',
        description: 'timeout members a specific time with a given reason'
    })
    @Guard(
        PermissionGuard(['ModerateMembers'], {
            content: "You don't have moderate members permission.",
            ephemeral: true
        })
    )
    async timeout(
        @SlashOption({
            name: 'members',
            description: 'members to time out',
            required: true,
            type: ApplicationCommandOptionType.String
        })
        members: string,
        @SlashChoice({ name: '0 seconds (unmute)', value: 0 })
        @SlashChoice({ name: '60 seconds', value: oneMinute })
        @SlashChoice({ name: '5 minutes', value: 5 * oneMinute })
        @SlashChoice({ name: '10 minutes', value: 10 * oneMinute })
        @SlashChoice({ name: '1 hour', value: oneHour })
        @SlashChoice({ name: '1 day', value: oneDay })
        @SlashChoice({ name: '1 week', value: 7 * oneDay })
        @SlashOption({
            name: 'time',
            description: 'time for timing out',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        time: number,
        @SlashOption({
            name: 'reason',
            description: 'reason for timing out',
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
        const canBotModerateMembers = guildMembers.every((member) => member.moderatable);

        if (!canBotModerateMembers)
            return await interaction.reply({
                content: `${interaction.member}, **I** cannot timeout one or more of the given members!`,
                ephemeral: true
            });

        const canUserModerateMembers =
            interaction.guild.ownerId === interaction.member?.user.id ||
            guildMembers.every((member) => roles.highest.comparePositionTo(member.roles.highest) > 0);

        if (!canUserModerateMembers)
            return await interaction.reply({
                content: `${interaction.member}, **you** cannot timeout one or more of the given members!`,
                ephemeral: true
            });

        try {
            guildMembers.each(async (member) => await member.timeout(time === 0 ? null : time, reason));

            const what = time === 0 ? 'untimed' : 'timed';

            await interaction.reply({
                content: `${interaction.member} ${what} out **${guildMembers.size}** members with success!`
            });
        } catch (e) {
            const errorMessage = typeof e === 'string' ? e : e instanceof DiscordAPIError ? e.message : '';

            await interaction.reply({
                content: `Failed to time out members. Reason: ${errorMessage}`,
                ephemeral: true
            });
        }
    }
}
