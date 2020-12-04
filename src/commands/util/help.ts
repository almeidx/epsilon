import { Command } from 'discord-akairo';
import { Message, MessageEmbedOptions, Permissions, Util } from 'discord.js';

export default class HelpCommand extends Command {
  public constructor() {
    super('help', {
      aliases: ['help', 'h', 'commands'],
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
      category: 'util',
      clientPermissions: [Permissions.FLAGS.EMBED_LINKS],
      cooldown: 5e3,
      description: {
        content: 'Displays a list of available commands, or detailed information for a specified command.',
        examples: ['help', 'help info', 'help info list'],
        usage: '[command] [subcommand]',
      },
      ratelimit: 2,
    })
  }

  public exec(message: Message, { command }: { command?: Command }) {
    if (!command) {
      const embed: MessageEmbedOptions = {
        author: {
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        },
        color: 0x098fad,
        description: `**${Util.escapeBold(this.client.user!.username)}** is a bot with multiple math related commands, for visualizing graphs, calculating derivative functions or evaluating expressions.`,
        fields: [],
        timestamp: new Date(),
        footer: {
          text: message.author.tag,
        },
      };

      for (const category of this.handler.categories.values()) {
        const categoryName = category.id.replace(/(\b\w)/gi, (s) => s.toUpperCase());

        const commands = category
          .filter((c) => c.aliases.length > 0)
          .map((c) => `\`${c.aliases[0]}\``)
          .join(' ');

        if (commands.length) embed.fields!.push({ inline: false, name: categoryName, value: commands });
      }

      return message.util?.send({ embed });
    }
  }
}
