import { createCanvas } from 'canvas';
import { Command } from 'discord-akairo';
import { Message, MessageAttachment, Permissions } from 'discord.js';
import * as math from 'mathjs';
import util from '../util/util';

export default class GraphCommand extends Command {
  public constructor() {
    super('graph', {
      aliases: ['graph'],
      args: [
        {
          flag: ['-s', '--squares'],
          id: 'squares',
          match: 'flag',
        },
        {
          id: 'func',
          match: 'rest',
          otherwise: 'you need to input the function',
        }
      ],
      clientPermissions: [Permissions.FLAGS.ATTACH_FILES],
      description: {
        content: 'Displays a graph for the function introduced',
      },
      ratelimit: 2,
    });
  }

  public exec(message: Message, { squares, func }: { squares: boolean, func: string }) {
    const fn = math.simplify(func);
    const parser = math.parser();
    parser.evaluate("f(x) = " + fn.toString());
    const res = new Map<number, number>();

    for (let x = -10; x < 10; x += 0.001) {
      parser.evaluate("x = " + x)
      const y =  parser.evaluate("f(x)");
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

    if (squares) {
      ctx.fillStyle = '#FF0000';

      for (let x = -10; x < 10; x += 0.001) {
        const x1 = util.map(x, -10, 10, 0, canvas.width);
        const y1 = util.map(res.get(x)!, min, max, canvas.height, 0);

        ctx.fillRect(x1, y1, 2, 2);
      }

      ctx.fill();
    } else {
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
    }

    return message.util?.send(new MessageAttachment(canvas.toBuffer(), 'graph.png'));
  }
}
