import 'dotenv/config';
import { Client, MessageAttachment } from 'discord.js';
import * as math from 'mathjs';
import { createCanvas } from 'canvas';

const client = new Client();

client.login();

client.on('ready', () => console.log('Client is ready'))

client.on('message', async (message) => {
  if (message.author.bot || !message.guild || !message.content || !message.content.startsWith('?')) return;

  const args = message.content.split(' ');
  const command = args.shift()!.replace(/^\?/, '');

  switch (command.toLowerCase()) {
    case 'graph': {
      const fn = math.evaluate(args.join(' '));
      const res = new Map<number, number>();

      for (let x = -10; x < 10; x += 0.001) {
        const y = fn(x);
        if (typeof y === 'object') continue;
        res.set(x, y);
      }

      const max = Math.max(...res.values());
      const min = Math.min(...res.values());

      const canvas = createCanvas(200, 200);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#FFFFFF';
      /* x, y */
      ctx.fillRect(0, map(0, min , max, canvas.height - 1, 0), canvas.width, 1);
      ctx.fillRect(map(0, -10, 10, 0, canvas.height), 0, 1, canvas.height);
      console.log(min, max);

      ctx.fillStyle = '#FF0000';

      ctx.beginPath();
      let isFirst = true
      for (let x = -10; x < 10; x += 0.001) {
        const x1 = map(x, -10, 10, 0, canvas.width);
        const y1 = map(res.get(x)!, min, max, canvas.height, 0);
        if (isFirst) {
          ctx.moveTo(x1, y1);
          isFirst = false;
        } else ctx.lineTo(x1, y1);
      }

      ctx.stroke();

      await message.channel.send(new MessageAttachment(canvas.toBuffer(), 'graph.png'));
    }
    case 'math': {
      if (!args.length) return message.reply('wheres the expression?');
      return message.reply(math.evaluate(args.join(' ')));
    }
  }
});

function map(val: number, min1: number, max1: number, min2: number, max2: number): number {
  return min2 + ((max2 - min2) / (max1 - min1)) * (val - min1);
}
