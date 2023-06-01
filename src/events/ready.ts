import { Client, Discord, Once, ArgsOf } from 'discordx';
import {ActivityType} from 'discord.js';

@Discord()
class readyEvent {
  @Once({ event: "ready" })
  async onReady(
    []: ArgsOf<"ready">,
    client: Client,) {
    await client.initApplicationCommands();
    client.user?.setActivity({name: `Life out`, type: ActivityType.Playing});
    console.log(`${client.user?.tag} is ready!`);
  }
}
