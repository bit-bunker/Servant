import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { Category, PermissionGuard } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, GuildChannel } from 'discord.js';

@Discord()
@Category('Moderation')
export default class ClearCommand {
  @Slash({
    name: 'clear',
    description: 'clear messages'
  })
  @Guard(
    PermissionGuard(['ManageMessages'], {
      content: "You don't have manage messages permission.",
      ephemeral: true
    })
  )
  async clear(
    @SlashOption({
      name: 'count',
      description: 'count of messages to clear',
      required: true,
      type: ApplicationCommandOptionType.Number,
      maxValue: 100,
      minValue: 1
    })
    count: number,
    interaction: CommandInteraction
  ) {
    const channel = interaction.channel;
    if (channel instanceof GuildChannel) {
      const messages = await channel.bulkDelete(count);
      await interaction.reply({
        content: `${interaction.member}, **${messages.size}** messages was deleted!`,
        ephemeral: true
      });
    }
  }
}
