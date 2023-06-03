import { ArgsOf, Client, Discord, On } from 'discordx';

@Discord()
export default class InteractionCreateEvent {
    @On({ event: 'interactionCreate' })
    async onInteractionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
        client.executeInteraction(interaction);
    }
}
