import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  public constructor() {
    super('ready', {
      category: 'client',
      emitter: 'client',
      event: 'ready'
    });
  }

  public exec() {
    console.log('Client is ready');
  }
}
