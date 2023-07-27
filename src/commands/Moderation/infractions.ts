import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, User as DiscordUser } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { container } from 'tsyringe';
import { User } from '../../models/User';

@Discord()
@Category('Moderation')
export default class InfractionsCommand {
    @Slash({
        name: 'infractions',
        description: 'show user infractions'
    })
    @Guard(
        PermissionGuard(['ModerateMembers'], {
            content: "You don't have moderate members permission.",
            ephemeral: true
        })
    )
    async infractions(
        @SlashOption({
            name: 'user',
            description: 'user to see infractions',
            required: false,
            type: ApplicationCommandOptionType.User
        })
        user: DiscordUser | null,
        interaction: CommandInteraction
    ) {
        if (!user) user = interaction.user;

        const member = await interaction.guild?.members.fetch({ user });
        if (!member) return;

        const userModel = container.resolve(User);
        const userData = await userModel.find({ id: member.id });
        const infractionCount = userData ? userData.infractions : 0;

        return interaction.reply({
            content: `${interaction.member}, ${member} has \`${infractionCount}\` infractions!`
        });
    }
}
