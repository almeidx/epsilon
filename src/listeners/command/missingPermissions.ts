import { Listener, Command } from 'discord-akairo';
import { Message, Permissions } from 'discord.js';
import { PERMISSIONS } from '../../util/constants';

export default class MissingPermissionsListener extends Listener {
  public constructor() {
    super('missingPermissions', {
      category: 'commandHandler',
      emitter: 'commandHandler',
      event: 'missingPermissions',
    });
  }

  public exec(message: Message, command: Command, type: 'client' | 'user', missing: number[]): Promise<Message> {
    const missingPerms = new Permissions(missing).toArray() as (keyof typeof PERMISSIONS)[];
    return message.reply(`${type === 'client' ? 'for me ' : ''}to run the \`${command}\` command ${type === 'client' ? 'I' : 'you'} need the following permission${missingPerms.length !== 1 ? 's' : ''}: ${missingPerms.map((p) => `**${PERMISSIONS[p]}**`)}`);
  }
}
