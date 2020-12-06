import { Command } from 'discord-akairo';
import { Message, MessageAttachment, Permissions } from 'discord.js';
import * as math from 'mathjs';
import p5 from 'node-p5';

export default class GraphCommand extends Command {
  public constructor() {
    super('graph', {
      aliases: ['graph'],
      args: [
        {
          id: 'func',
          match: 'rest',
          otherwise: 'you need to input the function',
        }
      ],
      category: 'graph',
      clientPermissions: [Permissions.FLAGS.ATTACH_FILES],
      cooldown: 1e4,
      description: {
        content: 'Displays a graph for the expression introduced',
        examples: ['cos(x)', '--squares tan(x)'],
        usage: '<equation> [--squares]',
      },
      ratelimit: 2,
    });
  }

  public exec(message: Message, { func }: { func: string }) {
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

    return p5.createSketch(function sketch(p: any) {
      p.setup = () => {
        p.createCanvas(500, 500);
        p.background(255, 0);
        p.push();
        p.noFill();
        p.stroke(255, 200);
        p.strokeWeight(2);
        p.line(0, p.map(0, min, max, p.height - 2, 0), p.width, p.map(0, min, max, p.height - 2, 0));
        p.line(p.map(0, -10, 10, 0, p.height), 0, p.map(0, -10, 10, 0, p.height), p.height);
        p.pop();
        p.push();
        p.noFill();
        p.stroke(255, 0, 0);
        p.strokeWeight(2);
        p.beginShape();
        let preX = null;
        let preY = null;
        for (let x = -10; x < 10; x += 0.001) {
          const x1 = p.map(x, -10, 10, 0, p.width);
          const y1 = p.map(res.get(x)!, min, max, p.height, 0);
          if(preX != null && preY != null){
            if(p.dist(preX, preY, x1, y1) > 25){
              p.endShape();
              p.beginShape()
            }
          }
          p.vertex(x1, y1);
          preX = x1;
          preY = y1;
        }
        p.endShape();

        const buffer = p.canvas.toDataURL().split(",")[1]
        message.util?.send(new MessageAttachment(Buffer.from(buffer, 'base64'), 'derivate.png'));

        p.noLoop();
      }
    });
  }
}
