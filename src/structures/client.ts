import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { join } from 'path';

export default class Client extends AkairoClient {
  public readonly commandHandler: CommandHandler = new CommandHandler(this, {
    aliasReplacement: /-/g,
    allowMention: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    commandUtilSweepInterval: 6e5,
    defaultCooldown: 3e3,
    directory: join(__dirname, '..', 'commands'),
    handleEdits: true,
    prefix: '?',
  });

  public readonly listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', 'listeners'),
  });

  public readonly inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, '..', 'inhibitors'),
  });

  public constructor() {
    super({
      ownerID: [
        '385132696135008259',
        '263073389432930314',
      ],
    }, {
      disableMentions: 'everyone',
      messageCacheLifetime: 180,
      messageCacheMaxSize: 10,
      messageEditHistoryMaxSize: 2,
      messageSweepInterval: 300,
      restSweepInterval: 30,
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MESSAGES',
          'DIRECT_MESSAGES',
        ],
      },
    });
  }

  private async init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public async start(): Promise<string> {
    await this.init();
    return this.login();
  }
}
