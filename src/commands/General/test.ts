import { Discord, Slash } from 'discordx';
import { Category } from '@discordx/utilities';
import { CommandInteraction } from 'discord.js';

@Discord()
@Category('General')
export class testCmd {
    @Slash({
        name: 'test',
        description: 'Just a test command'
    })
    async test(interaction: CommandInteraction) {
        await interaction.reply({ content: `This is a Test, ${interaction.member}!` });
    }
}
