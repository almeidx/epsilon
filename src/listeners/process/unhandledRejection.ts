import { Listener } from 'discord-akairo';

export default class UnhandledRejectionListener extends Listener {
  public constructor() {
    super('unhandledRejection', {
      category: 'process',
      emitter: 'process',
      event: 'unhandledRejection',
    });
  }

  public exec(error: Error): void {
    console.error('unhandledRejection', error);
  }
}
