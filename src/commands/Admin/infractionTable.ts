import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, SlashGroup, Slash, Guard, SlashOption, SlashChoice } from 'discordx';
import { Punishment, Infraction } from '../../models/Infraction';
import { container } from 'tsyringe';

const punishmentText = ['warn', 'mute', 'ban'];

@Discord()
@Category('Admin')
@SlashGroup({ name: 'infraction', description: 'infraction' })
@SlashGroup({ name: 'table', description: 'table', root: 'infraction' })
export class InfractionTableCommands {
    @SlashGroup('table', 'infraction')
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
            name: 'points',
            description: 'infractions points necessary to trigger punishment',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        points: number,
        @SlashChoice({ name: 'Warning', value: Punishment.WARNING })
        @SlashChoice({ name: 'Timeout', value: Punishment.TIMEOUT })
        @SlashChoice({ name: 'Banishment', value: Punishment.BANISHMENT })
        @SlashOption({
            name: 'punishment',
            description: 'punishment to apply when triggered',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        punishment: Punishment,
        @SlashOption({
            name: 'duration',
            description: 'how much time will the punishment last',
            required: false,
            type: ApplicationCommandOptionType.Integer
        })
        timeAmount: number,
        @SlashChoice({ name: 'seconds', value: 1000 })
        @SlashChoice({ name: 'minutes', value: 1000 * 60 })
        @SlashChoice({ name: 'hours', value: 1000 * 60 * 60 })
        @SlashChoice({ name: 'days', value: 1000 * 60 * 60 * 24 })
        @SlashOption({
            name: 'unit',
            description: 'unit of time',
            required: false,
            type: ApplicationCommandOptionType.Integer
        })
        timeUnit: number,
        interaction: CommandInteraction
    ) {
        const duration = timeAmount * timeUnit || 0;
        const infractionModel = container.resolve(Infraction);
        const infractionAlreadyExists = await infractionModel.find({ points });

        if (infractionAlreadyExists) {
            return interaction.reply({
                content: 'This infraction already exists in table. If you want to update, use the proper command.',
                ephemeral: true
            });
        }

        if (await infractionModel.add({ points, punishment, duration })) {
            return interaction.reply({
                content: `${interaction.member}, infraction successfuly added to the table!`
            });
        }

        return interaction.reply({
            content: 'Failed to add infraction to the table!',
            ephemeral: true
        });
    }

    @SlashGroup('table', 'infraction')
    @Slash({
        name: 'update',
        description: 'update infraction from table'
    })
    @Guard(
        PermissionGuard(['Administrator'], {
            content: "You don't have admin permission.",
            ephemeral: true
        })
    )
    async update(
        @SlashOption({
            name: 'points',
            description: 'infractions points necessary to trigger punishment',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        points: number,
        @SlashChoice({ name: 'Warning', value: Punishment.WARNING })
        @SlashChoice({ name: 'Timeout', value: Punishment.TIMEOUT })
        @SlashChoice({ name: 'Banishment', value: Punishment.BANISHMENT })
        @SlashOption({
            name: 'punishment',
            description: 'punishment to apply when triggered',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        punishment: Punishment,
        @SlashOption({
            name: 'duration',
            description: 'how much time will the punishment last',
            required: false,
            type: ApplicationCommandOptionType.Integer
        })
        timeAmount: number,
        @SlashChoice({ name: 'seconds', value: 1000 })
        @SlashChoice({ name: 'minutes', value: 1000 * 60 })
        @SlashChoice({ name: 'hours', value: 1000 * 60 * 60 })
        @SlashChoice({ name: 'days', value: 1000 * 60 * 60 * 24 })
        @SlashOption({
            name: 'unit',
            description: 'unit of time',
            required: false,
            type: ApplicationCommandOptionType.Integer
        })
        timeUnit: number,
        interaction: CommandInteraction
    ) {
        const duration = timeAmount * timeUnit || 0;
        const infractionModel = container.resolve(Infraction);
        const existingInfraction = await infractionModel.find({ points });

        if (existingInfraction) {
            if (await infractionModel.update({ points, punishment, duration })) {
                return interaction.reply({
                    content: `${interaction.member}, infraction updated!`
                });
            }
        }

        return interaction.reply({
            content: 'Failed to update infraction!',
            ephemeral: true
        });
    }

    @SlashGroup('table', 'infraction')
    @Slash({
        name: 'del',
        description: 'del infraction from table'
    })
    @Guard(
        PermissionGuard(['Administrator'], {
            content: "You don't have admin permission.",
            ephemeral: true
        })
    )
    async remove(
        @SlashOption({
            name: 'points',
            description: 'infractions points to be removed from table',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        points: number,
        interaction: CommandInteraction
    ) {
        const infractionModel = container.resolve(Infraction);

        if (await infractionModel.del(points)) {
            return interaction.reply({
                content: `${interaction.member}, infraction successfuly removed from table!`
            });
        }

        return interaction.reply({
            content: 'Failed to remove interaction from table!',
            ephemeral: true
        });
    }

    @SlashGroup('table', 'infraction')
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
    async show(interaction: CommandInteraction) {
        const infractionModel = container.resolve(Infraction);
        const infractions = await infractionModel.all();
        const points = infractions.map((data) => data.points);
        const punishments = infractions.map((data) => punishmentText[data.punishment]);
        const durations = infractions.map((data) => data.duration);

        const embed = new EmbedBuilder().addFields(
            { name: 'Infractions', value: points.join('\n'), inline: true },
            { name: 'Punishments', value: punishments.join('\n'), inline: true },
            { name: 'Durations', value: durations.join('\n'), inline: true }
        );

        await interaction.reply({
            embeds: [embed]
        });
    }
}
