import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, User } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { container } from 'tsyringe';
import { User as UserModel } from '../../models/User';

@Discord()
@Category('Moderation')
export default class PardonCommand {
    @Slash({
        name: 'pardon',
        description: 'pardon infraction points'
    })
    @Guard(
        PermissionGuard(['ModerateMembers'], {
            content: "You don't have moderate members permission.",
            ephemeral: true
        })
    )
    async pardonCommand(
        @SlashOption({
            name: 'user',
            description: 'user to pardon infraction points',
            required: true,
            type: ApplicationCommandOptionType.User
        })
        user: User,
        @SlashOption({
            name: 'amount',
            description: 'amount of infraction points to pardon',
            required: true,
            type: ApplicationCommandOptionType.Integer
        })
        amount: number,
        interaction: CommandInteraction
    ) {
        const userModel = container.resolve(UserModel);

        if (await userModel.update(user.id, { infractions: { decrement: amount } })) {
            return interaction.reply({
                content: `${interaction.member}, pardoned \`${amount}\` infraction points of ${user}`
            });
        }

        return interaction.reply({
            content: 'Failed to pardon infraction points of specified user',
            ephemeral: true
        });
    }
}
