import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { container } from 'tsyringe';
import { Punishment } from '../../models/Punishment';

const punishmentText = ['warn', 'mute', 'ban'];

@Discord()
@Category('Moderation')
export default class CaseCommand {
    @Slash({
        name: 'case',
        description: 'show case informations'
    })
    @Guard(
        PermissionGuard(['ModerateMembers'], {
            content: "You don't have moderate members permission.",
            ephemeral: true
        })
    )
    async caseCommand(
        @SlashOption({
            name: 'id',
            description: 'case id to see',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        id: number,
        interaction: CommandInteraction
    ) {
        const punishmentModel = container.resolve(Punishment);
        const data = await punishmentModel.find({ case: id });

        if (!data) {
            return interaction.reply({
                content: "This case doesn't exist!",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder().addFields(
            { name: 'ID', value: `${data.case}` },
            { name: 'Target', value: `<@${data.user}>` },
            { name: 'Punishment', value: `${punishmentText[data.punishment]}` },
            { name: 'Duration', value: `${data.duration}` },
            { name: 'Reason', value: `${data.reason}` },
            { name: 'Date', value: `<t:${Math.floor(data.when.getTime() / 1000)}:F>` }
        );

        return interaction.reply({
            embeds: [embed]
        });
    }
}
