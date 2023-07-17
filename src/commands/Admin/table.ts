import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, SlashGroup, Slash, Guard, SlashOption, SlashChoice } from "discordx";
import { Punishment, Punishments } from "../../services/Punishments";
import { container } from "tsyringe";

const punishmentText = [ "warn", "mute", "ban" ];

@Discord()
@SlashGroup({ name: 'table', description: 'infractions table' })
@Category('Admin')
export class TableCommands {
    @SlashGroup('table')
    @Slash({
        name: 'add',
        description: 'add new infraction to table'
    })
    @Guard(
        PermissionGuard(['Administrator'], {
            content: "You don't have admin permission.",
            ephemeral: true
        })
    )
    async add(
        @SlashOption({
            name: 'infractions',
            description: 'amount of infractions necessary',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        infractions: number,
        @SlashChoice({ name: 'Warning', value: Punishment.WARNING })
        @SlashChoice({ name: 'Timeout', value: Punishment.TIMEOUT })
        @SlashChoice({ name: 'Banishment', value: Punishment.BANISHMENT })
        @SlashOption({
            name: 'punishment',
            description: 'punishment to apply when specified number of infractions is reached',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        punishment: Punishment,
        @SlashOption({
            name: 'duration',
            description: 'duration of the punishment (for timeout or banishment)',
            required: false,
            type: ApplicationCommandOptionType.Integer
        })
        timeUnit: number,
        @SlashChoice({ name: 'seconds', value: 1000 })
        @SlashChoice({ name: 'minutes', value: 1000 * 60 })
        @SlashChoice({ name: 'hours', value: 1000 * 60 * 60 })
        @SlashChoice({ name: 'days', value: 1000 * 60 * 60 * 24 })
        @SlashOption({
            name: 'timespec',
            description: 'timespec to multiply duration',
            required: false,
            type: ApplicationCommandOptionType.Integer
        })
        timespec: number,
        interaction: CommandInteraction
    ) {
        const duration = timeUnit * timespec || 0;
        const punishments = container.resolve(Punishments);
        const existingPunishment = await punishments.lookup({ infractions: infractions });

        if (existingPunishment) {
            if (existingPunishment.infractions === infractions &&
                existingPunishment.punishment === punishment &&
                existingPunishment.duration === duration) {
                return interaction.reply({
                    content: 'Existing infraction has the same values as given.',
                    ephemeral: true
                });
            }

            if (await punishments.update({ infractions, punishment, duration })) {
                return interaction.reply({
                    content: `${interaction.member}, infraction updated with success!`,
                });
            }
        }

        if (await punishments.add({ infractions, punishment, duration })) {
            return interaction.reply({
                content: `${interaction.member}, infraction created with success!`,
            });
        }

        return interaction.reply({
            content: 'Failed to create new infraction!',
            ephemeral: true
        });
    }

    @SlashGroup('table')
    @Slash({
        name: 'remove',
        description: 'remove infraction from table'
    })
    @Guard(
        PermissionGuard(['Administrator'], {
            content: "You don't have admin permission.",
            ephemeral: true
        })
    )
    async remove(
        @SlashOption({
            name: 'infractions',
            description: 'amount of infractions necessary',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        infractions: number,
        interaction: CommandInteraction
    ) {
        const punishments = container.resolve(Punishments);

        if (await punishments.remove(infractions)) {
            return interaction.reply({
                content: `${interaction.member}, infraction removed successfuly!`
            });
        }

        return interaction.reply({
            content: 'Failed to remove interaction!',
            ephemeral: true
        });
    }

    @SlashGroup('table')
    @Slash({
        name: 'show',
        description: 'show infractions table'
    })
    @Guard(
        PermissionGuard(['Administrator'], {
            content: "You don't have admin permission.",
            ephemeral: true
        })
    )
    async show(
        interaction: CommandInteraction
    ) {
        const punishments = container.resolve(Punishments);
        const allInfractions = await punishments.all();

        const infractionMap = allInfractions.map((data) => data.infractions);
        const punishmentMap = allInfractions.map((data) => punishmentText[data.punishment]);
        const durationMap = allInfractions.map((data) => data.duration);

        const embed = new EmbedBuilder()
            .addFields(
                { name: 'Infractions', value: infractionMap.join('\n'), inline: true },
                { name: 'Punishments', value: punishmentMap.join('\n'), inline: true },
                { name: 'Durations', value: durationMap.join('ms\n'), inline: true }
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}
