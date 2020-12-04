import { Inhibitor } from 'discord-akairo';
import { Message, Permissions } from 'discord.js';

export default class BasePermissionsInhibitor extends Inhibitor {
  public constructor() {
    super('basePermissions', {
      category: 'commandHandler',
      reason: 'basePermissions',
    });
  }

  public exec(message: Message): boolean {
    if (message.channel.type === 'dm') return false;
    return !message.channel.permissionsFor(message.guild!.me!)?.has(Permissions.FLAGS.SEND_MESSAGES);
  }
}
