import { Command } from 'discord-akairo'
import { Message, Permissions } from 'discord.js';
import * as math from 'mathjs';

export default class MathCommand extends Command {
  public constructor() {
    super('math', {
      aliases: ['math'],
      args: [
        {
          id: 'expr',
          match: 'content',
          otherwise: 'you need to input the expression',
        },
      ],
      clientPermissions: [Permissions.FLAGS.ATTACH_FILES],
      description: {
        content: 'Evaluates a math expression',
      },
      ratelimit: 2,
    })
  }

  public exec(message: Message, { expr }: { expr: string }) {
    return message.util?.reply(math.evaluate(expr));
  }
}
