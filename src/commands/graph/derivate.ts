import { Argument, Command } from 'discord-akairo';
import { Message, MessageAttachment, Permissions } from 'discord.js';
import * as math from 'mathjs';
import p5 from 'node-p5';
import util from '../../util/util';

export default class DerivateCommand extends Command {
  public constructor() {
    super('derivate', {
      aliases: ['derivate', 'derive'],
      args: [
        {
          default: 100,
          flag: ['-z', '-zoom', '--zoom'],
          id: 'zoom',
          limit: 1,
          match: 'option',
          type: Argument.range('number', 0, 1001),
        },
        {
          default: 2,
          flag: ['-xs', '-xscale', '--xscale'],
          id: 'xscale',
          limit: 1,
          match: 'option',
          type: Argument.range('number', 0, 1001),
        },
        {
          default: 2,
          flag: ['-ys', '-yscale', '--yscale'],
          id: 'yscale',
          limit: 1,
          match: 'option',
          type: Argument.range('number', 0, 1001),
        },
        {
          default: 0,
          flag: ['-xc', '-xcenter', '--xcenter'],
          id: 'xcenter',
          limit: 1,
          match: 'option',
          type: 'number',
        },
        {
          default: 0,
          flag: ['-yc', '-ycenter', '--ycenter'],
          id: 'ycenter',
          limit: 1,
          match: 'option',
          type: 'number',
        },
        {
          id: 'func',
          match: 'rest',
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
    });
  }

  public exec(
    message: Message,
    {
      func,
      xcenter,
      xscale,
      ycenter,
      yscale,
      zoom,
    }: {
      func: string,
      xcenter: number,
      xscale: number,
      ycenter: number,
      yscale: number,
      zoom: number,
    },
  ) {
    let parser: math.Parser;
    try {
      parser = util.getFunction(math.derivative(func, "x").toString())
    } catch {
      return message.util?.reply('there was an error while evaluating your expression');
    }

    return p5.createSketch(function sketch(p: any) {
      p.setup = () => {
        p.createCanvas(500, 500)
        try {
          util.drawGraph(parser, zoom, xscale, yscale, p.createVector(xcenter, ycenter), p)
        } catch {
          return message.util?.reply('there was an error while drawing your graph');
        }
        const buffer = p.canvas.toDataURL().split(",")[1]
        message.util?.send(new MessageAttachment(Buffer.from(buffer, 'base64'), 'derivate.png'));
        p.noLoop();
      }
    });
  }
}
