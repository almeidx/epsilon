import { Command } from 'discord-akairo'
import type { Message } from 'discord.js';
import * as math from 'mathjs';
import util from '../../util/util';

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
      category: 'util',
      cooldown: 4e3,
      description: {
        content: 'Evaluates the expression provided',
        examples: ['sqrt(42) ^ 5', '1 + 2'],
        usage: '<expression>'
      },
      ratelimit: 3,
    })
  }

  public exec(message: Message, { expr }: { expr: string }) {
    return message.util?.send(util.code(math.evaluate(expr)));
  }
}
