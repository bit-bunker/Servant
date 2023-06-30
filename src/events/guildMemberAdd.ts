import { TextChannel } from 'discord.js';
import { Discord, On, ArgsOf } from 'discordx';

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const NEWS_CHANNEL_ID = process.env.NEWS_CHANNEL_ID;
const RULES_CHANNEL_ID = process.env.RULES_CHANNEL_ID;
const INTRO_CHANNEL_ID = process.env.INTRO_CHANNEL_ID;

@Discord()
export default class GuildMemberAddEvent {
    @On({ event: 'guildMemberAdd' })
    async onGuildMemberAdd([member]: ArgsOf<'guildMemberAdd'>) {
        // Get welcome channel
        const channel = await member.guild.channels.fetch(WELCOME_CHANNEL_ID);

        // Check if welcome channel is a text channel
        if (channel instanceof TextChannel) {
            // Welcome message
            const message = `
**Olá, ${member}! Boas-vindas à BitBunker!** :tada:

- Você é o nosso membro número **${member.guild.memberCount}**. :eyes:
- Comece falando um pouco sobre você no canal <#${INTRO_CHANNEL_ID}>. :wave:
- As regras do servidor encontram-se no canal <#${RULES_CHANNEL_ID}>. :scroll:
- Você pode ficar por dentro de nossas novidades no canal <#${NEWS_CHANNEL_ID}>. :mega:

Aproveite o tempo que estiver por aqui e sinta-se à vontade para perguntar qualquer coisa se tiver dúvida! :blush:
`;

            await channel.send({ content: message });
        }
    }
}
