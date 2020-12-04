import { Listener } from 'discord-akairo';

export default class UncaughtExceptionListener extends Listener {
  public constructor() {
    super('uncaughtException', {
      category: 'process',
      emitter: 'process',
      event: 'uncaughtException',
    });
  }

  public exec(error?: Error): void {
    console.error('uncaughtException', error);
    this.client.destroy();
    process.exit(1);
  }
}
