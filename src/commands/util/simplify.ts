import { Command } from 'discord-akairo';
import type { Message } from 'discord.js';
import * as math from 'mathjs';
import util from '../../util/util';

export default class SimplifyCommand extends Command {
  public constructor() {
    super('simplify', {
      aliases: ['simplify'],
      args: [
        {
          id: 'expr',
          match: 'content',
          otherwise: 'where is the expression?'
        },
      ],
      category: 'util',
      cooldown: 4e3,
      description: {
        content: 'Simplifies the expression provided',
        examples: ['2 + 5 / 7', '2x + 5x'],
        usage: '<expression>'
      },
      ratelimit: 3,
    });
  }

  public exec(message: Message, { expr }: { expr: string }) {
    const f = math.parse(expr);
    const simplified = math.simplify(f);
    return message.util?.send(util.code(simplified.toString()));
  }
}
