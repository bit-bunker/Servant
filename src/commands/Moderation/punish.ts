import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, User } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashOption } from "discordx";
import { Infractions, Severity } from "../../services/Infractions";
import { container } from "tsyringe";

@Discord()
@Category('Moderation')
export default class PunishCommand {
    @Slash({
        name: 'punish',
        description: 'punish user'
    })
    @Guard(
        PermissionGuard(['ModerateMembers', 'BanMembers'], {
            content: "You don't have moderate members & ban members permissions.",
            ephemeral: true
        })
    )
    async punish(
        @SlashOption({
            name: 'user',
            description: 'user to be punished',
            required: true,
            type: ApplicationCommandOptionType.User
        })
        user: User,
        @SlashChoice({ name: 'Low Severity', value: Severity.LOW })
        @SlashChoice({ name: 'Medium Severity', value: Severity.MEDIUM })
        @SlashChoice({ name: 'High Severity', value: Severity.HIGH })
        @SlashChoice({ name: 'Extreme Severity', value: Severity.EXTREME })
        @SlashOption({
            name: 'severity',
            description: 'infraction severity',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        severity: Severity,
        @SlashOption({
            name: 'reason',
            description: 'reason of the punishment',
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reason: string,
        interaction: CommandInteraction
    ) {
        const guild = interaction.guild;
        if (!guild) return;

        const member = await guild.members.fetch({ user });
        if (!member) return;

        const infractionsService = container.resolve(Infractions);

        const punished = await infractionsService.applyInfraction({
            userId: member.id,
            severity,
            reason,
            guild
        });

        if (punished) {
            return interaction.reply({
                content: `${interaction.member}, user punished with success!`
            });
        }

        return interaction.reply({
            content: 'Failed to punish user!',
            ephemeral: true
        });
    }
}
