import { createCanvas } from 'canvas';
import { Command } from 'discord-akairo';
import { Message, MessageAttachment, Permissions } from 'discord.js';
import * as math from 'mathjs';
import util from '../../util/util';

export default class DerivateCommand extends Command {
  public constructor() {
    super('derivate', {
      aliases: ['derivate', 'derive'],
      args: [
        {
          id: 'func',
          match: 'content',
          otherwise: 'you need to input the function',
        },
      ],
      category: 'graph',
      clientPermissions: [Permissions.FLAGS.ATTACH_FILES],
      cooldown: 1e4,
      description: {
        content: 'Displays a graph for the derivate of the function introduced',
        examples: ['x ^ 2 + 2x'],
        usage: '<equation>',
      },
      ratelimit: 2,
      typing: true,
    });
  }

  public exec(message: Message, { func }: { func: string }) {
    const derivative = math.derivative(func, "x")
    const parser = math.parser();
    parser.evaluate("f(x) = " + derivative.toString())
    const res = new Map<number, number>();

    for (let x = -10; x < 10; x += 0.001) {
      parser.evaluate("x = " + x)
      const y = parser.evaluate("f(x)");
      if (typeof y === 'object') continue;
      res.set(x, y);
    }

    let max = Math.max(...res.values());
    let min = Math.min(...res.values());
    max = max < 0 ? 0 : max > 100 ? 100 : max
    min = min > 0 ? 0 : min < -100 ? -100 : min

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, util.map(0, min, max, canvas.height - 2, 0), canvas.width, 2);
    ctx.fillRect(util.map(0, -10, 10, 0, canvas.height), 0, 2, canvas.height);

    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    let isFirst = true
    for (let x = -10; x < 10; x += 0.001) {
      const x1 = util.map(x, -10, 10, 0, canvas.width);
      const y1 = util.map(res.get(x)!, min, max, canvas.height, 0);
      if (isFirst) {
        ctx.moveTo(x1, y1);
        isFirst = false;
      } else ctx.lineTo(x1, y1);
    }

    ctx.stroke();
    return message.util?.send(new MessageAttachment(canvas.toBuffer(), 'derivate.png'));
  }
}
