import { Util as DiscordUtil } from 'discord.js';
import * as math from 'mathjs';

export default abstract class Util {
  public static code(content: string, lang = ''): string {
    return `\`\`\`${lang}\n${DiscordUtil.escapeCodeBlock(content)}\n\`\`\``;
  }

  public static getFunction(expression: string): math.Parser {
    const parser = math.parser();
    parser.evaluate(`${/f\(x\)\s*\=/i.test(expression) ? '' : 'f(x) = '}${expression}`)
    return parser;
  }

  public static drawGraph(parser: math.Parser, zoom: number, xScale: number, yScale: number, middle: any, p: any) {
    p.background(24, 26, 27);

    const xRange = p.width / zoom;
    const xMin = -(xRange / 2) + (middle.x)
    const xMax = (xRange / 2) + (middle.x)

    const yRange = p.height / zoom;
    const yMin = -(yRange / 2) - (middle.y)
    const yMax = (yRange / 2) - (middle.y)

    //Draw small lines
    p.push();
    p.noFill();
    p.stroke(51, 52, 53);
    p.strokeWeight(1);
    let xChange = xScale;
    let yChange = yScale;
    const sChangeX = xChange / 4
    const sChangeY = yChange / 4

    for(let x = (p.floor(xMin) % sChangeX === 0 ? p.floor(xMin) : p.floor(xMin) - (p.floor(xMin) % sChangeX)); x <= (p.ceil(xMax) % sChangeX === 0 ? p.ceil(xMax) : p.ceil(xMax) + (p.floor(xMin) % sChangeX)); x += sChangeX){
      p.line(p.map(x, xMin, xMax, 0, p.width), 0, p.map(x, xMin, xMax, 0, p.width), p.height)
    }
    for(let y = (p.floor(yMin) % sChangeY === 0 ? p.floor(yMin) : p.floor(yMin) - (p.floor(yMin) % sChangeY)); y <= (p.ceil(yMax) % sChangeY === 0 ? p.ceil(yMax) : p.ceil(yMax) + (p.floor(yMin) % sChangeY)); y += sChangeY){
      p.line(0, p.map(y, yMin, yMax, 0, p.height), p.width, p.map(y, yMin, yMax, 0, p.height))
    }
    p.pop();

    //Draw medium lines
    p.push();
    p.noFill();
    p.stroke(111, 112, 113);
    p.strokeWeight(2);

    for(let x = (p.floor(xMin) % xChange === 0 ? p.floor(xMin) : p.floor(xMin) - (p.floor(xMin) % xChange)); x <= (p.ceil(xMax) % xChange === 0 ? p.ceil(xMax) : p.ceil(xMax) + (p.floor(xMax) % xChange)); x += xChange){
      p.line(p.map(x, xMin, xMax, 0, p.width), 0, p.map(x, xMin, xMax, 0, p.width), p.height)
      p.push()
      if(math.round(x, 4) !== 0){
        p.fill(242, 242, 242)
        p.stroke(0)
        p.strokeWeight(1)
        p.textAlign(p.CENTER, p.TOP)
        p.textSize(12)
        const def =  p.map(0, yMin, yMax, 0, p.height) + 5
        let place = (def < 5 ? 5 : def)
        place = place > p.height - 10 ? p.height - 10 : place
        if(place > p.height - 10){
          p.textAlign(p.CENTER, p.BOTTOM)
        }
        p.text(math.round(x, 4), p.map(x, xMin, xMax, 0, p.width), place)
      }
      p.pop()
    }
    for(let y = (p.floor(yMin) % yChange === 0 ? p.floor(yMin) : p.floor(yMin) - (p.floor(yMin) % yChange)); y <= (p.ceil(yMax) % yChange === 0 ? p.ceil(yMax) : p.ceil(yMax) + (p.floor(yMax) % yChange)); y += yChange){
      p.line(0, p.map(y, yMin, yMax, 0, p.height), p.width, p.map(y, yMin, yMax, 0, p.height))
      p.push()
      if(math.round(y, 4) !== 0){
        p.fill(242, 242, 242)
        p.stroke(0)
        p.strokeWeight(1)
        p.textAlign(p.RIGHT, p.CENTER)
        p.textSize(12)
        const def =  p.map(0, xMin, xMax, 0, p.width) - 5
        let place = (def < 5 ? 5 : def)
        place = place > p.width - 5 ? p.width - 5 : place
        if(def < 5){
          p.textAlign(p.LEFT, p.CENTER)
        }
        p.text(math.round(-y, 4), place, p.map(y, yMin, yMax, 0, p.height))
      }
      p.pop()
    }

    p.pop();

    //Draw main axis
    p.push()
    p.noFill();
    p.stroke(221, 221, 221);
    p.strokeWeight(3);
    p.line(0, p.map(0, yMin, yMax, 0, p.height), p.width, p.map(0, yMin, yMax, 0, p.height))
    p.line(p.map(0, xMin, xMax, 0, p.width), 0, p.map(0, xMin, xMax, 0, p.width), p.height)
    p.pop()

    Util.drawFunc(parser, p, xMin, xMax, yMin, yMax);
  }

  public static drawFunc(parser: math.Parser, p: any, xMin: number, xMax: number, yMin: number, yMax: number) {
    p.push()
    p.beginShape()
    p.noFill()
    p.stroke(177, 100, 97)
    p.strokeWeight(2)
    let prey = null
    for(let x = xMin; x <= xMax; x +=(xMax - xMin) / 10000){
      parser.evaluate("x = " + x)
      const res = parser.evaluate("f(x)")
      if (prey !== null){
        if(p.dist(x, res, x -0.5, prey) > 100){
          p.endShape()
          p.beginShape()
        }
      }
      prey = res
      p.vertex(p.map(x, xMin, xMax, 0, p.width), p.map(-res, yMin, yMax, 0, p.height))
    }
    p.endShape()
    p.pop()
  }
}
